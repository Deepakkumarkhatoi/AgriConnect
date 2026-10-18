import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Listing } from '../models/Listing';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const buyerId = req.user?.userId;
    const buyerUser = await User.findById(buyerId);

    if (!buyerUser) {
      res.status(404).json({ success: false, error: 'Buyer account not found.' });
      return;
    }

    const { listingId, quantity, offeredPricePerUnit, note, deliveryPreference } = req.body;

    if (!listingId || !quantity || !offeredPricePerUnit) {
      res.status(400).json({
        success: false,
        error: 'listingId, quantity, and offeredPricePerUnit are required.',
      });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'active') {
      res.status(400).json({ success: false, error: 'Listing is not active or available for sale.' });
      return;
    }

    const requestedQty = Number(quantity);
    if (requestedQty <= 0) {
      res.status(400).json({ success: false, error: 'Requested quantity must be greater than zero.' });
      return;
    }

    if (requestedQty > listing.quantityAvailable) {
      res.status(400).json({
        success: false,
        error: `Requested quantity (${requestedQty} ${listing.unit}) exceeds available stock (${listing.quantityAvailable} ${listing.unit}).`,
      });
      return;
    }

    const offeredPrice = Number(offeredPricePerUnit);
    const totalAmount = requestedQty * offeredPrice;

    const initialMessage = {
      senderId: new mongoose.Types.ObjectId(buyerId),
      senderName: buyerUser.name,
      senderRole: buyerUser.role,
      text: note || `I would like to purchase ${requestedQty} ${listing.unit} at ₹${offeredPrice}/${listing.unit}.`,
      proposedPrice: offeredPrice,
      timestamp: new Date(),
    };

    const order = await Order.create({
      buyerId: buyerUser._id,
      buyerName: buyerUser.name,
      buyerPhone: buyerUser.phone,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      listingId: listing._id,
      crop: listing.crop,
      quantity: requestedQty,
      unit: listing.unit,
      offeredPricePerUnit: offeredPrice,
      totalAmount,
      deliveryPreference: deliveryPreference || 'Farm gate pickup',
      status: 'inquiry',
      messages: [initialMessage],
    });

    // Notify farmer of new purchase request
    await Notification.create({
      recipientId: listing.farmerId,
      type: 'order',
      title: `New Offer for ${listing.crop}!`,
      message: `${buyerUser.name} proposed to buy ${requestedQty} ${listing.unit} at ₹${offeredPrice}/${listing.unit}.`,
      link: `/farmer/orders/${order._id}`,
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { status } = req.query;

    const filter: any = {};
    if (role === 'buyer') filter.buyerId = userId;
    else if (role === 'farmer') filter.farmerId = userId;
    // Admins see all orders

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('listingId', 'crop variety images qualityGrade')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;

    const order = await Order.findById(id).populate('listingId');
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    // Role-based visibility check
    if (
      role !== 'admin' &&
      order.buyerId.toString() !== userId &&
      order.farmerId.toString() !== userId
    ) {
      res.status(403).json({ success: false, error: 'Access denied to this order.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function negotiateOrder(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { id } = req.params;
    const { message, counterPrice } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    const isFarmer = order.farmerId.toString() === userId;
    const isBuyer = order.buyerId.toString() === userId;

    if (!isFarmer && !isBuyer && userRole !== 'admin') {
      res.status(403).json({ success: false, error: 'Unauthorized to participate in this negotiation.' });
      return;
    }

    const user = await User.findById(userId);

    if (counterPrice !== undefined) {
      order.counterPricePerUnit = Number(counterPrice);
      order.status = 'negotiating';
    }

    order.messages.push({
      senderId: new mongoose.Types.ObjectId(userId),
      senderName: user ? user.name : 'Participant',
      senderRole: userRole || 'user',
      text: message || `Counter-proposal: ₹${counterPrice}/${order.unit}`,
      proposedPrice: counterPrice ? Number(counterPrice) : undefined,
      timestamp: new Date(),
    });

    await order.save();

    // Notify the other party
    const recipientId = isFarmer ? order.buyerId : order.farmerId;
    await Notification.create({
      recipientId,
      type: 'order',
      title: `Update on Order for ${order.crop}`,
      message: `${user?.name} sent a negotiation message: "${message || `Offered ₹${counterPrice}`}"`,
      link: isFarmer ? `/buyer/orders/${order._id}` : `/farmer/orders/${order._id}`,
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { id } = req.params;
    const { status, finalPrice } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    const isFarmer = order.farmerId.toString() === userId;
    const isBuyer = order.buyerId.toString() === userId;

    if (!isFarmer && !isBuyer && userRole !== 'admin') {
      res.status(403).json({ success: false, error: 'Access denied.' });
      return;
    }

    // Business rule: Accepting an order reserves/deducts listing inventory atomically
    if (status === 'accepted') {
      if (!isFarmer && userRole !== 'admin') {
        res.status(403).json({ success: false, error: 'Only the farmer can accept an order.' });
        return;
      }

      const listing = await Listing.findById(order.listingId);
      if (!listing) {
        res.status(404).json({ success: false, error: 'Underlying produce listing does not exist.' });
        return;
      }

      if (listing.quantityAvailable < order.quantity) {
        res.status(400).json({
          success: false,
          error: `Insufficient quantity available to accept this order. Remaining: ${listing.quantityAvailable} ${listing.unit}`,
        });
        return;
      }

      // Deduct inventory atomically
      listing.quantityAvailable = Math.max(0, listing.quantityAvailable - order.quantity);
      if (listing.quantityAvailable === 0) {
        listing.status = 'sold';
      }
      await listing.save();

      order.status = 'accepted';
      if (finalPrice) {
        order.offeredPricePerUnit = Number(finalPrice);
        order.totalAmount = order.quantity * Number(finalPrice);
      }
    } else if (status === 'cancelled' || status === 'rejected') {
      // If was previously accepted, return stock back to listing
      if (order.status === 'accepted') {
        await Listing.findByIdAndUpdate(order.listingId, {
          $inc: { quantityAvailable: order.quantity },
          $set: { status: 'active' },
        });
      }
      order.status = status;
    } else {
      order.status = status;
    }

    await order.save();

    // Send notification
    const recipientId = isFarmer ? order.buyerId : order.farmerId;
    await Notification.create({
      recipientId,
      type: 'order',
      title: `Order Status Changed: ${status.toUpperCase()}`,
      message: `Your order for ${order.quantity} ${order.unit} of ${order.crop} is now ${status}.`,
      link: isFarmer ? `/buyer/orders/${order._id}` : `/farmer/orders/${order._id}`,
    });

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(userId),
      actorName: req.user?.name || 'User',
      actorRole: userRole || 'user',
      action: `ORDER_${status.toUpperCase()}`,
      entityType: 'Order',
      entityId: order._id.toString(),
      details: { status, quantity: order.quantity, crop: order.crop },
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

import { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';

export async function getListings(req: Request, res: Response): Promise<void> {
  try {
    const { crop, district, state, qualityGrade, minPrice, maxPrice, status } = req.query;

    const filter: any = {};

    // By default only return active listings unless specified
    filter.status = status || 'active';

    if (crop) filter.crop = { $regex: new RegExp(String(crop), 'i') };
    if (district && district !== 'All') filter.district = String(district);
    if (state && state !== 'All') filter.state = String(state);
    if (qualityGrade && qualityGrade !== 'All') filter.qualityGrade = String(qualityGrade);

    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: listings.length, listings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getListingById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('farmerId', 'name phone email district state');

    if (!listing) {
      res.status(404).json({ success: false, error: 'Produce listing not found.' });
      return;
    }

    res.json({ success: true, listing });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getMyListings(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const listings = await Listing.find({ farmerId }).sort({ createdAt: -1 });

    res.json({ success: true, listings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createListing(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const user = await User.findById(farmerId);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const {
      crop,
      variety,
      quantityAvailable,
      unit,
      pricePerUnit,
      qualityGrade,
      village,
      district,
      state,
      harvestDate,
      availabilityDate,
      images,
      description,
    } = req.body;

    if (!crop || !quantityAvailable || !pricePerUnit) {
      res.status(400).json({
        success: false,
        error: 'Crop, quantity available, and price per unit are required.',
      });
      return;
    }

    const listing = await Listing.create({
      farmerId,
      farmerName: user.name,
      farmerPhone: user.phone,
      crop,
      variety: variety || 'Standard',
      quantityAvailable: Number(quantityAvailable),
      initialQuantity: Number(quantityAvailable),
      unit: unit || 'Quintal',
      pricePerUnit: Number(pricePerUnit),
      qualityGrade: qualityGrade || 'Grade A / FAQ',
      village: village || user.village || '',
      district: district || user.district || 'Bhubaneswar',
      state: state || user.state || 'Odisha',
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      availabilityDate: availabilityDate ? new Date(availabilityDate) : new Date(),
      images: Array.isArray(images) ? images : [],
      description: description || '',
      status: 'active',
    });

    await AuditLog.create({
      actorId: user._id,
      actorName: user.name,
      actorRole: user.role,
      action: 'LISTING_CREATED',
      entityType: 'Listing',
      entityId: listing._id.toString(),
      details: { crop, quantity: quantityAvailable, price: pricePerUnit },
    });

    res.status(201).json({ success: true, listing });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateListing(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { id } = req.params;

    const filter: any = { _id: id };
    if (userRole !== 'admin') {
      filter.farmerId = userId;
    }

    const listing = await Listing.findOne(filter);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Listing not found or unauthorized.' });
      return;
    }

    Object.assign(listing, req.body);

    if (listing.quantityAvailable <= 0) {
      listing.status = 'sold';
    }

    await listing.save();

    res.json({ success: true, listing });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteListing(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { id } = req.params;

    const filter: any = { _id: id };
    if (userRole !== 'admin') {
      filter.farmerId = userId;
    }

    const listing = await Listing.findOneAndDelete(filter);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Listing not found or unauthorized.' });
      return;
    }

    res.json({ success: true, message: 'Listing removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SupportTicket } from '../models/SupportTicket';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';

export async function createTicket(req: Request, res: Response): Promise<void> {
  try {
    const farmerId = req.user?.userId;
    const user = await User.findById(farmerId);

    if (!user) {
      res.status(404).json({ success: false, error: 'Farmer profile not found.' });
      return;
    }

    const { subject, description, category, cropName, photoUrl, district, state, priority } = req.body;

    if (!subject || !description) {
      res.status(400).json({ success: false, error: 'Subject and description are required.' });
      return;
    }

    const ticketDistrict = district || user.district || 'Khordha';
    const ticketState = state || user.state || 'Odisha';

    // Auto-assign to an active Agricultural Officer covering this district if available
    const officer = await User.findOne({
      role: 'officer',
      status: 'active',
      $or: [{ district: ticketDistrict }, { jurisdiction: ticketDistrict }, { jurisdiction: 'All' }],
    });

    const ticket = await SupportTicket.create({
      farmerId: user._id,
      farmerName: user.name,
      farmerPhone: user.phone,
      district: ticketDistrict,
      state: ticketState,
      category: category || 'crop_issue',
      priority: priority || 'medium',
      subject,
      description,
      cropName: cropName || '',
      photoUrl: photoUrl || '',
      assignedOfficerId: officer ? officer._id : undefined,
      assignedOfficerName: officer ? officer.name : 'District Agricultural Office',
      messages: [
        {
          senderId: user._id,
          senderName: user.name,
          senderRole: 'farmer',
          text: description,
          createdAt: new Date(),
        },
      ],
    });

    if (officer) {
      await Notification.create({
        recipientId: officer._id,
        type: 'ticket',
        title: `New Farmer Assistance Request: ${subject}`,
        message: `${user.name} reported a ${category || 'crop issue'} in ${ticketDistrict}.`,
        link: `/officer/tickets/${ticket._id}`,
      });
    }

    res.status(201).json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getTickets(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { status, category, district } = req.query;

    const filter: any = {};

    if (role === 'farmer') {
      filter.farmerId = userId;
    } else if (role === 'officer') {
      const officer = await User.findById(userId);
      filter.$or = [
        { assignedOfficerId: userId },
        ...(officer?.district ? [{ district: officer.district }] : []),
        ...(officer?.jurisdiction && officer.jurisdiction !== 'All' ? [{ district: officer.jurisdiction }] : []),
        { assignedOfficerId: { $exists: false } },
      ];
    }
    // Admins see all tickets

    if (status && status !== 'All') filter.status = status;
    if (category && category !== 'All') filter.category = category;
    if (district && district !== 'All') filter.district = district;

    const tickets = await SupportTicket.find(filter).sort({ updatedAt: -1 });

    res.json({ success: true, count: tickets.length, tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getTicketById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, error: 'Support ticket not found.' });
      return;
    }

    // Access check: Farmer can see their own, officers and admins can see tickets in jurisdiction
    if (role === 'farmer' && ticket.farmerId.toString() !== userId) {
      res.status(403).json({ success: false, error: 'Access denied.' });
      return;
    }

    res.json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function addMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;
    const { text, internalOnly } = req.body;

    if (!text) {
      res.status(400).json({ success: false, error: 'Message content is required.' });
      return;
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, error: 'Ticket not found.' });
      return;
    }

    const user = await User.findById(userId);

    ticket.messages.push({
      senderId: new mongoose.Types.ObjectId(userId),
      senderName: user?.name || 'Support Staff',
      senderRole: role || 'user',
      text,
      internalOnly: Boolean(internalOnly && (role === 'officer' || role === 'admin')),
      createdAt: new Date(),
    });

    // If an officer replies, move status from 'open' to 'in_progress'
    if ((role === 'officer' || role === 'admin') && ticket.status === 'open') {
      ticket.status = 'in_progress';
      if (!ticket.assignedOfficerId) {
        ticket.assignedOfficerId = new mongoose.Types.ObjectId(userId);
        ticket.assignedOfficerName = user?.name;
      }
    }

    await ticket.save();

    // Notify the other party
    if (role === 'officer' || role === 'admin') {
      await Notification.create({
        recipientId: ticket.farmerId,
        type: 'ticket',
        title: `Officer Reply: ${ticket.subject}`,
        message: `${user?.name} responded with guidance: "${text.slice(0, 80)}..."`,
        link: `/farmer/support/${ticket._id}`,
      });
    } else if (ticket.assignedOfficerId) {
      await Notification.create({
        recipientId: ticket.assignedOfficerId,
        type: 'ticket',
        title: `Farmer Followup: ${ticket.subject}`,
        message: `${user?.name} updated their ticket.`,
        link: `/officer/tickets/${ticket._id}`,
      });
    }

    res.json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateTicketStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, error: 'Ticket not found.' });
      return;
    }

    if (role === 'farmer' && ticket.farmerId.toString() !== userId && status !== 'closed') {
      res.status(403).json({ success: false, error: 'Only assigned officer or admin can update ticket resolution.' });
      return;
    }

    ticket.status = status;
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    await Notification.create({
      recipientId: ticket.farmerId,
      type: 'ticket',
      title: `Ticket Status: ${status.toUpperCase()}`,
      message: `Your assistance request "${ticket.subject}" has been marked as ${status}.`,
      link: `/farmer/support/${ticket._id}`,
    });

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(userId),
      actorName: req.user?.name || 'Officer',
      actorRole: role || 'officer',
      action: `TICKET_${status.toUpperCase()}`,
      entityType: 'SupportTicket',
      entityId: ticket._id.toString(),
      details: { status, resolutionNotes },
    });

    res.json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

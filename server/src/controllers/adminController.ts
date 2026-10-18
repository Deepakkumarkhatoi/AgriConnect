import { Request, Response } from 'express';
import { User } from '../models/User';
import { Listing } from '../models/Listing';
import { Order } from '../models/Order';
import { SupportTicket } from '../models/SupportTicket';
import { Scheme } from '../models/Scheme';
import { AuditLog } from '../models/AuditLog';

export async function getAdminStats(req: Request, res: Response): Promise<void> {
  try {
    const totalUsers = await User.countDocuments();
    const farmersCount = await User.countDocuments({ role: 'farmer' });
    const buyersCount = await User.countDocuments({ role: 'buyer' });
    const officersCount = await User.countDocuments({ role: 'officer' });
    const pendingVerifications = await User.countDocuments({ status: 'pending_verification' });

    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });

    const totalOrders = await Order.countDocuments();
    const confirmedOrders = await Order.countDocuments({ status: 'accepted' });

    const openTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } });
    const totalSchemes = await Scheme.countDocuments();

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, farmers: farmersCount, buyers: buyersCount, officers: officersCount, pending: pendingVerifications },
        listings: { total: totalListings, active: activeListings },
        orders: { total: totalOrders, accepted: confirmedOrders },
        tickets: { open: openTickets },
        schemes: { total: totalSchemes },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const { role, status, search } = req.query;

    const filter: any = {};
    if (role && role !== 'All') filter.role = role;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(String(search), 'i') } },
        { email: { $regex: new RegExp(String(search), 'i') } },
        { district: { $regex: new RegExp(String(search), 'i') } },
      ];
    }

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    if (status) user.status = status;
    if (role) user.role = role;

    await user.save();

    await AuditLog.create({
      actorId: req.user?.userId,
      actorName: req.user?.name || 'Admin',
      actorRole: 'admin',
      action: 'USER_STATUS_UPDATED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { updatedStatus: status, updatedRole: role },
    });

    res.json({ success: true, user: { id: user._id, name: user.name, status: user.status, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createScheme(req: Request, res: Response): Promise<void> {
  try {
    const { title, code, state, category, department, description, benefits, eligibilityRules, documentsRequired, officialUrl, deadline } = req.body;

    if (!title || !code || !category || !description || !benefits || !officialUrl) {
      res.status(400).json({ success: false, error: 'Title, code, category, description, benefits, and officialUrl are required.' });
      return;
    }

    const scheme = await Scheme.create({
      title,
      code: code.toUpperCase(),
      state: state || 'All-India',
      category,
      department: department || 'Ministry of Agriculture',
      description,
      benefits,
      eligibilityRules: eligibilityRules || {},
      documentsRequired: documentsRequired || [],
      officialUrl,
      deadline: deadline || 'Ongoing',
    });

    await AuditLog.create({
      actorId: req.user?.userId,
      actorName: req.user?.name || 'Admin',
      actorRole: 'admin',
      action: 'SCHEME_CREATED',
      entityType: 'Scheme',
      entityId: scheme._id.toString(),
      details: { title: scheme.title, code: scheme.code },
    });

    res.status(201).json({ success: true, scheme });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateScheme(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true });

    if (!scheme) {
      res.status(404).json({ success: false, error: 'Scheme not found.' });
      return;
    }

    await AuditLog.create({
      actorId: req.user?.userId,
      actorName: req.user?.name || 'Admin',
      actorRole: 'admin',
      action: 'SCHEME_UPDATED',
      entityType: 'Scheme',
      entityId: scheme._id.toString(),
    });

    res.json({ success: true, scheme });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

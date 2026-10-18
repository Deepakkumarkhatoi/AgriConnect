import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const recipientId = req.user?.userId;
    const notifications = await Notification.find({ recipientId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ recipientId, readAt: null });

    res.json({ success: true, unreadCount, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const recipientId = req.user?.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId },
      { readAt: new Date() },
      { new: true }
    );

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  try {
    const recipientId = req.user?.userId;

    await Notification.updateMany({ recipientId, readAt: null }, { readAt: new Date() });

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

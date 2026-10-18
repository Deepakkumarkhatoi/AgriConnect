import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { FarmerProfile } from '../models/FarmerProfile';
import { AuditLog } from '../models/AuditLog';
import { ENV } from '../config/env';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, phone, village, district, state, organization, jurisdiction, farmSizeAcres, cropsGrown } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, error: 'Name, email, password, and role are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, error: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Officers and buyers can have pending_verification status if configured, or active for standard onboarding
    const status = (role === 'officer' || role === 'buyer') ? 'active' : 'active';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      status,
      phone,
      village,
      district,
      state,
      organization,
      jurisdiction,
    });

    // If registering as a farmer, initialize their FarmerProfile
    if (role === 'farmer') {
      await FarmerProfile.create({
        userId: user._id,
        village: village || '',
        district: district || '',
        state: state || '',
        farmSizeAcres: Number(farmSizeAcres) || 0,
        cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : cropsGrown ? [cropsGrown] : [],
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role, name: user.name },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await AuditLog.create({
      actorId: user._id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { role: user.role, email: user.email },
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        language: user.language,
        district: user.district,
        state: user.state,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid credentials. Password incorrect.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, error: 'Account suspended. Please contact administrator.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role, name: user.name },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        language: user.language,
        district: user.district,
        state: user.state,
        jurisdiction: user.jurisdiction,
        organization: user.organization,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Login failed' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      res.status(404).json({ success: false, error: 'User profile not found' });
      return;
    }

    let profile = null;
    if (user.role === 'farmer') {
      profile = await FarmerProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      farmerProfile: profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { name, phone, village, district, state, language, farmSizeAcres, cropsGrown, kisanCreditCard, irrigationType } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(village && { village }),
        ...(district && { district }),
        ...(state && { state }),
        ...(language && { language }),
      },
      { new: true }
    ).select('-passwordHash');

    if (user?.role === 'farmer') {
      await FarmerProfile.findOneAndUpdate(
        { userId },
        {
          ...(village && { village }),
          ...(district && { district }),
          ...(state && { state }),
          ...(farmSizeAcres !== undefined && { farmSizeAcres: Number(farmSizeAcres) }),
          ...(cropsGrown && { cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : [cropsGrown] }),
          ...(kisanCreditCard !== undefined && { kisanCreditCard: Boolean(kisanCreditCard) }),
          ...(irrigationType && { irrigationType }),
        },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

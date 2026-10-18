import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'farmer' | 'buyer' | 'officer' | 'admin';
export type UserStatus = 'active' | 'pending_verification' | 'suspended';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  language: 'en' | 'or' | 'hi';
  district?: string;
  state?: string;
  village?: string;
  jurisdiction?: string; // For agricultural officers
  organization?: string; // For buyers/officers
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'officer', 'admin'],
      default: 'farmer',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending_verification', 'suspended'],
      default: 'active',
    },
    avatar: { type: String, default: '' },
    language: {
      type: String,
      enum: ['en', 'or', 'hi'],
      default: 'en',
    },
    district: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    village: { type: String, trim: true, default: '' },
    jurisdiction: { type: String, trim: true, default: '' },
    organization: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

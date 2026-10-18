import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  village: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  cropsGrown: string[];
  kisanCreditCard: boolean;
  irrigationType: string;
  bankAccountLinked: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerProfileSchema = new Schema<IFarmerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    village: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    farmSizeAcres: { type: Number, default: 0 },
    cropsGrown: { type: [String], default: [] },
    kisanCreditCard: { type: Boolean, default: false },
    irrigationType: { type: String, default: 'Rainfed' },
    bankAccountLinked: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const FarmerProfile = mongoose.model<IFarmerProfile>('FarmerProfile', FarmerProfileSchema);

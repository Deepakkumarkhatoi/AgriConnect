import mongoose, { Schema, Document } from 'mongoose';

export type ListingStatus = 'active' | 'reserved' | 'sold' | 'unlisted';

export interface IListing extends Document {
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone?: string;
  crop: string;
  variety: string;
  quantityAvailable: number;
  initialQuantity: number;
  unit: 'Quintal' | 'Kg' | 'Ton' | 'Bags';
  pricePerUnit: number;
  qualityGrade: string;
  village: string;
  district: string;
  state: string;
  harvestDate?: Date;
  availabilityDate: Date;
  status: ListingStatus;
  images: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String },
    crop: { type: String, required: true, index: true, trim: true },
    variety: { type: String, default: '' },
    quantityAvailable: { type: Number, required: true, min: 0 },
    initialQuantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['Quintal', 'Kg', 'Ton', 'Bags'], default: 'Quintal' },
    pricePerUnit: { type: Number, required: true, min: 1 },
    qualityGrade: { type: String, default: 'Grade A / FAQ' },
    village: { type: String, default: '' },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    harvestDate: { type: Date },
    availabilityDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'reserved', 'sold', 'unlisted'],
      default: 'active',
      index: true,
    },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);

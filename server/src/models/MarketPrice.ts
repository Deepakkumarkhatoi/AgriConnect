import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketPrice extends Document {
  crop: string;
  variety?: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: Date;
  source: string;
  priceTrend: 'up' | 'down' | 'stable';
  createdAt: Date;
  updatedAt: Date;
}

const MarketPriceSchema = new Schema<IMarketPrice>(
  {
    crop: { type: String, required: true, index: true, trim: true },
    variety: { type: String, default: 'Standard' },
    market: { type: String, required: true, index: true, trim: true },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    source: { type: String, default: 'Agmarknet / DMI Government of India' },
    priceTrend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  },
  { timestamps: true }
);

// Compound index for fast filtering
MarketPriceSchema.index({ crop: 1, state: 1, district: 1, date: -1 });

export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IFarm extends Document {
  farmerId: mongoose.Types.ObjectId;
  name: string;
  village: string;
  district: string;
  state: string;
  areaAcres: number;
  soilType: string;
  irrigationSource: string;
  surveyNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    village: { type: String, default: '' },
    district: { type: String, required: true },
    state: { type: String, required: true },
    areaAcres: { type: Number, required: true, min: 0.1 },
    soilType: { type: String, default: 'Alluvial' },
    irrigationSource: { type: String, default: 'Canal / Tubewell' },
    surveyNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);

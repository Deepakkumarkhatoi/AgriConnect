import mongoose, { Schema, Document } from 'mongoose';

export type CropStage = 'sowing' | 'vegetative' | 'flowering' | 'ripening' | 'harvest_ready' | 'harvested';

export interface IFarmActivity {
  date: Date;
  title: string;
  notes: string;
  cost?: number;
}

export interface ICropRecord extends Document {
  farmId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  cropName: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  sowingDate: Date;
  expectedHarvestDate: Date;
  stage: CropStage;
  estimatedProductionQuintals: number;
  actualHarvestQuintals?: number;
  irrigationNotes: string;
  fertilizerNotes: string;
  activities: IFarmActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const CropRecordSchema = new Schema<ICropRecord>(
  {
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropName: { type: String, required: true, trim: true },
    variety: { type: String, default: '' },
    season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], default: 'Kharif' },
    sowingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date, required: true },
    stage: {
      type: String,
      enum: ['sowing', 'vegetative', 'flowering', 'ripening', 'harvest_ready', 'harvested'],
      default: 'sowing',
    },
    estimatedProductionQuintals: { type: Number, required: true, min: 0 },
    actualHarvestQuintals: { type: Number },
    irrigationNotes: { type: String, default: '' },
    fertilizerNotes: { type: String, default: '' },
    activities: [
      {
        date: { type: Date, default: Date.now },
        title: { type: String, required: true },
        notes: { type: String, default: '' },
        cost: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const CropRecord = mongoose.model<ICropRecord>('CropRecord', CropRecordSchema);

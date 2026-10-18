import mongoose, { Schema, Document } from 'mongoose';

export interface IEligibilityRules {
  minLandAcres?: number;
  maxLandAcres?: number;
  allowedStates?: string[];
  allowedCrops?: string[];
  requiresKcc?: boolean;
  targetCategory?: string; // Small/Marginal, All, Women
}

export interface IScheme extends Document {
  title: string;
  code: string;
  state: string;
  category: 'Financial' | 'Insurance' | 'Irrigation' | 'Seeds & Subsidies' | 'Infrastructure';
  department: string;
  description: string;
  benefits: string;
  eligibilityRules: IEligibilityRules;
  documentsRequired: string[];
  officialUrl: string;
  deadline?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema = new Schema<IScheme>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    state: { type: String, required: true, default: 'All-India', index: true },
    category: {
      type: String,
      enum: ['Financial', 'Insurance', 'Irrigation', 'Seeds & Subsidies', 'Infrastructure'],
      required: true,
      index: true,
    },
    department: { type: String, default: 'Ministry of Agriculture & Farmers Welfare' },
    description: { type: String, required: true },
    benefits: { type: String, required: true },
    eligibilityRules: {
      minLandAcres: { type: Number, default: 0 },
      maxLandAcres: { type: Number },
      allowedStates: { type: [String], default: [] },
      allowedCrops: { type: [String], default: [] },
      requiresKcc: { type: Boolean, default: false },
      targetCategory: { type: String, default: 'All Farmers' },
    },
    documentsRequired: { type: [String], default: [] },
    officialUrl: { type: String, required: true },
    deadline: { type: String, default: 'Ongoing / Open Throughout Year' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Scheme = mongoose.model<IScheme>('Scheme', SchemeSchema);

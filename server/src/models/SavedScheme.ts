import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklistItem {
  item: string;
  completed: boolean;
}

export interface ISavedScheme extends Document {
  farmerId: mongoose.Types.ObjectId;
  schemeId: mongoose.Types.ObjectId;
  notes: string;
  checklist: IChecklistItem[];
  savedAt: Date;
}

const SavedSchemeSchema = new Schema<ISavedScheme>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    schemeId: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
    notes: { type: String, default: '' },
    checklist: [
      {
        item: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SavedSchemeSchema.index({ farmerId: 1, schemeId: 1 }, { unique: true });

export const SavedScheme = mongoose.model<ISavedScheme>('SavedScheme', SavedSchemeSchema);

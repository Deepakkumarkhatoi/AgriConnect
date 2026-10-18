import mongoose, { Schema, Document } from 'mongoose';

export type TicketCategory = 'crop_issue' | 'pest_disease' | 'scheme_help' | 'irrigation' | 'general';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface ITicketMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: string;
  text: string;
  internalOnly?: boolean;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone?: string;
  district: string;
  state: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  cropName?: string;
  photoUrl?: string;
  assignedOfficerId?: mongoose.Types.ObjectId;
  assignedOfficerName?: string;
  messages: ITicketMessage[];
  resolutionNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['crop_issue', 'pest_disease', 'scheme_help', 'irrigation', 'general'],
      default: 'crop_issue',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cropName: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    assignedOfficerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    assignedOfficerName: { type: String },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderName: { type: String, required: true },
        senderRole: { type: String, required: true },
        text: { type: String, required: true },
        internalOnly: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

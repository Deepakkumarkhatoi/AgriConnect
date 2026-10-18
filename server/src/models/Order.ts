import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'inquiry' | 'negotiating' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface IOrderMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: string;
  text: string;
  proposedPrice?: number;
  timestamp: Date;
}

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerPhone?: string;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  listingId: mongoose.Types.ObjectId;
  crop: string;
  quantity: number;
  unit: string;
  offeredPricePerUnit: number;
  counterPricePerUnit?: number;
  totalAmount: number;
  deliveryPreference: string;
  status: OrderStatus;
  messages: IOrderMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    crop: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'Quintal' },
    offeredPricePerUnit: { type: Number, required: true, min: 1 },
    counterPricePerUnit: { type: Number },
    totalAmount: { type: Number, required: true },
    deliveryPreference: { type: String, default: 'Farm pickup / Mandi delivery' },
    status: {
      type: String,
      enum: ['inquiry', 'negotiating', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'inquiry',
      index: true,
    },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderName: { type: String, required: true },
        senderRole: { type: String, required: true },
        text: { type: String, required: true },
        proposedPrice: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

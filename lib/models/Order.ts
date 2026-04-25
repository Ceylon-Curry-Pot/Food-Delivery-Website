import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  qty: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  type: OrderType;
  deliveryAddress?: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    type: { type: String, enum: ['delivery', 'pickup'], required: true },
    deliveryAddress: { type: String },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

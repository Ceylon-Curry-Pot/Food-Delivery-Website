import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  qty: number;
  price: number;
  image?: string;
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
  note?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    name:     { type: String, required: true },
    qty:      { type: Number, required: true, min: 1 },
    price:    { type: Number, required: true, min: 0 },
    image:    { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name:  { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    type:            { type: String, enum: ['delivery', 'pickup'], required: true },
    deliveryAddress: { type: String },
    items:           { type: [OrderItemSchema], required: true },
    total:           { type: Number, required: true, min: 0 },
    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    note:          { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
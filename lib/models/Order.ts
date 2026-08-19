import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup';
export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'charged_back';

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
  paymentStatus: PaymentStatus;
  payherePaymentId?: string;
  payhereStatusCode?: string;
  payhereMd5sig?: string;
  paidAt?: Date;
  /** Set at order creation from the signed-in loyalty session — never from the client body. */
  loyaltyMember?: mongoose.Types.ObjectId;
  /** Present once points have been credited. Doubles as the idempotency guard. */
  loyaltyPointsAwarded?: number;
  loyaltyPointsAwardedAt?: Date;
  /** Audit trail once an award has been reverted (e.g. the order was cancelled). */
  loyaltyPointsRevoked?: number;
  loyaltyPointsRevokedAt?: Date;
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
    paymentStatus: {
      type:    String,
      enum:    ['unpaid', 'pending', 'paid', 'failed', 'cancelled', 'charged_back'],
      default: 'unpaid',
    },
    payherePaymentId:  { type: String },
    payhereStatusCode: { type: String },
    payhereMd5sig:     { type: String },
    paidAt:            { type: Date },

    // ── Loyalty ───────────────────────────────────────────────────────────
    // `loyaltyPointsAwarded` intentionally has no default: staying absent lets
    // the award routine claim an order with a `{ loyaltyPointsAwarded: null }`
    // filter, which matches missing-or-null and makes crediting once-only.
    loyaltyMember:          { type: Schema.Types.ObjectId, ref: 'LoyaltyMember', index: true },
    loyaltyPointsAwarded:   { type: Number, min: 0 },
    loyaltyPointsAwardedAt: { type: Date },
    loyaltyPointsRevoked:   { type: Number, min: 0 },
    loyaltyPointsRevokedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

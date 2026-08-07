import mongoose, { Schema, Document } from 'mongoose';

export type LoyaltyTierValue = 'Clove' | 'Cinnamon' | 'Saffron' | 'Cardamom';

export interface ILoyaltyMember extends Document {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  passwordHash: string;
  points: number;
  tier: LoyaltyTierValue;
  memberSince: Date;
  memberNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltyMemberSchema: Schema = new Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    phone:        { type: String, required: true },
    birthday:     { type: String, required: true }, // ISO date e.g. "1995-08-15"
    passwordHash: { type: String, required: true, select: false }, // never returned by default
    points:       { type: Number, default: 100 },
    tier:         { type: String, enum: ['Clove', 'Cinnamon', 'Saffron', 'Cardamom'], default: 'Clove' },
    memberSince:  { type: Date, default: Date.now },
    memberNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// ── Sequential memberNumber generation ─────────────────────────────────────
// Uses a "counters" collection with atomic findOneAndUpdate to guarantee
// unique, sequential member numbers like "CCP-0001", "CCP-0002", etc.
// This avoids the collision risk of the mock's random approach.

const CounterSchema = new Schema({
  _id:  { type: String, required: true },
  seq:  { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

export async function generateMemberNumber(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'loyaltyMemberNumber' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `CCP-${String(counter.seq).padStart(4, '0')}`;
}

export default mongoose.models.LoyaltyMember ||
  mongoose.model<ILoyaltyMember>('LoyaltyMember', LoyaltyMemberSchema);

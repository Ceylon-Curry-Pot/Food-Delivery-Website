import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff';
  approved: boolean;
  requestedAt: Date;
  approvedAt?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  approved: { type: Boolean, default: false },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

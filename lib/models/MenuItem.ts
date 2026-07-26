import mongoose, { Schema, Document } from 'mongoose';

export type MenuCategory = string;

export interface IMenuItem extends Document {
  name: string;
  price: number;
  category: MenuCategory;
  description?: string;
  available: boolean;
  imageUrl?: string;
  previousImageUrl?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },
    imageUrl: { type: String },
    previousImageUrl: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

import mongoose, { Schema, Document } from 'mongoose';

export type MenuCategory = 
  | 'Rice & Curry'
  | 'Kottu'
  | 'Hoppers'
  | 'Fried Rice'
  | 'Biryani'
  | 'Desserts'
  | 'Beverages';

export interface IMenuItem extends Document {
  name: string;
  price: number;
  category: MenuCategory;
  description?: string;
  available: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { 
      type: String, 
      enum: ['Rice & Curry', 'Kottu', 'Hoppers', 'Fried Rice', 'Biryani', 'Desserts', 'Beverages'],
      required: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuCategorySettings extends Document {
  key: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuCategorySettingsSchema = new Schema<IMenuCategorySettings>(
  {
    key: { type: String, required: true, unique: true, default: 'menu' },
    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.MenuCategorySettings || mongoose.model<IMenuCategorySettings>('MenuCategorySettings', MenuCategorySettingsSchema);
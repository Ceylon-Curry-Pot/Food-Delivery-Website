export const dynamic = "force-dynamic";

import connectToDatabase from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import { getMenuCategories } from "@/lib/menuCategories";
import MenuGrid from "./_components/MenuGrid";

export default async function MenuManagementPage() {
  await connectToDatabase();
  const items = (await MenuItem.find().sort({ category: 1, name: 1 }).lean()) as Array<{
    name: string;
    price: number;
    category: string;
    description?: string;
    available?: boolean;
    image?: string;
    _id: { toString(): string };
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: unknown;
  }>;
  const categories = await getMenuCategories();
  
  // Serialize ObjectIds
  const serializedItems = items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500">Add, edit, or manage menu items</p>
        </div>
      </div>
      
      <MenuGrid initialItems={serializedItems} initialCategories={categories} />
    </div>
  );
}

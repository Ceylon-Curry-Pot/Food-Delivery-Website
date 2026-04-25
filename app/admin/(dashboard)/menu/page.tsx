export const dynamic = "force-dynamic";

import connectToDatabase from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import MenuGrid from "./_components/MenuGrid";

export default async function MenuManagementPage() {
  await connectToDatabase();
  const items = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
  
  // Serialize ObjectIds
  const serializedItems = items.map((i: any) => ({
    ...i,
    _id: i._id.toString(),
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500">Add, edit, or manage menu items</p>
        </div>
      </div>
      
      <MenuGrid initialItems={serializedItems} />
    </div>
  );
}

import { Suspense } from "react";
import Order from "@/lib/models/Order";
import MenuItem from "@/lib/models/MenuItem";
import connectToDatabase from "@/lib/mongodb";
import OrdersTableWrapper from "./_components/OrdersTableWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrdersPage() {
  await connectToDatabase();

  // Fetch all orders
  const orders = await Order.find().sort({ createdAt: -1 }).populate('items.menuItem').lean();
  
  // Fetch menu items for dropdowns
  const menuItemsRaw = await MenuItem.find({ available: true }).lean();
  const menuItems = menuItemsRaw.map((m: any) => ({
    _id: m._id.toString(),
    name: m.name,
    price: m.price
  }));
  
  // Serialize _id
  const serializedOrders = orders.map((o: any) => ({
    ...o,
    _id: o._id.toString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  // Calculate stats
  const activeOrders = serializedOrders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  ).length;
  
  const preparing = serializedOrders.filter((o) => o.status === "preparing").length;
  const outForDelivery = serializedOrders.filter((o) => o.status === "out_for_delivery").length;

  // Completed Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = serializedOrders.filter(
    (o) => o.status === "completed" && new Date(o.createdAt) >= today
  ).length;

  const stats = {
    activeOrders,
    preparing,
    outForDelivery,
    completedToday,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500">Track and manage customer orders</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTableWrapper initialOrders={serializedOrders} initialStats={stats} menuItems={menuItems} />
      </Suspense>
    </div>
  );
}

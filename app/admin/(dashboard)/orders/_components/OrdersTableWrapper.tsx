"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter, Search, Clock, Package, Truck, Check, X, Plus } from "lucide-react";
import StatCards from "./StatCards";
import OrderDetailModal from "./OrderDetailModal";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import { useRouter } from "next/navigation";

interface OrdersTableWrapperProps {
  initialOrders: any[];
  initialStats: any;
  menuItems: any[];
}

const statusMap: Record<string, { label: string, bg: string, text: string, icon: any }> = {
  pending: { label: "Pending", bg: "bg-gray-100", text: "text-gray-700", icon: Clock },
  preparing: { label: "Preparing", bg: "bg-purple-100", text: "text-purple-700", icon: Package },
  ready: { label: "Ready", bg: "bg-yellow-100", text: "text-yellow-700", icon: Package },
  out_for_delivery: { label: "Out for Delivery", bg: "bg-orange-100", text: "text-orange-700", icon: Truck },
  completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", icon: Check },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-700", icon: X },
};

export default function OrdersTableWrapper({ initialOrders, initialStats, menuItems }: OrdersTableWrapperProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Auto-refresh via polling
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const freshOrders = await res.json();
          setOrders(freshOrders);
          router.refresh(); // to update stats if necessary, though stats are driven by server
        }
      } catch (err) {
        console.error("Poll error", err);
      }
    };
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
        );
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const handleCreateSuccess = (newOrder: any) => {
    setOrders(prev => [newOrder, ...prev]);
    router.refresh();
  };

  const handleEditSuccess = (updatedOrder: any) => {
    setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    router.refresh();
  };

  return (
    <>
      <StatCards stats={initialStats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number, customer name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 border rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
              >
                <Filter size={20} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                  <button onClick={() => { setStatusFilter("all"); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${statusFilter === "all" ? "bg-gray-50 font-medium text-brand" : "text-gray-700 hover:bg-gray-50"}`}>All Orders</button>
                  {Object.keys(statusMap).map(status => (
                    <button key={status} onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${statusFilter === status ? "bg-gray-50 font-medium text-brand" : "text-gray-700 hover:bg-gray-50"}`}>
                      {statusMap[status].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition"
            >
              <Plus size={18} /> <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Items</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-gray-100 bg-white">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const s = statusMap[order.status] || statusMap.pending;
                  const StatusIcon = s.icon;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-xs font-medium ${
                          order.type === 'delivery' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setDetailOrder(order)} className="text-sm text-gray-600 hover:text-brand hover:underline font-medium">
                          {order.items.reduce((acc: number, cur: any) => acc + cur.qty, 0)} item{order.items.length !== 1 ? 's' : ''}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">Rs. {Number(order.total).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                          <StatusIcon size={14} /> {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => setEditOrder(order)} className="text-brand text-sm font-medium hover:underline focus:outline-none">
                          Edit Order
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      <CreateOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={handleCreateSuccess} menuItems={menuItems} />
      <EditOrderModal order={editOrder} isOpen={!!editOrder} onClose={() => setEditOrder(null)} onSuccess={handleEditSuccess} menuItems={menuItems} />
    </>
  );
}

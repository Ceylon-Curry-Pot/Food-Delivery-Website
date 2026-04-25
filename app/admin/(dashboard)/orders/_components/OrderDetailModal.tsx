"use client";

import { X } from "lucide-react";

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                order.type === 'delivery' 
                  ? 'bg-blue-100 text-blue-700 border-blue-700' 
                  : 'bg-purple-100 text-purple-700 border-purple-700'
              }`}>
                {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
              {order.customer.email && <p className="text-sm text-gray-500">{order.customer.email}</p>}
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {order.type === 'delivery' ? 'Delivery Address' : 'Pickup Info'}
            </h3>
            <p className="text-sm text-gray-600">
              {order.type === 'delivery' ? order.deliveryAddress || 'No address provided' : 'Customer will pick up at restaurant'}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 pb-2">Item</th>
                <th className="text-center font-medium text-gray-500 pb-2">Qty</th>
                <th className="text-right font-medium text-gray-500 pb-2">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-3 text-gray-900">{item.menuItem?.name || "Unknown item"}</td>
                  <td className="py-3 text-center text-gray-500">{item.qty}</td>
                  <td className="py-3 text-right text-gray-900">Rs. {Number(item.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-100">
                <td colSpan={2} className="pt-4 text-right font-medium text-gray-700">Total</td>
                <td className="pt-4 text-right font-bold text-gray-900 text-lg">Rs. {Number(order.total).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

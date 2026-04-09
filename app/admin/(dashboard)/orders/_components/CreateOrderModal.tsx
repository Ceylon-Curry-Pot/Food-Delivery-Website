"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: any) => void;
  menuItems: any[];
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess, menuItems }: CreateOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    type: "delivery" as "delivery" | "pickup",
    deliveryAddress: "",
    items: [{ menuItem: "", qty: 1, price: 0 }]
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      
      const payload = {
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined,
        },
        type: formData.type,
        deliveryAddress: formData.deliveryAddress || undefined,
        items: formData.items.map(item => ({ menuItem: item.menuItem, price: Number(item.price), qty: Number(item.qty) })),
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();
      onSuccess(order);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { menuItem: "", qty: 1, price: 0 }] });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems: any[] = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill price when item changes
    if (field === 'menuItem') {
      const selectedItem = menuItems.find(m => m._id === value);
      if (selectedItem) {
        newItems[index].price = selectedItem.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Create New Order</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Type *</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full border rounded-lg p-2 text-gray-900">
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>

          {formData.type === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
              <textarea required={formData.type === 'delivery'} value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" rows={2} />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Order Items *</label>
              <button type="button" onClick={addItem} className="text-brand text-sm flex items-center gap-1 hover:underline">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select required value={item.menuItem} onChange={e => updateItem(idx, 'menuItem', e.target.value)} className="flex-1 border rounded-lg p-2 text-sm text-gray-900">
                    <option value="" disabled>Select item...</option>
                    {menuItems.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                  <input required type="number" min="1" placeholder="Qty" value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} className="w-20 border rounded-lg p-2 text-sm text-gray-900" />
                  <input required type="number" min="0" placeholder="Price (Rs.)" value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} className="w-28 border rounded-lg p-2 text-sm text-gray-900" />
                  <button type="button" onClick={() => removeItem(idx)} disabled={formData.items.length === 1} className="p-2 text-red-500 disabled:text-gray-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

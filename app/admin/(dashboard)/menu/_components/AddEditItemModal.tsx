"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

interface AddEditItemModalProps {
  item: any | null; // null for Add, object for Edit
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: any, isEdit: boolean, isDelete?: boolean) => void;
}

const CATEGORIES = [
  'Rice & Curry', 'Kottu', 'Hoppers', 'Fried Rice', 'Biryani', 'Desserts', 'Beverages'
];

export default function AddEditItemModal({ item, isOpen, onClose, onSuccess }: AddEditItemModalProps) {
  const isEdit = !!item;
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: CATEGORIES[0],
    description: "",
    available: true,
    image: ""
  });

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        description: item.description || "",
        available: item.available,
        image: item.image || ""
      });
    } else if (!item && isOpen) {
      setFormData({
        name: "",
        price: "",
        category: CATEGORIES[0],
        description: "",
        available: true,
        image: ""
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      const url = isEdit ? `/api/menu/${item._id}` : `/api/menu`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("API failed");
      const savedItem = await res.json();
      onSuccess(savedItem, isEdit);
      onClose();
    } catch (err) {
      alert("Failed to save menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Remove ${item.name} from the menu? This cannot be undone.`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/menu/${item._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onSuccess(item, true, true);
      onClose();
    } catch (err) {
      alert("Failed to delete menu item.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">
            {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input type="url" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="available" checked={formData.available === true} onChange={() => setFormData({...formData, available: true})} />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"/> Available
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="available" checked={formData.available === false} onChange={() => setFormData({...formData, available: false})} />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"/> Unavailable
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-2">
            {isEdit ? (
               <button type="button" onClick={handleDelete} disabled={deleting} className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition">
                 <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Item'}
               </button>
            ) : <div/>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 transition border-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-50 transition">
                {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Item')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

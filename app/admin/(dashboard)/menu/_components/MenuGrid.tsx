"use client";

import { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import AddEditItemModal from "./AddEditItemModal";
import { Plus } from "lucide-react";

interface MenuGridProps {
  initialItems: any[];
}

export default function MenuGrid({ initialItems }: MenuGridProps) {
  const [items, setItems] = useState(initialItems);
  const [modalItem, setModalItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setModalItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedItem: any, isEdit: boolean, isDelete?: boolean) => {
    if (isDelete) {
      setItems(prev => prev.filter(i => i._id !== savedItem._id));
    } else if (isEdit) {
      setItems(prev => prev.map(i => i._id === savedItem._id ? savedItem : i));
    } else {
      setItems(prev => [...prev, savedItem]);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-hover transition shadow-sm"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No menu items found. Get started by adding one.</p>
          <button onClick={handleOpenAdd} className="text-brand font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
            <Plus size={16}/> Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map(item => (
            <MenuItemCard 
              key={item._id} 
              item={item} 
              onEdit={handleOpenEdit} 
            />
          ))}
        </div>
      )}

      <AddEditItemModal 
        item={modalItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess} 
      />
    </div>
  );
}

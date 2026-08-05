"use client";

import { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import AddEditItemModal from "./AddEditItemModal";
import EditCategoryModal from "./EditCategoryModal";
import { Plus } from "lucide-react";
import type { MenuItemRecord } from "@/lib/menu";

type AdminMenuItem = Omit<MenuItemRecord, '_id'> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface MenuGridProps {
  initialItems: AdminMenuItem[];
  initialCategories: string[];
}

export default function MenuGrid({ initialItems, initialCategories }: MenuGridProps) {
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [modalItem, setModalItem] = useState<AdminMenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setModalItem(null);
    setIsModalOpen(true);
  };
  const handleOpenEditCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleOpenEdit = (item: AdminMenuItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedItem: AdminMenuItem, isEdit: boolean, isDelete?: boolean) => {
    if (isDelete) {
      setItems(prev => prev.filter(i => i._id !== savedItem._id));
    } else if (isEdit) {
      setItems(prev => prev.map(i => i._id === savedItem._id ? savedItem : i));
    } else {
      setItems(prev => [...prev, savedItem]);
    }
  };

  const handleCategorySave = (savedCategories: string[]) => {
    setCategories(savedCategories);
  };

  return (
    <div>
      <div className="flex justify-end items-center gap-3 mb-6">
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-hover transition shadow-sm"
        >
          <Plus size={18} /> Add New Item
        </button>
        <button 
          onClick={handleOpenEditCategory}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-hover transition shadow-sm"
        >
          <Plus size={18} /> Edit Category
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
        categories={categories}
      />

      <EditCategoryModal
        categories={categories}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategorySave}
      />
    </div>
  );
}

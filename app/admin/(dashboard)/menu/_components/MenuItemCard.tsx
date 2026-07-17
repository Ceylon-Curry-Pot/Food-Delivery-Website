"use client";

import { Edit2 } from "lucide-react";
import Image from "next/image";
import type { MenuItemRecord } from "@/lib/menu";

type AdminMenuItem = Omit<MenuItemRecord, '_id'> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface MenuItemCardProps {
  item: AdminMenuItem;
  onEdit: (item: AdminMenuItem) => void;
}

export default function MenuItemCard({ item, onEdit }: MenuItemCardProps) {
  const imageUrl = item.imageUrl || item.image;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 transition hover:shadow-md h-full">
      {imageUrl ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          No image
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 truncate" title={item.name}>{item.name}</h3>
          <button 
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-brand hover:bg-red-50 rounded-lg transition shrink-0"
          >
            <Edit2 size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2 leading-relaxed flex-1">
          {item.description || "No description"}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-medium text-brand">Rs. {Number(item.price).toLocaleString()}</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${item.available ? 'text-gray-600' : 'text-red-500'}`}>
              {item.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

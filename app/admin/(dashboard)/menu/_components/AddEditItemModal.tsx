"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import type { MenuItemRecord } from "@/lib/menu";
type AdminMenuItem = Omit<MenuItemRecord, '_id'> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface AddEditItemModalProps {
  item: AdminMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: AdminMenuItem, isEdit: boolean, isDelete?: boolean) => void;
  categories: string[];
}

interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  available: boolean;
}

const createEmptyForm = (category = ''): FormData => ({
  name:        '',
  price:       '',
  category,
  description: '',
  available:   true,
});

export default function AddEditItemModal({ item, isOpen, onClose, onSuccess, categories }: AddEditItemModalProps) {
  const isEdit = !!item;
  const [loading,  setLoading]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState<FormData>(createEmptyForm(categories[0] ?? ''));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const categoryOptions = useMemo(() => {
    if (item?.category && !categories.includes(item.category)) {
      return [...categories, item.category];
    }

    return categories;
  }, [categories, item?.category]);

  useEffect(() => {
    if (!isOpen) { setErrorMsg(''); return; }
    if (item) {
      setFormData({
        name:        item.name        ?? '',
        price:       String(item.price ?? ''),
        category:    item.category    ?? categoryOptions[0] ?? '',
        // description may be string or string[] — normalise to string for the textarea
        description: Array.isArray(item.description)
          ? item.description.join(', ')
          : (item.description ?? ''),
        available:   item.available   ?? true,
      });
      setImageFile(null);
      setImagePreview(item.imageUrl || item.image || '');
    } else {
      setFormData(createEmptyForm(categories[0] ?? ''));
      setImageFile(null);
      setImagePreview('');
    }
  }, [item, isOpen, categories, categoryOptions]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedPrice = Number(formData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }

    setLoading(true);
    try {
      const url    = isEdit ? `/api/menu/${item._id}` : '/api/menu';
      const method = isEdit ? 'PATCH' : 'POST';
      const payload = new FormData();

      payload.append('name', formData.name.trim());
      payload.append('price', String(parsedPrice));
      payload.append('category', formData.category);
      payload.append('description', formData.description.trim());
      payload.append('available', String(formData.available));

      if (imageFile) {
        payload.append('imageFile', imageFile);
      }

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.message || 'Failed to save menu item.');
        return;
      }

      onSuccess(data, isEdit);
      onClose();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    if (!confirm(`Remove "${item.name}" from the menu? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/menu/${item._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data?.message || 'Failed to delete item.');
        return;
      }
      onSuccess(item, true, true);
      onClose();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const set = (key: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (file: File | null) => {
    setImageFile(file);

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImagePreview(item?.imageUrl || item?.image || '');
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">
            {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Error banner */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              required
              value={formData.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Red Pork Yellow Rice"
              className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="e.g. 1850"
                className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Image {isEdit ? '(replace optional)' : '(optional)'}</label>
            <div className="flex items-start gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Selected menu item"
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[11px] text-gray-400 text-center px-2">No image selected</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
                />
                <p className="text-xs text-gray-400">
                  Upload a new image or leave this empty to keep the current image when editing.
                </p>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => handleFileChange(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600"
                  >
                    <Upload size={14} /> Remove selected file
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Separate items with commas: Red pork curry, steamed rice, 4 vegetables"
              className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate features with commas — they display as bullet points on the menu.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="available"
                  checked={formData.available === true}
                  onChange={() => set('available', true)}
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Available
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="available"
                  checked={formData.available === false}
                  onChange={() => set('available', false)}
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Unavailable
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
              >
                <Trash2 size={16} /> {deleting ? 'Deleting…' : 'Delete Item'}
              </button>
            ) : <div />}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 transition border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
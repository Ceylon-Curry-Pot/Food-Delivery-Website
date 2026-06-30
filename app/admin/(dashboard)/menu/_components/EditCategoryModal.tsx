"use client";

import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

interface EditCategoryModalProps {
    categories: string[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (categories: string[]) => void;
}

function normalizeCategories(categories: string[]) {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const category of categories) {
        const value = category.trim();
        if (!value || seen.has(value.toLowerCase())) {
            continue;
        }

        seen.add(value.toLowerCase());
        result.push(value);
    }

    return result;
}

export default function EditCategoryModal({ categories, isOpen, onClose, onSave }: EditCategoryModalProps) {
    const initialCategories = useMemo(() => normalizeCategories(categories), [categories]);
    const [draftCategories, setDraftCategories] = useState<string[]>(initialCategories);
    const [newCategory, setNewCategory] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setDraftCategories(initialCategories);
        setNewCategory('');
        setErrorMsg('');
    }, [initialCategories, isOpen]);

    if (!isOpen) return null;

    const isDirty =
        newCategory.trim().length > 0 ||
        draftCategories.length !== initialCategories.length ||
        draftCategories.some((category, index) => category !== initialCategories[index]);

    const requestClose = () => {
        if (isDirty && !window.confirm('You have unsaved category changes. Discard them?')) {
            return;
        }

        onClose();
    };

    const handleAddCategory = () => {
        const value = newCategory.trim();

        if (!value) {
            return;
        }

        const exists = draftCategories.some((category) => category.toLowerCase() === value.toLowerCase());
        if (exists) {
            setErrorMsg('That category already exists.');
            return;
        }

        setDraftCategories((prev) => [...prev, value]);
        setNewCategory('');
        setErrorMsg('');
    };

    const handleRemoveCategory = (categoryToRemove: string) => {
        setDraftCategories((prev) => prev.filter((category) => category !== categoryToRemove));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMsg('');
        setSaving(true);

        try {
            const categoriesToSave = normalizeCategories(draftCategories);
            const response = await fetch('/api/menu/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: categoriesToSave }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data?.message || 'Failed to save categories.');
                return;
            }

            onSave(data.categories ?? categoriesToSave);
            onClose();
        } catch {
            setErrorMsg('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={requestClose}
        >
            <div
                className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Edit Categories</h2>
                        <p className="text-sm text-gray-500">Add new categories or remove ones you no longer need.</p>
                    </div>
                    <button onClick={requestClose} className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    {errorMsg && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Add New Category</label>
                        <div className="flex gap-3">
                            <input
                                value={newCategory}
                                onChange={(event) => setNewCategory(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleAddCategory();
                                    }
                                }}
                                placeholder="e.g. Desserts"
                                className="w-full rounded-lg border border-gray-200 p-3 text-gray-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Current Categories</label>
                            <span className="text-xs text-gray-500">{draftCategories.length} total</span>
                        </div>

                        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                            {draftCategories.length === 0 ? (
                                <p className="text-sm text-gray-500">No categories added yet.</p>
                            ) : (
                                draftCategories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(category)}
                                            className="rounded-full p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                            aria-label={`Remove ${category}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={requestClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
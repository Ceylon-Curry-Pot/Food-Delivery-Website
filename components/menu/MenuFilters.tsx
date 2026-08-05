// components/menu/MenuFilters.tsx
'use client';

import type { MenuCategory } from '@/lib/menu';
import CategoryPills from './CategoryPills';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  categories: MenuCategory[];
  activeCategory: MenuCategory;
  onCategoryChange: (c: MenuCategory) => void;
};

export default function MenuFilters({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <span className="text-gray-400 text-sm">🔎</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search dishes..."
          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
          aria-label="Search dishes"
        />
      </div>

      <CategoryPills
        categories={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />
    </div>
  );
}
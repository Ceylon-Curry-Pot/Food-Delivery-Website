// components/menu/MenuSection.tsx
'use client';

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import MenuFilters from './MenuFilters';
import MenuGrid from './MenuGrid';
import { featuredDishes } from '@/lib/data';
import { getDishCategory, menuCategories, type MenuCategory } from '@/lib/menu';

export default function MenuSection() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return featuredDishes.filter((d) => {
      const category = getDishCategory(d);
      const matchesCategory =
        activeCategory === 'All' ? true : category === activeCategory;

      const matchesSearch =
        q.length === 0
          ? true
          : d.name.toLowerCase().includes(q) ||
            d.description.some((x) => x.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleAdd = (id: string) => {
    console.log('Add to cart:', id);
  };

  return (
    <div>
      <SectionHeader
        tagline="Our Menu"
        title="Explore Our Delicious Selection"
        description="Handcrafted with authentic Sri Lankan spices, passed down through generations"
      />

      <MenuFilters
        search={search}
        onSearchChange={setSearch}
        categories={menuCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MenuGrid dishes={filtered} onAdd={handleAdd} />
    </div>
  );
}
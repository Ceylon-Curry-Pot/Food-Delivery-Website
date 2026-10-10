'use client';

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import MenuFilters from './MenuFilters';
import MenuGrid from './MenuGrid';
import type { MenuDish, MenuCategory } from '@/lib/menu';

type Props = {
  dishes: MenuDish[];
  categories: string[];
};

export default function MenuSection({ dishes, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return dishes.filter((d) => {
      const matchesCategory =
        activeCategory === 'All' ||
        d.category === activeCategory;

      const matchesSearch =
        q.length === 0 ||
        d.name.toLowerCase().includes(q) ||
        d.description.some((x) =>
          x.toLowerCase().includes(q)
        );

      return matchesCategory && matchesSearch;
    });
  }, [dishes, search, activeCategory]);

  const availableCategories = categories.filter(
    (cat) =>
      cat === 'All' ||
      dishes.some((d) => d.category === cat)
  );

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
        categories={availableCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MenuGrid dishes={filtered} />
    </div>
  );
}
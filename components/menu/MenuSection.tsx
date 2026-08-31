'use client';

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import MenuFilters from './MenuFilters';
import MenuGrid from './MenuGrid';
import { menuCategories, type MenuDish, type MenuCategory } from '@/lib/menu';

type Props = {
  dishes: MenuDish[];
};

export default function MenuSection({ dishes }: Props) {
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dishes.filter((d) => {
      const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
      const matchesSearch   =
        q.length === 0 ||
        d.name.toLowerCase().includes(q) ||
        d.description.some((x) => x.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [dishes, search, activeCategory]);

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
        categories={menuCategories.filter(
          (cat) => cat === 'All' || dishes.some((d) => d.category === cat)
        )}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* No onAdd — MenuDishCard reads the cart store and manages itself */}
      <MenuGrid dishes={filtered} />
    </div>
  );
}
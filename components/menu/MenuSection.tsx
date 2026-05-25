// components/menu/MenuSection.tsx
'use client';

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import MenuFilters from './MenuFilters';
import MenuGrid from './MenuGrid';
import {
  menuCategories,
  type MenuDish,
  type MenuCategory,
} from '@/lib/menu';
import { useCartStore } from '@/components/global/useCartStore';

type Props = {
  dishes: MenuDish[];
};

export default function MenuSection({ dishes }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>('All');

  const addItem = useCartStore((state) => state.addItem);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return dishes.filter((d) => {
      const matchesCategory =
        activeCategory === 'All' ? true : d.category === activeCategory;

      const matchesSearch =
        q.length === 0
          ? true
          : d.name.toLowerCase().includes(q) ||
            d.description.some((x) => x.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [dishes, search, activeCategory]);

  const handleAdd = (dish: MenuDish) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
    });
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
        categories={menuCategories.filter(
          (category) =>
            category === 'All' || dishes.some((dish) => dish.category === category)
        )}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MenuGrid dishes={filtered} onAdd={handleAdd} />
    </div>
  );
}

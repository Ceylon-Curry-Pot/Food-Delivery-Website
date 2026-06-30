// components/menu/MenuSection.tsx
'use client';

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/home/SectionHeader';
import MenuFilters from './MenuFilters';
import MenuGrid from './MenuGrid';
import { type MenuDish, type MenuCategory } from '@/lib/menu';
import { useCartStore } from '@/components/global/useCartStore';

type Props = {
  dishes: MenuDish[];
  categories: MenuCategory[];
};

export default function MenuSection({ dishes, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>('All');

  const addItem = useCartStore((state) => state.addItem);

  const resolvedActiveCategory =
    activeCategory === 'All' || categories.includes(activeCategory)
      ? activeCategory
      : 'All';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return dishes.filter((d) => {
      const matchesCategory =
        resolvedActiveCategory === 'All' ? true : d.category === resolvedActiveCategory;

      const matchesSearch =
        q.length === 0
          ? true
          : d.name.toLowerCase().includes(q) ||
            d.description.some((x) => x.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [dishes, search, resolvedActiveCategory]);

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
        categories={['All', ...categories].filter(
          (category) =>
            category === 'All' || dishes.some((dish) => dish.category === category)
        )}
        activeCategory={resolvedActiveCategory}
        onCategoryChange={setActiveCategory}
      />

      <MenuGrid dishes={filtered} onAdd={handleAdd} />
    </div>
  );
}

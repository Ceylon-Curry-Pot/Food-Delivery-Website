// components/menu/CategoryPills.tsx
import type { MenuCategory } from '@/lib/menu';

type Props = {
  categories: MenuCategory[];
  active: MenuCategory;
  onChange: (cat: MenuCategory) => void;
};

export default function CategoryPills({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              isActive
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
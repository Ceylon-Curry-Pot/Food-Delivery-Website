import { Flame, Leaf, Package } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';
import SpecialityCard from './SpecialityCard';

export default function SpecialitiesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagline="What Makes Us Special"
          title="Our Specialities"
          description="From bold spices to balanced meals, we bring authentic Sri Lankan flavors straight to your table."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <SpecialityCard
            icon={<Flame className="w-6 h-6" />}
            title="The Black & Red"
            description="Experience the signature Sri Lankan pork curries, crafted with bold spices and slow-cooked to perfection for a rich, smoky flavor that dances on your palate."
            color="bg-red-600"
          />

          <SpecialityCard
            icon={<Leaf className="w-6 h-6" />}
            title="The Balanced Plate"
            description="Every plate is thoughtfully composed with protein, rice, fresh vegetables, and traditional sides to deliver a harmonious, nourishing meal in every bite."
            color="bg-green-500"
          />

          <SpecialityCard
            icon={<Package className="w-6 h-6" />}
            title="Freshness First"
            description="Our ingredients are sourced daily to ensure every dish bursts with flavor and quality. Nothing leaves our kitchen without the mark of freshness."
            color="bg-orange-500"
          />
        </div>
      </div>
    </section>
  );
}
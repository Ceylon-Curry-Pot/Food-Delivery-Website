import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
};

export default function SpecialityCard({
  icon,
  title,
  description,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 hover:shadow-2xl transition-all duration-300 group">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white mb-5 ${color} group-hover:scale-110 transform transition`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
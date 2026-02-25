type SectionHeaderProps = {
  tagline: string;
  title: string;
  description: string;
};

export default function SectionHeader({ tagline, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      {/* Tagline with decorative lines */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-10 h-0.5 bg-red-500"></div>
        <span className="text-red-500 text-xs font-semibold tracking-[0.2em] uppercase">
          {tagline}
        </span>
        <div className="w-10 h-0.5 bg-red-500"></div>
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

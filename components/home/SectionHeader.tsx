type SectionHeaderProps = {
  tagline: string;
  title: string;
  description: string;
};

export default function SectionHeader({ tagline, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full border border-red-100 mb-4">
        {tagline}
      </span>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}
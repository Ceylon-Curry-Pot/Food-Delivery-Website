import Link from 'next/link';

export default function CheckoutHeader({
  backHref,
  title,
  subtitle,
  badge,
}: {
  backHref: string;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <Link href={backHref} className="text-sm text-gray-500 hover:text-red-600">
        ← Back
      </Link>
      <div className="flex items-center justify-between mt-3">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        {badge && (
          <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

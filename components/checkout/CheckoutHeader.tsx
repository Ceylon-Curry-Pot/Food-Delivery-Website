'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="mb-2">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-600 transition-colors mb-5 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>
        {badge && (
          <span className="flex-shrink-0 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-100">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
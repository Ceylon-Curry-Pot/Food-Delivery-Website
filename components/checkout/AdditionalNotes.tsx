'use client';

import { FileText } from 'lucide-react';

export default function AdditionalNotes() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <FileText className="w-4 h-4 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Additional Notes</h2>
      </div>

      <textarea
        placeholder="Allergy information, spice level preferences, special requests…"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                   outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none"
        rows={4}
      />
    </div>
  );
}
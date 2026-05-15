'use client';

type Props = {
  note: string;
  onChange: (value: string) => void;
};

export default function OrderNote({ note, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        Order Note <span className="normal-case font-normal text-gray-400">(optional)</span>
      </label>
      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Allergies, spice level, special requests…"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400
                   outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none"
      />
    </div>
  );
}
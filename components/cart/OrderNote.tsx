type Props = {
  note: string;
  onChange: (value: string) => void;
};

export default function OrderNote({ note, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        Order Note (Optional)
      </label>
      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Add any special instructions..."
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
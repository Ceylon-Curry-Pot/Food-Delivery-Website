import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

const details = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'ceyloncurrypot.lk@gmail.com',
    href: 'mailto:ceyloncurrypot.lk@gmail.com',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '077 828 2112',
    href: 'tel:0778282112',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: MapPin,
    label: 'Find Us',
    value: 'Liberty Plaza I Food Court, Colombo',
    href: '#',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Clock,
    label: 'Opening Hours',
    value: 'Mon–Sat 10am–10pm · Sun 11am–9pm',
    href: null,
    color: 'bg-green-50 text-green-600',
  },
];

export default function ContactDetails() {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 w-full max-w-lg mx-auto space-y-5">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Our Details</h2>
        <p className="text-gray-400 text-sm">Multiple ways to reach us</p>
      </div>

      {/* Info cards */}
      {details.map(({ icon: Icon, label, value, href, color }) => (
        <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
            {href && href !== '#' ? (
              <a href={href} className="text-sm font-medium text-gray-800 hover:text-red-600 transition-colors break-all">
                {value}
              </a>
            ) : (
              <p className="text-sm font-medium text-gray-800">{value}</p>
            )}
          </div>
        </div>
      ))}

      {/* Social */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Follow Us</p>
        <div className="flex gap-3">
          <Link
            href="https://www.facebook.com/share/18dfyQGj4F/?mibextid=wwXIfr"
            target="_blank"
            className="flex items-center gap-2.5 flex-1 justify-center py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </Link>
          <Link
            href="https://www.instagram.com/celoncurrypot?igsh=d2w2ZXU1MHU5cnly"
            target="_blank"
            className="flex items-center gap-2.5 flex-1 justify-center py-2.5 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 text-sm font-semibold hover:bg-pink-100 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </Link>
        </div>
      </div>
    </div>
  );
}
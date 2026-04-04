import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ContactDetails() {
  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-lg mx-auto mt-10 space-y-5">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Details</h2>

      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-red-600" />
        <a href="mailto:ceyloncurrypot.lk@gmail.com" className="text-gray-700 hover:text-red-600">
          ceyloncurrypot.lk@gmail.com
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Phone className="w-5 h-5 text-red-600" />
        <a href="tel:0778282112" className="text-gray-700 hover:text-red-600">
          077 828 2112
        </a>
      </div>

      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-red-600" />
        <span className="text-gray-700">Liberty Plaza I Food Court</span>
      </div>

      <div className="flex items-center gap-3">
        <Facebook className="w-5 h-5 text-blue-600" />
        <Link href="https://web.facebook.com/CeylonCurryPot.lk/?_rdc=1&_rdr#" target="_blank" className="text-gray-700 hover:text-blue-600">
          Facebook
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Instagram className="w-5 h-5 text-pink-500" />
        <Link href="https://www.instagram.com/celoncurrypot/" target="_blank" className="text-gray-700 hover:text-pink-500">
          Instagram
        </Link>
      </div>
    </div>
  );
}
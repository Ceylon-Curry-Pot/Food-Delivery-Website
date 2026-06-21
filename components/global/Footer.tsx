'use client';

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FooterProps = {
  onStaffPortalClick?: () => void;
};

export default function Footer({ onStaffPortalClick }: FooterProps) {
  const router = useRouter();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="font-heading text-white text-xl font-bold mb-4">
              Ceylon Curry Pot
            </h3>

            <p className="text-sm leading-relaxed mb-5">
              Bringing authentic Sri Lankan flavours to your table since 2020.
              Every dish is a celebration of heritage and taste.
            </p>

            <div className="flex space-x-3">

              <a
                href="https://web.facebook.com/CeylonCurryPot.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.instagram.com/celoncurrypot/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigate
            </h3>

            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/tracker', label: 'Track Order' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-red-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Opening Hours
            </h3>

            <ul className="space-y-2.5 text-sm">
              {[
                { day: 'Mon – Fri', time: '10am – 10pm' },
                { day: 'Saturday', time: '10am – 11pm' },
                { day: 'Sunday', time: '11am – 9pm' },
              ].map(({ day, time }) => (
                <li key={day} className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span className="flex-1">{day}</span>
                  <span className="text-gray-500">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm">

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span>
                  Liberty Plaza I Food Court, Colombo, Sri Lanka
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0 text-red-500" />

                <a
                  href="tel:0778282112"
                  className="hover:text-red-400 transition-colors"
                >
                  077 828 2112
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0 text-red-500" />

                <a
                  href="mailto:ceyloncurrypot.lk@gmail.com"
                  className="hover:text-red-400 transition-colors"
                >
                  ceyloncurrypot.lk@gmail.com
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">

          <p>© 2024 Ceylon Curry Pot. All rights reserved.</p>

          <div className="flex items-center gap-4">

            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>

            <span className="text-gray-700">·</span>

            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms &amp; Conditions
            </Link>

            <span className="text-gray-700">·</span>

            <button
              onClick={
                onStaffPortalClick ??
                (() => router.push('/admin'))
              }
              className="hover:text-gray-300 transition-colors"
            >
              Staff Portal
            </button>

          </div>
        </div>

      </div>
    </footer>
  );
}
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
    <footer className="bg-neutral-950 text-gray-400 border-t border-red-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: About / Logo */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-white text-2xl font-bold tracking-tight">
              Ceylon <span className="text-red-600">Curry Pot</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Bringing authentic Sri Lankan flavours to your table since 2020.
              Every dish is a celebration of heritage, bold spices, and love.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/tracker', label: 'Track Order' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-red-600 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Socials */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4.5 h-4.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">
                    Liberty Plaza Food Court, Colombo, Sri Lanka
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
                  <a
                    href="tel:0778282112"
                    className="hover:text-red-600 transition-colors duration-200 text-gray-400"
                  >
                    077 828 2112
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
                  <a
                    href="mailto:ceyloncurrypot.lk@gmail.com"
                    className="hover:text-red-600 transition-colors duration-200 text-gray-400"
                  >
                    ceyloncurrypot.lk@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://web.facebook.com/CeylonCurryPot.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200 cursor-pointer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/celoncurrypot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {/* <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200 cursor-pointer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Ceylon Curry Pot. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-red-600 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-white/10">·</span>
            <Link
              href="/terms"
              className="hover:text-red-600 transition-colors duration-200"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-white/10">·</span>
            <button
              onClick={
                onStaffPortalClick ??
                (() => router.push('/admin'))
              }
              className="hover:text-red-600 transition-colors duration-200 cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
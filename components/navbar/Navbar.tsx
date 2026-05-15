'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { links, NavLink } from '@/utils/links';
import CartButton from './CartButton';
import CartModal from '../cart/CartModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main navbar row */}
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4">
              {/*Logo Image */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md border border-red-100">
                  <Image
                    src="/CCP-logo.png"
                    alt="Ceylon Curry Pot Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Brand Name */}
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-red-600 leading-tight">
                    Ceylon Curry Pot
                  </h1>

                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500">
                    Authentic Sri Lankan Cuisine
                  </p>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-full p-2">
              {links.map((link: NavLink) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative px-5 py-2.5 rounded-full text-sm lg:text-base font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-red-600 rounded-full shadow-md"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <span
                      className={`relative z-10 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <CartButton onClick={() => setOpen(true)} />

              <button
                onClick={() =>
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }
                className="md:hidden p-2 text-gray-700 hover:text-red-600"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                {links.map((link: NavLink) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      <CartModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
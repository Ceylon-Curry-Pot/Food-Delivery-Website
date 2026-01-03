'use client'
import { ShoppingCart, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { links, NavLink } from '@/utils/links';
import CartButton from './CartButton';
import LinksDropdown from './LinksDropdown';

type NavbarProps = {
  cartItemCount: number;
  onCartClick: () => void;
  onStaffPortalClick: () => void;
  onAboutClick?: () => void;
  onHomeClick?: () => void;
  onMenuClick?: () => void;
  onContactClick?: () => void;
  onTrackerClick?: () => void;
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = 0; // Placeholder for cart item count

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {/* Logo Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-md">
                {/* Replace this with actual logo image */}
                <span className="text-2xl">🍛</span>
              </div>
            </div>
            
            {/* Brand Name */}
            <div className="hidden sm:block">
              <h1 className="text-2xl text-red-600 leading-tight">
                Ceylon Curry Pot
              </h1>
              {/* <p className="text-xs text-gray-500 -mt-0.5">Authentic Sri Lankan Cuisine</p> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 lg:space-x-12">
            {links.map((link: NavLink)=> {
                return (
                    <Link key={link.label} href={link.href} className="text-gray-700 hover:text-red-600 transition-all duration-200 font-medium text-sm lg:text-base tracking-wide hover:scale-105">
                      {link.label}
                    </Link>
                )
            })}
            {/* <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors" onClick={onHomeClick}>
              Home
            </a>
            <a href="#menu" className="text-gray-700 hover:text-red-600 transition-colors" onClick={onMenuClick}>
              Menu
            </a>
            <a href="#tracker" className="text-gray-700 hover:text-red-600 transition-colors" onClick={onTrackerClick}>
              Tracker
            </a>
            <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors" onClick={onAboutClick}>
              About Us
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors" onClick={onContactClick}>
              Contact
            </a> */}
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button
              // onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Shopping cart"
            >
              <CartButton />
              {/* <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )} */}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Menu"
            >
              <LinksDropdown />
              {/* <Menu className="w-6 h-6" /> */}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {/* {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100"> */}
            {/* <LinksDropdown /> */}
            {/* <div className="flex flex-col space-y-3">
                {links.map((link: NavLink)=> {
                    return (
                        <Link key={link.label} href={link.href} className="text-gray-700 hover:text-red-600 transition-colors py-2">
                        {link.label}
                        </Link>
                    )
                })} */}
              {/* <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors py-2" onClick={onHomeClick}>
                Home
              </a>
              <a href="#menu" className="text-gray-700 hover:text-red-600 transition-colors py-2" onClick={onMenuClick}>
                Menu
              </a>
              <a href="#tracker" className="text-gray-700 hover:text-red-600 transition-colors py-2" onClick={onTrackerClick}>
                Tracker
              </a>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors py-2" onClick={onAboutClick}>
                About Us
              </a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors py-2" onClick={onContactClick}>
                Contact
              </a> */}
            {/* </div> */}
          {/* </div>
        )} */}
      </div>
    </nav>
  );
}
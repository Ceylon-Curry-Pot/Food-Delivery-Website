import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

type FooterProps = {
  onStaffPortalClick?: () => void;
};

export default function Footer({ onStaffPortalClick }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Decorative pattern accent bar */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-xl mb-4">Ceylon Curry Pot</h3>
            <p className="text-sm mb-4">
              Bringing authentic Sri Lankan flavors to your table since 2020. Every dish is a celebration of heritage and taste.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#menu" className="hover:text-red-500 transition-colors">Menu</a>
              </li>
              <li>
                <a href="#about" className="hover:text-red-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-4">
                <span>Monday - Friday</span>
                <span>10am - 10pm</span>
              </li>
              <li className="flex gap-16">
                <span>Saturday</span>
                <span>10am - 11pm</span>
              </li>
              <li className="flex gap-18.5">
                <span>Sunday</span>
                <span>11am - 9pm</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-red-500" />
                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>info@ceyloncurrypot.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© 2024 Ceylon Curry Pot. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={onStaffPortalClick}
              className="text-gray-500 hover:text-red-500 transition-colors text-xs"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
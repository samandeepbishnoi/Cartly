import React from 'react';

const footerLinkClass =
  "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm";

export const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Cartly</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your premium destination for quality products. Built with modern technology and designed for the future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className={footerLinkClass}>About Us</a></li>
            <li><a href="#" className={footerLinkClass}>Contact</a></li>
            <li><a href="#" className={footerLinkClass}>FAQ</a></li>
            <li><a href="#" className={footerLinkClass}>Support</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><a href="#" className={footerLinkClass}>Shipping Info</a></li>
            <li><a href="#" className={footerLinkClass}>Returns</a></li>
            <li><a href="#" className={footerLinkClass}>Size Guide</a></li>
            <li><a href="#" className={footerLinkClass}>Track Order</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Stay Updated</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Subscribe to get special offers, free giveaways, and updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 Cartly. All rights reserved.</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Built with React, TypeScript, Tailwind CSS, and Shopify Storefront API
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className={footerLinkClass}>Privacy Policy</a>
            <a href="#" className={footerLinkClass}>Terms of Service</a>
            <a href="#" className={footerLinkClass}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

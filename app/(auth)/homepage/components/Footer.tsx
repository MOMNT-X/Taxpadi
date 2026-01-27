"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Quote and CTA Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-normal text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            "Built for Nigerians who care deeply about understanding every tax and keeping every naira."
          </h2>
          <button 
            onClick={() => router.push('/signup')}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[15px] font-medium transition-colors"
          >
            Create an account
          </button>
        </div>

        {/* Links and Social Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          {/* Links Columns */}
          <div className="flex gap-16 md:gap-24">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <a href="#about" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                About us
              </a>
              <a href="#features" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                Features
              </a>
              <a href="#use-cases" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                Use cases
              </a>
              <a href="#contact" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <a href="#terms" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                Terms & Conditions
              </a>
              <a href="#privacy" className="text-white text-[15px] hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 items-center">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


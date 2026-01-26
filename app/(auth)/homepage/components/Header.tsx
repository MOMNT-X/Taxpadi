"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-black/10 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto pt-10 px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/assets/logo.svg" 
              alt="Taxgpt" 
              width={24} 
              height={24}
              className="w-6 h-6"
            />
            <span className="text-base font-semibold text-gray-900 dark:text-white">Taxgpt</span>
          </button>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <a href="#about" className="text-[14px] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">About us</a>
            <a href="#features" className="text-[14px] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#contact" className="text-[14px] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right: Sign In, Get Started, Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => router.push('/login')}
              className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-[13px] font-medium transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[13px] font-medium transition-colors"
            >
              Get Started Free
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <a href="#about" className="block text-sm text-gray-700 dark:text-gray-300">About us</a>
            <a href="#features" className="block text-sm text-gray-700 dark:text-gray-300">Features</a>
            <a href="#contact" className="block text-sm text-gray-700 dark:text-gray-300">Contact</a>
            <button 
              onClick={() => {
                router.push('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-medium"
            >
              Sign in
            </button>
            <button 
              onClick={() => {
                router.push('/signup');
                setMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-medium"
            >
              Get Started Free
            </button>
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;

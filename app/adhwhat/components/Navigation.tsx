'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/adhwhat" className="flex items-center">
            <div className="text-2xl font-black text-gray-900">
              A-D-H-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">WHAT?</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Benefits
            </a>
            <a href="#science" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Science
            </a>
            <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Demo
            </a>
            <Link href="/auth">
              <button className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Benefits
              </a>
              <a href="#science" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Science
              </a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Demo
              </a>
              <Link href="/auth">
                <button className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-2 rounded-full font-semibold w-full">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

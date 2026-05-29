'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Search, Menu, X, Compass } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { cartCount, wishlist, setCartOpen, setWishlistOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scrolling to add glassmorphic styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', path: '/shop' },
    { name: 'Scent Quiz', path: '/quiz' },
    { name: 'Brand Story', path: '/#brand-story' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-300 hover:text-gold transition-colors duration-300 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-gold-gradient group-hover:opacity-95 transition-opacity">
            AURA LUXE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-xs uppercase tracking-widest text-zinc-300 hover:text-gold font-sans font-semibold transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons Area */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            href="/shop"
            className="text-zinc-300 hover:text-gold transition-colors duration-300 hidden sm:block"
            title="Browse Shop"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={() => setWishlistOpen(true)}
            className="relative text-zinc-300 hover:text-gold transition-colors duration-300 cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-black font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-zinc-300 hover:text-gold transition-colors duration-300 cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-black font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-intense border-b border-gold/15"
          >
            <nav className="flex flex-col space-y-4 px-6 py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-zinc-300 hover:text-gold font-sans font-semibold transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-xs uppercase tracking-widest text-zinc-300 hover:text-gold font-sans font-semibold transition-colors duration-300"
              >
                <Search className="w-4 h-4 mr-2" /> Search Scent
              </Link>
              
              <Link
                href="/quiz"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-xs uppercase tracking-widest text-gold font-sans font-semibold transition-colors duration-300 bg-gold/10 p-3 border border-gold/20 rounded"
              >
                <Compass className="w-4 h-4 mr-2" /> Scent Finder Quiz
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Phone, ShieldCheck, Award, CreditCard } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-gold/10 pt-16 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-zinc-900 mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <div className="p-3 bg-zinc-900 border border-gold/15 rounded-full text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-zinc-200 font-semibold text-sm tracking-wider uppercase mb-1">100% Original Scent</h4>
              <p className="text-xs text-zinc-500">Every bottle is imported directly from certified global distributors.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <div className="p-3 bg-zinc-900 border border-gold/15 rounded-full text-gold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-zinc-200 font-semibold text-sm tracking-wider uppercase mb-1">IFRA Compliant</h4>
              <p className="text-xs text-zinc-500">Formulated with safe, international-grade ingredients only.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <div className="p-3 bg-zinc-900 border border-gold/15 rounded-full text-gold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-zinc-200 font-semibold text-sm tracking-wider uppercase mb-1">Cash On Delivery (COD)</h4>
              <p className="text-xs text-zinc-500">Pay at your doorstep with cash or UPI scan. Risk-free Indian checkout.</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold tracking-widest text-gold-gradient">AURA LUXE</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We design and curate premium concentration elixirs inspired by the world\'s finest niche scents. Crafted to leave a lasting impression.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <Phone className="w-4 h-4 text-gold" />
              <a
                href="https://wa.me/919999999999?text=Hi%20Aura%20Luxe%20Support%2C%20I%20have%20a%20question%20about%20my%20perfume%20selection."
                target="_blank"
                rel="noreferrer"
                className="text-xs hover:text-gold transition-colors duration-300 font-sans"
              >
                WhatsApp Support: +91 99999 99999
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-zinc-200 font-semibold text-xs uppercase tracking-widest mb-4">Scent Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">Our Full Collection</Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-gold transition-colors">Find Your Signature Scent</Link>
              </li>
              <li>
                <Link href="/shop?gender=Men" className="hover:text-gold transition-colors">Men Fragrances</Link>
              </li>
              <li>
                <Link href="/shop?gender=Women" className="hover:text-gold transition-colors">Women Fragrances</Link>
              </li>
              <li>
                <Link href="/shop?gender=Unisex" className="hover:text-gold transition-colors">Unisex Blends</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Policies */}
          <div>
            <h4 className="font-serif text-zinc-200 font-semibold text-xs uppercase tracking-widest mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#faq" className="hover:text-gold transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping & COD Policy</Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-gold transition-colors">Return & Exchange Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="font-serif text-zinc-200 font-semibold text-xs uppercase tracking-widest mb-1">Newsletter</h4>
            <p className="text-xs text-zinc-500">Subscribe for early alerts on signature drops and private VIP sales.</p>
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                required
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-gold px-4 py-2.5 rounded text-xs text-zinc-300 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-gold hover:bg-gold-dark text-black px-3.5 rounded-r transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-gold font-sans animate-fade-in">
                Thank you! You are now subscribed to the Aura Luxe newsletter.
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom copyright and attribution */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} AURA LUXE. All Rights Reserved. Crafted for evening confidence.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-gold transition-colors">Facebook</span>
            <span className="hover:text-gold transition-colors">Instagram</span>
            <span className="hover:text-gold transition-colors">Pinterest</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingBag, Star, ShieldCheck, Award, CreditCard, Sparkles, Flame, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrovaTuberosePage() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);

  // Orova Paris Tuberose product metadata
  const product = {
    id: 7,
    name: 'Orova Paris Tuberose',
    price: 3699.00,
    gender: 'Women',
    fragrance_type: 'Floral',
    occasion: 'Evening',
    longevity: '10+ Hours',
    mood: 'Romantic',
    description: 'A luxurious white floral fragrance crafted with creamy tuberose petals, soft vanilla, and sensual woods for an unforgettable signature scent. Experience the elegance of blooming tuberose blended with radiant florals and warm musk.',
    image_front: '/orova_tuberose.png',
    image_side: '/orova_tuberose.png',
    top_notes: ['Pink Pepper', 'Creamy Peach', 'Orange Blossom'],
    heart_notes: ['Creamy Tuberose', 'Blooming Jasmine', 'Radiant Florals'],
    base_notes: ['Soft Vanilla', 'Sensual Woods', 'Warm Musk'],
    sillage: 'Heavy',
    projection: 'Strong',
    rating: 5.0,
    reviews_count: 189,
    stock: 12,
    inspired_by: 'Orova Paris Signature Formula'
  };

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-12 px-4 sm:px-6 lg:px-8 space-y-24">
      {/* 1. HERO BANNER SECTION (Matching the Luxury Banner style) */}
      <section className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-white border border-gold/15 relative shadow-sm">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_right,_rgba(168,128,32,0.06),_transparent_60%) pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 sm:p-12 lg:p-20 items-center">
          {/* Left Text details */}
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-gold text-xs uppercase tracking-widest font-semibold font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exquisite Niche Masterpiece</span>
            </div>

            <div className="space-y-4">
              <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-zinc-550 font-bold block">
                OROVA PARIS PRESENTS
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#1C1917]">
                THE INTOXICATING <br />
                <span className="text-gold-gradient">BEAUTY OF TUBEROSE</span>
              </h1>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-sans max-w-lg">
                "A luxurious white floral fragrance crafted with creamy tuberose petals, soft vanilla, and sensual woods for an unforgettable signature scent."
              </p>
            </div>

            {/* Three key pillars matching uploaded image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gold/10">
              <div className="space-y-1">
                <span className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold block">01 / ELEGANCE</span>
                <h4 className="font-serif text-sm font-bold text-[#1C1917]">WHITE FLORAL ELEGANCE</h4>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold block">02 / TEXTURE</span>
                <h4 className="font-serif text-sm font-bold text-[#1C1917]">CREAMY & SENSUAL</h4>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold block">03 / TRAIL</span>
                <h4 className="font-serif text-sm font-bold text-[#1C1917]">WARM WOODS & DURATION</h4>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="px-8 py-4 bg-gold hover:bg-gold-dark text-black rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Selected & Added!' : 'Add to Scent Selection'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`px-8 py-4 border rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  isWishlisted 
                    ? 'border-gold bg-gold/10 text-gold' 
                    : 'border-gold/30 hover:border-gold text-gold hover:bg-gold/5'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-gold' : ''}`} />
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Right Product Render Showcase */}
          <div className="flex justify-center relative">
            <div className="relative w-80 sm:w-96 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-gold/15 p-6 flex flex-col items-center justify-between shadow-2xl">
              {/* Gold Label Detail */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[9px] uppercase tracking-widest font-sans rounded shadow-sm">
                100 ml / 3.4 fl. oz.
              </div>

              {/* Perfume Bottle Image (Using custom generated PNG) */}
              <div className="w-full h-2/3 flex items-center justify-center mt-6">
                <img
                  src="/orova_tuberose.png"
                  alt="Orova Paris Tuberose luxury bottle"
                  className="max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(168,128,32,0.15)] hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Typography Details (Matching Brand print in image) */}
              <div className="w-full text-center space-y-2 mt-4 pt-4 border-t border-gold/10">
                <h3 className="font-serif text-xl font-bold tracking-widest text-[#1C1917] uppercase">OROVA PARIS</h3>
                <p className="text-[10px] text-zinc-600 tracking-wider font-sans uppercase font-bold">
                  Sourced Globally. Crafted by Hand.
                </p>
                <span className="text-[9px] text-gold uppercase tracking-widest block font-serif font-bold italic">
                  Extrait De Parfum
                </span>
              </div>
            </div>
            {/* Soft gold glow circle behind bottle */}
            <div className="absolute inset-0 -z-10 bg-gold/5 filter blur-3xl rounded-full scale-75" />
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC DESCRIPTION AND TEXT STORY SECTION */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Sartorial Narrative</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917]">
            Experience the elegance of blooming tuberose blended with radiant florals.
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed font-sans">
            Designed for those who love sophisticated, long-lasting fragrances with cream-infused textures. Orova Paris Tuberose opens with the dry spice of pink pepper and soft cream of juicy peach, evolving into an absolute heart of hand-picked tuberose petals and blooming jasmine sambac, before settling into a lingering base of creamy vanilla and warm cashmere woods.
          </p>
          <div className="p-4 bg-gold/5 border border-gold/10 rounded-lg flex items-center space-x-3 text-gold">
            <Flame className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="text-xs font-semibold font-sans">Tested to project strongly for 10+ hours on skin.</span>
          </div>
        </div>

        {/* Notes Pyramid visual card */}
        <div className="p-8 rounded-2xl bg-white border border-gold/15 space-y-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#1C1917] text-center">Fragrance Anatomy</h3>
          
          <div className="space-y-4 text-left">
            <div className="p-4 bg-[#FAF8F5] border border-gold/10 rounded">
              <div className="flex justify-between text-xs text-gold font-bold uppercase tracking-widest mb-1">
                <span>Top Notes</span>
                <span>Immediate Impression</span>
              </div>
              <p className="text-sm font-serif font-semibold text-[#1C1917]">Pink Pepper • Creamy Peach • Orange Blossom</p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gold/10 rounded">
              <div className="flex justify-between text-xs text-gold font-bold uppercase tracking-widest mb-1">
                <span>Heart Notes</span>
                <span>Scent Core</span>
              </div>
              <p className="text-sm font-serif font-semibold text-[#1C1917]">Creamy Tuberose • Blooming Jasmine • Radiant Florals</p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gold/10 rounded">
              <div className="flex justify-between text-xs text-gold font-bold uppercase tracking-widest mb-1">
                <span>Base Notes</span>
                <span>Lingering trail</span>
              </div>
              <p className="text-sm font-serif font-semibold text-[#1C1917]">Soft Vanilla • Sensual Woods • Warm Musk</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM COMPARISON & TRUST BADGES */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Uncompromising Standard</span>
          <h2 className="font-serif text-3xl font-bold text-[#1C1917]">Scent Prestige Standard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-gold/15 text-center space-y-3 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1917]">100% Original Scent</h4>
            <p className="text-xs text-zinc-550 leading-relaxed font-sans">
              Hand-blended with botanical concentrates directly imported from Grasse, France.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gold/15 text-center space-y-3 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1917]">Extrait De Parfum</h4>
            <p className="text-xs text-zinc-550 leading-relaxed font-sans">
              Formulated with 22% scent oils concentration for exceptional sillage and endurance.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gold/15 text-center space-y-3 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shadow-inner">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#1C1917]">Risk-Free Indian Checkout</h4>
            <p className="text-xs text-zinc-550 leading-relaxed font-sans">
              Pay at your doorstep with Cash on Delivery (COD) or mobile UPI. Shipping is free.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PURCHASE TRIGGER CARD */}
      <section className="max-w-3xl mx-auto p-8 rounded-2xl bg-white border-2 border-gold text-center relative space-y-6 shadow-md bg-gradient-to-r from-gold/5 via-white to-gold/5">
        <div className="absolute top-4 right-4 bg-gold text-black text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded animate-pulse">
          Limited Handcrafted Batch
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Secure Your Decant</span>
          <h2 className="font-serif text-3xl font-extrabold text-[#1C1917]">Orova Paris Tuberose Decant</h2>
          <p className="text-zinc-600 text-xs sm:text-sm font-sans max-w-md mx-auto">
            Each elegant box contains a luxury 100ml Extrait bottle, hand-numbered paper tags, and custom travel pouch.
          </p>
        </div>

        {/* Pricing tag */}
        <div className="flex items-center justify-center space-x-3">
          <span className="text-sm line-through text-zinc-400 font-sans">₹4,200.00</span>
          <span className="text-3xl font-sans font-extrabold text-gold">₹3,699.00</span>
          <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-red-600 text-[10px] font-bold shadow-sm">12% OFF</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-gold hover:bg-gold-dark text-black rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{added ? 'Selected & Added!' : 'Secure Bottle Now'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>Formulated with zero synthetics, non-toxic, IFRA Compliant.</span>
        </div>
      </section>
    </div>
  );
}

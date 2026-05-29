'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, ShieldCheck, Heart, Sparkles, ChevronRight, Star, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top');
  const [openFaq, setOpenFaq] = useState(null);

  // Fetch trending products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Get first 4 as trending
      } catch (err) {
        console.warn('Backend server not connected. Loading frontend fallback products.');
        // Resilient client-side fallback
        const fallback = [
          {
            id: 1,
            name: 'Oud Midnight',
            price: 3499.00,
            gender: 'Unisex',
            fragrance_type: 'Woody',
            occasion: 'Date Night',
            longevity: '8+ Hours',
            mood: 'Bold',
            description: 'A rich, hypnotic blend of dark agarwood (oud) and sweet damask rose.',
            image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Saffron', 'Nutmeg'],
            heart_notes: ['Damask Rose', 'Jasmine'],
            base_notes: ['Oud (Agarwood)', 'Amber'],
            sillage: 'Heavy',
            projection: 'Strong',
            rating: 4.9,
            reviews_count: 142,
            stock: 8,
            inspired_by: 'Oud Wood'
          },
          {
            id: 2,
            name: 'Citrus Breeze',
            price: 2199.00,
            gender: 'Men',
            fragrance_type: 'Citrus',
            occasion: 'Gym',
            longevity: '4-6 Hours',
            mood: 'Fresh',
            description: 'An explosive burst of crisp Mediterranean lemon and bitter bergamot.',
            image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Lemon', 'Bergamot'],
            heart_notes: ['Sea Salt', 'Lavender'],
            base_notes: ['Cedarwood', 'Oakmoss'],
            sillage: 'Moderate',
            projection: 'Moderate',
            rating: 4.7,
            reviews_count: 98,
            stock: 15,
            inspired_by: 'Dior Sauvage'
          },
          {
            id: 3,
            name: 'Velvet Bloom',
            price: 2899.00,
            gender: 'Women',
            fragrance_type: 'Floral',
            occasion: 'Party',
            longevity: '8+ Hours',
            mood: 'Romantic',
            description: 'A luxurious, ultra-feminine bouquet of white tuberose and vanilla.',
            image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Pink Pepper', 'Pear'],
            heart_notes: ['Tuberose', 'Rose'],
            base_notes: ['Vanilla', 'Patchouli'],
            sillage: 'Strong',
            projection: 'Strong',
            rating: 4.8,
            reviews_count: 86,
            stock: 7,
            inspired_by: 'My Way'
          },
          {
            id: 4,
            name: 'Sandalwood Monarch',
            price: 3299.00,
            gender: 'Men',
            fragrance_type: 'Woody',
            occasion: 'Office',
            longevity: 'All Day',
            mood: 'Elegant',
            description: 'A warm, creamy Indian sandalwood core, sharpened by cedar.',
            image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Cardamom', 'Violet'],
            heart_notes: ['Iris', 'Papyrus'],
            base_notes: ['Sandalwood', 'Cedarwood'],
            sillage: 'Moderate',
            projection: 'Strong',
            rating: 4.9,
            reviews_count: 114,
            stock: 9,
            inspired_by: 'Santal 33'
          }
        ];
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const moodCards = [
    { name: 'Bold', desc: 'Smoky, oud-laden, and intense for evening prestige.', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400', path: '/shop?mood=Bold' },
    { name: 'Romantic', desc: 'Creamy tuberose and vanilla combinations that enchant.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400', path: '/shop?mood=Romantic' },
    { name: 'Fresh', desc: 'Breezy citrus, marine salts, and clean aromatics.', image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=400', path: '/shop?mood=Fresh' },
    { name: 'Elegant', desc: 'Authoritative sandalwood and dry cedar for daily office power.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400', path: '/shop?mood=Elegant' }
  ];

  const faqs = [
    { q: 'How long do Aura Luxe perfumes typically last?', a: 'All our perfumes are formulated at Eau de Parfum (EDP) or Extrait de Parfum concentration (15-25% perfume oil). Our Woody and Oriental scents easily last 8+ hours or All Day, while our Citrus and Fresh scents typically project strongly for 4-6 hours.' },
    { q: 'Is Cash On Delivery (COD) available across India?', a: 'Yes! We offer Cash On Delivery (COD) to over 19,000 pin codes in India. You can choose to pay in cash or via mobile UPI scan at the time of delivery. Free shipping is automatically applied to all orders above ₹999.' },
    { q: 'Are your fragrances safe and skin-friendly?', a: 'Absolutely. Every single perfume we produce is 100% IFRA (International Fragrance Association) compliant. We source our raw materials globally and strictly avoid harmful chemicals, phthalates, and parabens, ensuring they are safe for skin application.' },
    { q: 'Do you offer returns if I do not like the smell?', a: 'To ensure authenticity, we cannot accept returns on opened bottles. However, we highly recommend purchasing our "Discovery Scent Set" (tester vials) first. Additionally, we provide detailed Inspired-by notes and comparison charts on each product page to help you choose accurately.' }
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black overflow-hidden px-4">
        
        {/* Parallax background light glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(212,175,55,0.1),_transparent_40%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          
          {/* Tagline & Call To Action */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-gold text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sartorial Scent Collection</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-zinc-100">
              Leave a Signature <br />
              <span className="text-gold-gradient">Wherever You Go</span>
            </h1>
            
            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed font-sans">
              Ultra-concentrated luxury elixirs inspired by the world\'s finest niche perfumery. Designed for sillage, longevity, and evening confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 shadow-lg hover:shadow-gold/20 flex items-center justify-center group cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/quiz"
                className="w-full sm:w-auto px-8 py-3.5 border border-gold/30 hover:border-gold bg-zinc-900/40 hover:bg-gold/10 text-gold font-sans font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <Compass className="w-4 h-4 mr-1.5" />
                <span>Find Your Scent</span>
              </Link>
            </div>
          </motion.div>

          {/* Premium Bottle Floating Close-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex justify-center relative"
          >
            {/* Visual Glassmorphic Bottle Mockup */}
            <div className="relative w-72 h-96 sm:w-80 sm:h-[400px] rounded-[40px] glass border border-gold/20 flex flex-col items-center justify-between p-8 shadow-2xl gold-glow bg-gradient-to-b from-zinc-900/60 to-zinc-950/80">
              
              {/* Bottle Cap */}
              <div className="absolute top-[-30px] w-24 h-12 bg-gradient-to-r from-gold-dark via-gold to-gold-dark border border-gold/30 rounded-t-lg shadow-lg flex items-center justify-center">
                <div className="w-20 h-1 bg-gold-light/40 rounded-full" />
              </div>
              
              {/* Bottle Neck */}
              <div className="absolute top-[-8px] w-12 h-2 bg-gradient-to-r from-gold-dark to-gold border border-gold/20" />

              {/* Liquid Level Indicator (Glow Effect) */}
              <div className="absolute bottom-2 left-2 right-2 top-24 rounded-b-[36px] bg-gradient-to-t from-gold/10 via-gold/5 to-transparent pointer-events-none" />

              <div className="w-full text-center mt-6">
                <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold">L\'Élixir Supreme</span>
                <h3 className="font-serif text-3xl font-extrabold text-zinc-100 tracking-wider mt-1">VELVET</h3>
                <div className="w-8 h-[1px] bg-gold/40 mx-auto my-2" />
                <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-sans">Extrait De Parfum</p>
              </div>

              <div className="w-full border border-gold/10 rounded-lg p-3 bg-black/40 text-center">
                <span className="text-[10px] text-zinc-500 font-serif block italic">Top Notes</span>
                <span className="text-xs text-zinc-300 font-sans font-bold">Damask Rose • Saffron • Amber</span>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gold/5 filter blur-3xl pointer-events-none" />
          </motion.div>

        </div>
      </section>

      {/* 2. BEST SELLERS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Trending Now</span>
            <h2 className="font-serif text-3xl font-bold text-zinc-200 mt-1">Our Signature Best Sellers</h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors duration-300 font-sans font-bold flex items-center cursor-pointer"
          >
            <span>View All Scents</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-md p-4 space-y-4 animate-pulse h-96">
                <div className="bg-zinc-900 aspect-square rounded w-full" />
                <div className="h-4 bg-zinc-900 rounded w-2/3" />
                <div className="h-3 bg-zinc-900 rounded w-1/2" />
                <div className="h-8 bg-zinc-900 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. DISCOVER BY MOOD / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Smart Categorization</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-200 mt-1">Discover By Mood</h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Smell is closely tied to emotion. Choose a category tailored to the persona you wish to project today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moodCards.map((card, idx) => (
            <motion.div
              key={card.name}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden group border border-zinc-900 shadow-lg cursor-pointer"
            >
              <Link href={card.path} className="block w-full h-full relative cursor-pointer">
                
                {/* Background Image with dark overlay */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

                {/* Card Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold">Category</span>
                  <h3 className="font-serif text-2xl font-bold text-zinc-100 group-hover:text-gold-light transition-colors duration-300">{card.name} Persona</h3>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {card.desc}
                  </p>
                  <div className="flex items-center text-xs text-gold font-semibold uppercase tracking-widest mt-4">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE NOTES VISUALIZER (SIGNATURE SHOT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Dynamic Ingredient Visuals */}
        <div className="flex justify-center relative">
          <div className="w-80 h-[450px] rounded-3xl glass border border-gold/10 p-6 flex flex-col justify-between relative shadow-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gold/5 filter blur-2xl pointer-events-none" />

            <div className="border-b border-zinc-900 pb-4 text-center">
              <span className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold">Scent Anatomy</span>
              <h3 className="font-serif text-xl font-bold text-zinc-100 mt-1">Oud Midnight Layers</h3>
            </div>

            {/* Note Pyramids Visualization */}
            <div className="space-y-6 relative z-10 py-6">
              
              {/* TOP NOTE LAYER */}
              <button
                onClick={() => setActiveTab('top')}
                className={`w-full p-3 rounded border text-left transition-all cursor-pointer ${
                  activeTab === 'top'
                    ? 'border-gold bg-gold/5 text-gold'
                    : 'border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                  <span>Top Note (First 15m)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Opening</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1.5">Saffron, Nutmeg & Cardamom spices</p>
              </button>

              {/* HEART NOTE LAYER */}
              <button
                onClick={() => setActiveTab('heart')}
                className={`w-full p-3 rounded border text-left transition-all cursor-pointer ${
                  activeTab === 'heart'
                    ? 'border-gold bg-gold/5 text-gold'
                    : 'border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                  <span>Heart Note (2 - 4h)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Core Identity</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1.5">Damask Rose, Blooming Jasmine Sambac</p>
              </button>

              {/* BASE NOTE LAYER */}
              <button
                onClick={() => setActiveTab('base')}
                className={`w-full p-3 rounded border text-left transition-all cursor-pointer ${
                  activeTab === 'base'
                    ? 'border-gold bg-gold/5 text-gold'
                    : 'border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                  <span>Base Note (8h+)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Residual Trail</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1.5">Agarwood (Oud), Ambergris, Smoky Vetiver</p>
              </button>

            </div>

            <div className="border-t border-zinc-900 pt-3 text-center">
              <span className="text-[10px] text-zinc-500 italic block">Active Note Breakdown</span>
            </div>

          </div>
        </div>

        {/* Right Side: Copy & Notes Explanation */}
        <div className="space-y-6 text-left">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Visual Scent Structure</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-200">
            How We Visualize <span className="text-gold-gradient">The Fragrance Trail</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Unlike cheap alternatives, premium niche perfumes do not smell the same all day. They evolve on your skin.
            Our layered note visualizer lets you trace the exact progression of oils:
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-zinc-900 text-gold rounded border border-zinc-800 mt-0.5">
                <span className="font-serif font-bold text-xs">01</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">The Opening (Top Notes)</h4>
                <p className="text-xs text-zinc-500">Volatile citrus and fresh spices that project instantly upon spraying.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-zinc-900 text-gold rounded border border-zinc-800 mt-0.5">
                <span className="font-serif font-bold text-xs">02</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">The Scent Heart (Heart Notes)</h4>
                <p className="text-xs text-zinc-500">Warm florals or herbal elements that define the core personality of the fragrance.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-zinc-900 text-gold rounded border border-zinc-800 mt-0.5">
                <span className="font-serif font-bold text-xs">03</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">The Residual Sillage (Base Notes)</h4>
                <p className="text-xs text-zinc-500">Heavy, slow-evaporating oils like Sandalwood, Oud, and Musk that linger all day.</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 cursor-pointer shadow hover:shadow-gold/10 inline-flex items-center"
            >
              Shop Niche Perfumes
            </Link>
          </div>
        </div>

      </section>

      {/* 5. BRAND STORY */}
      <section
        id="brand-story"
        className="relative bg-[url('https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200')] bg-fixed bg-cover bg-center py-28 text-center"
      >
        {/* Intense dark overlay for high contrast */}
        <div className="absolute inset-0 bg-black/85" />

        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">L\'Art De La Parfumerie</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100">Our Brand Story</h2>
          <div className="w-12 h-[1px] bg-gold/55 mx-auto" />
          <p className="text-zinc-300 text-sm sm:text-base font-serif italic leading-relaxed">
            "Aura Luxe was born out of a desire to bypass the multi-million dollar marketing markups of international designers.
            We work directly with certified oil houses in Grasse, France, importing raw botanical concentrates and blending them in-house.
            No expensive models, no fancy billboards—just high-concentration juice designed to project confidence."
          </p>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-sans font-bold pt-4">
            Imported Concentrates • Extrait De Parfum • Crafted in India
          </p>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Queries & Help</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-200 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-zinc-900 rounded bg-zinc-950/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-serif text-sm sm:text-base text-zinc-200 hover:text-gold cursor-pointer transition-colors duration-300"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 pt-0 border-t border-zinc-900 text-xs sm:text-sm text-zinc-400 leading-relaxed bg-black/20">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-zinc-950/20 border-t border-b border-zinc-900/60 py-16">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Scent Testimonials</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-200 mt-1">Customer Reviews</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/40 p-6 rounded border border-zinc-900 space-y-4">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-gold" />)}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">
              "Oud Midnight is simply legendary. I sprayed it at 8:00 AM before heading to my office, and I could still smell the smoky amber notes at 9:00 PM. Highly recommend."
            </p>
            <div>
              <span className="text-xs text-zinc-300 font-bold block">Aarav Mehta</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Mumbai, IN</span>
            </div>
          </div>
          <div className="bg-zinc-950/40 p-6 rounded border border-zinc-900 space-y-4">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-gold" />)}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">
              "I purchased Velvet Bloom and got so many compliments at a wedding party. It smells extremely similar to Armani My Way but at a third of the price."
            </p>
            <div>
              <span className="text-xs text-zinc-300 font-bold block">Neha Patel</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Ahmedabad, IN</span>
            </div>
          </div>
          <div className="bg-zinc-950/40 p-6 rounded border border-zinc-900 space-y-4">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-gold" />)}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">
              "Citrus Breeze is the ultimate gym perfume. Extremely refreshing grapefruit and marine accords. It doesn\'t smell cheap or chemical-like at all."
            </p>
            <div>
              <span className="text-xs text-zinc-300 font-bold block">Kabir Malhotra</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Delhi, IN</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Aura Aesthetics</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-200 mt-1">Lifestyle Gallery</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative group border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400" alt="Instagram 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-gold font-sans text-xs uppercase tracking-wider font-bold">@AuraLuxeScent</span>
            </div>
          </div>
          <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative group border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400" alt="Instagram 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-gold font-sans text-xs uppercase tracking-wider font-bold">@AuraLuxeScent</span>
            </div>
          </div>
          <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative group border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=400" alt="Instagram 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-gold font-sans text-xs uppercase tracking-wider font-bold">@AuraLuxeScent</span>
            </div>
          </div>
          <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative group border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400" alt="Instagram 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-gold font-sans text-xs uppercase tracking-wider font-bold">@AuraLuxeScent</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

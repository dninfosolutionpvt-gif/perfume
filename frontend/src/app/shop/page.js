'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter States loaded from URL search parameters on mount
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [occasion, setOccasion] = useState(searchParams.get('occasion') || 'All');
  const [longevity, setLongevity] = useState(searchParams.get('longevity') || 'All');
  const [mood, setMood] = useState(searchParams.get('mood') || 'All');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setGender(searchParams.get('gender') || 'All');
    setType(searchParams.get('type') || 'All');
    setOccasion(searchParams.get('occasion') || 'All');
    setLongevity(searchParams.get('longevity') || 'All');
    setMood(searchParams.get('mood') || 'All');
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (gender !== 'All') queryParams.append('gender', gender);
        if (type !== 'All') queryParams.append('type', type);
        if (occasion !== 'All') queryParams.append('occasion', occasion);
        if (longevity !== 'All') queryParams.append('longevity', longevity);
        if (mood !== 'All') queryParams.append('mood', mood);

        const response = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.warn('Backend connection failed. Filtering client-side fallback.');
        
        // Static local products database for resilient offline fallback
        const offlineFallback = [
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
          },
          {
            id: 5,
            name: 'Blue Vague',
            price: 2499.00,
            gender: 'Unisex',
            fragrance_type: 'Aquatic',
            occasion: 'Summer',
            longevity: '4-6 Hours',
            mood: 'Fresh',
            description: 'An endless summer in a bottle. Shimmering marine accords, ozone, and wet stones.',
            image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Marine Accord', 'Grapefruit'],
            heart_notes: ['Seaweed', 'Sage'],
            base_notes: ['Driftwood', 'Vetiver'],
            sillage: 'Moderate',
            projection: 'Moderate',
            rating: 4.6,
            reviews_count: 74,
            stock: 12,
            inspired_by: 'Wood Sage & Sea Salt'
          },
          {
            id: 6,
            name: 'Nuit Noir',
            price: 3599.00,
            gender: 'Women',
            fragrance_type: 'Oriental',
            occasion: 'Date Night',
            longevity: 'All Day',
            mood: 'Bold',
            description: 'Seductive, mysterious, and intoxicating. Rich, dark roasted coffee beans and sweet vanilla.',
            image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
            image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
            top_notes: ['Pear', 'Orange Blossom'],
            heart_notes: ['Coffee Beans', 'Bitter Almond'],
            base_notes: ['Vanilla', 'Patchouli'],
            sillage: 'Strong',
            projection: 'Strong',
            rating: 4.9,
            reviews_count: 156,
            stock: 5,
            inspired_by: 'Black Opium'
          }
        ];

        // Apply filters in-memory
        let filtered = [...offlineFallback];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        if (gender !== 'All') {
          filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
        }
        if (type !== 'All') {
          filtered = filtered.filter(p => p.fragrance_type.toLowerCase() === type.toLowerCase());
        }
        if (occasion !== 'All') {
          filtered = filtered.filter(p => p.occasion.toLowerCase() === occasion.toLowerCase());
        }
        if (longevity !== 'All') {
          filtered = filtered.filter(p => p.longevity.toLowerCase() === longevity.toLowerCase());
        }
        if (mood !== 'All') {
          filtered = filtered.filter(p => p.mood.toLowerCase() === mood.toLowerCase());
        }

        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    }, [searchQuery, gender, type, occasion, longevity, mood]);

    // Push filters state into URL
    const updateUrlParams = (key, value) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (value === 'All' || !value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
      router.push(`/shop?${current.toString()}`);
    };

    const handleReset = () => {
      setSearchQuery('');
      setGender('All');
      setType('All');
      setOccasion('All');
      setLongevity('All');
      setMood('All');
      router.push('/shop');
    };

  const filterOptions = {
    gender: ['All', 'Men', 'Women', 'Unisex'],
    type: ['All', 'Woody', 'Fresh', 'Citrus', 'Floral', 'Musky', 'Oriental', 'Aquatic'],
    occasion: ['All', 'Office', 'Party', 'Date Night', 'Summer', 'Winter', 'Gym'],
    longevity: ['All', '4-6 Hours', '8+ Hours', 'All Day'],
    mood: ['All', 'Bold', 'Romantic', 'Fresh', 'Elegant']
  };

  // Helper component for filter groups
  const FilterGroup = ({ label, currentVal, setVal, options, paramKey }) => (
    <div className="space-y-2 border-b border-zinc-900 pb-5">
      <h4 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">{label}</h4>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setVal(opt);
              updateUrlParams(paramKey, opt);
            }}
            className={`px-3 py-1 rounded text-[10px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              currentVal === opt
                ? 'bg-gold text-black font-bold border border-gold'
                : 'bg-zinc-950/40 text-zinc-400 border border-zinc-900 hover:border-zinc-800'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Aura Luxe Registry</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-200 mt-1">Explore Scent Collection</h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed">
          Filter by gender, fragrance families, occasion, sillage, or mood traits to match your signature profile.
        </p>
      </div>

      {/* Top Search & Controls Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 rounded bg-zinc-950/40 border border-zinc-900">
        
        {/* Search Bar */}
        <div className="w-full md:max-w-md flex relative">
          <input
            type="text"
            placeholder="Search by perfume name or notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrlParams('search', e.target.value);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-gold px-4 py-2.5 pl-10 rounded text-xs text-zinc-300 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-3.5" />
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* Reset Filters */}
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-gold border border-zinc-800 transition-all cursor-pointer flex items-center justify-center space-x-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden px-4 py-2.5 rounded bg-gold text-black font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 w-full cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

      </div>

      {/* Main Layout (Sidebar Filter + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 p-5 border border-zinc-900 rounded bg-zinc-950/20 self-start">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span className="font-serif text-sm text-zinc-200 font-bold uppercase tracking-wider">Refine By</span>
          </div>

          <FilterGroup label="Gender Persona" currentVal={gender} setVal={setGender} options={filterOptions.gender} paramKey="gender" />
          <FilterGroup label="Fragrance Type" currentVal={type} setVal={setType} options={filterOptions.type} paramKey="type" />
          <FilterGroup label="Occasion" currentVal={occasion} setVal={setOccasion} options={filterOptions.occasion} paramKey="occasion" />
          <FilterGroup label="Longevity" currentVal={longevity} setVal={setLongevity} options={filterOptions.longevity} paramKey="longevity" />
          <FilterGroup label="Mood Traits" currentVal={mood} setVal={setMood} options={filterOptions.mood} paramKey="mood" />
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-md p-4 space-y-4 animate-pulse h-[390px]">
                  <div className="bg-zinc-900 aspect-square rounded w-full" />
                  <div className="h-4 bg-zinc-900 rounded w-2/3" />
                  <div className="h-3 bg-zinc-900 rounded w-1/2" />
                  <div className="h-8 bg-zinc-900 rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-zinc-950/40 border border-zinc-900 rounded-lg space-y-4">
              <Compass className="w-16 h-16 text-zinc-700 stroke-[1]" />
              <h3 className="font-serif text-xl text-zinc-300">No Matching Perfumes</h3>
              <p className="text-zinc-500 text-sm max-w-sm">
                We couldn\'t find any fragrances matching your exact filter selections. Try resetting your query parameters.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black font-semibold rounded transition-all duration-300 cursor-pointer uppercase tracking-wider text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Filter Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs glass-intense z-50 flex flex-col shadow-2xl overflow-hidden p-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                <span className="font-serif text-lg text-gold font-bold uppercase tracking-wider">Scent Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-gold cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
                <FilterGroup label="Gender Persona" currentVal={gender} setVal={setGender} options={filterOptions.gender} paramKey="gender" />
                <FilterGroup label="Fragrance Type" currentVal={type} setVal={setType} options={filterOptions.type} paramKey="type" />
                <FilterGroup label="Occasion" currentVal={occasion} setVal={setOccasion} options={filterOptions.occasion} paramKey="occasion" />
                <FilterGroup label="Longevity" currentVal={longevity} setVal={setLongevity} options={filterOptions.longevity} paramKey="longevity" />
                <FilterGroup label="Mood Traits" currentVal={mood} setVal={setMood} options={filterOptions.mood} paramKey="mood" />
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-gold hover:bg-gold-dark text-black font-semibold uppercase tracking-wider text-xs rounded transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

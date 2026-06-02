'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X, Search, RotateCcw, SlidersHorizontal, Compass } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../lib/shopify';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [occasion, setOccasion] = useState(searchParams.get('occasion') || 'All');
  const [longevity, setLongevity] = useState(searchParams.get('longevity') || 'All');
  const [mood, setMood] = useState(searchParams.get('mood') || 'All');

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state from URL
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setGender(searchParams.get('gender') || 'All');
    setType(searchParams.get('type') || 'All');
    setOccasion(searchParams.get('occasion') || 'All');
    setLongevity(searchParams.get('longevity') || 'All');
    setMood(searchParams.get('mood') || 'All');
  }, [searchParams]);

  // Fetch all products from Shopify on mount
  useEffect(() => {
    async function fetchShopifyProducts() {
      setLoading(true);
      try {
        const data = await getProducts({ first: 50 });
        setAllProducts(data);
      } catch (err) {
        console.error('Shopify fetch error:', err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchShopifyProducts();
  }, []);

  // Apply filters client-side on allProducts
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.inspired_by?.toLowerCase().includes(q)
      );
    }
    if (gender !== 'All') {
      filtered = filtered.filter(p => p.gender?.toLowerCase() === gender.toLowerCase());
    }
    if (type !== 'All') {
      filtered = filtered.filter(p => p.fragrance_type?.toLowerCase() === type.toLowerCase());
    }
    if (occasion !== 'All') {
      filtered = filtered.filter(p => p.occasion?.toLowerCase() === occasion.toLowerCase());
    }
    if (longevity !== 'All') {
      filtered = filtered.filter(p => p.longevity?.toLowerCase() === longevity.toLowerCase());
    }
    if (mood !== 'All') {
      filtered = filtered.filter(p => p.mood?.toLowerCase() === mood.toLowerCase());
    }

    setProducts(filtered);
  }, [allProducts, searchQuery, gender, type, occasion, longevity, mood]);

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

  const FilterGroup = ({ label, currentVal, setVal, options, paramKey }) => (
    <div className="space-y-2 border-b border-zinc-100 pb-5">
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
                : 'bg-[#FAF8F5] text-zinc-600 border border-zinc-200 hover:border-gold/30'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#FAF8F5] text-[#1C1917] min-h-screen">

      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Orova Paris Registry</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917] mt-1">Explore Scent Collection</h1>
        <p className="text-zinc-600 text-xs sm:text-sm mt-2 leading-relaxed">
          Filter by gender, fragrance families, occasion, sillage, or mood traits to match your signature profile.
        </p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 rounded bg-white border border-gold/10 shadow-sm">
        <div className="w-full md:max-w-md flex relative">
          <input
            type="text"
            placeholder="Search by perfume name or notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrlParams('search', e.target.value);
            }}
            className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold px-4 py-2.5 pl-10 rounded text-xs text-zinc-700 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded bg-white hover:bg-gold/5 text-zinc-600 hover:text-gold border border-zinc-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden px-4 py-2.5 rounded bg-gold text-black font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 w-full cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block space-y-6 p-5 border border-gold/10 rounded bg-white self-start shadow-sm">
          <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span className="font-serif text-sm text-[#1C1917] font-bold uppercase tracking-wider">Refine By</span>
          </div>
          <FilterGroup label="Gender Persona" currentVal={gender} setVal={setGender} options={filterOptions.gender} paramKey="gender" />
          <FilterGroup label="Fragrance Type" currentVal={type} setVal={setType} options={filterOptions.type} paramKey="type" />
          <FilterGroup label="Occasion" currentVal={occasion} setVal={setOccasion} options={filterOptions.occasion} paramKey="occasion" />
          <FilterGroup label="Longevity" currentVal={longevity} setVal={setLongevity} options={filterOptions.longevity} paramKey="longevity" />
          <FilterGroup label="Mood Traits" currentVal={mood} setVal={setMood} options={filterOptions.mood} paramKey="mood" />
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-md p-4 space-y-4 animate-pulse h-[390px]">
                  <div className="bg-zinc-100 aspect-square rounded w-full" />
                  <div className="h-4 bg-zinc-100 rounded w-2/3" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  <div className="h-8 bg-zinc-100 rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white border border-gold/10 rounded-lg space-y-4 shadow-sm">
              <Compass className="w-16 h-16 text-zinc-400 stroke-[1]" />
              <h3 className="font-serif text-xl text-[#1C1917]">No Matching Perfumes</h3>
              <p className="text-zinc-600 text-sm max-w-sm">
                We couldn&apos;t find any fragrances matching your filters. Try resetting your search.
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white z-50 flex flex-col shadow-2xl overflow-hidden p-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                <span className="font-serif text-lg text-gold font-bold uppercase tracking-wider">Scent Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-gold cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <FilterGroup label="Gender Persona" currentVal={gender} setVal={setGender} options={filterOptions.gender} paramKey="gender" />
                <FilterGroup label="Fragrance Type" currentVal={type} setVal={setType} options={filterOptions.type} paramKey="type" />
                <FilterGroup label="Occasion" currentVal={occasion} setVal={setOccasion} options={filterOptions.occasion} paramKey="occasion" />
                <FilterGroup label="Longevity" currentVal={longevity} setVal={setLongevity} options={filterOptions.longevity} paramKey="longevity" />
                <FilterGroup label="Mood Traits" currentVal={mood} setVal={setMood} options={filterOptions.mood} paramKey="mood" />
              </div>
              <div className="pt-4 border-t border-zinc-100">
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

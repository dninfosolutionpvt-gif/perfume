'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X, Search, RotateCcw, SlidersHorizontal, Compass, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getCollections } from '../../lib/shopify';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedVendor, setSelectedVendor] = useState(searchParams.get('vendor') || 'All');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derived filter options from actual Shopify data
  const productTypes = ['All', ...new Set(allProducts.map(p => p.productType).filter(Boolean))];
  const vendors = ['All', ...new Set(allProducts.map(p => p.vendor).filter(Boolean))];
  const collectionTitles = ['All', ...collections.map(c => c.title)];

  // Fetch all data from Shopify on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prods, cols] = await Promise.all([
          getProducts({ first: 100 }),
          getCollections({ first: 50 }),
        ]);
        setAllProducts(prods);
        setCollections(cols);
      } catch (err) {
        console.error('Shopify fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sync from URL
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCollection(searchParams.get('collection') || 'All');
    setSelectedType(searchParams.get('type') || 'All');
    setSelectedVendor(searchParams.get('vendor') || 'All');
  }, [searchParams]);

  // Apply filters client-side
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.vendor?.toLowerCase().includes(q)
      );
    }

    if (selectedCollection !== 'All') {
      filtered = filtered.filter(p =>
        p.collections?.some(c => c === selectedCollection)
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    if (selectedVendor !== 'All') {
      filtered = filtered.filter(p => p.vendor === selectedVendor);
    }

    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    setProducts(filtered);
  }, [allProducts, searchQuery, selectedCollection, selectedType, selectedVendor, inStockOnly]);

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
    setSelectedCollection('All');
    setSelectedType('All');
    setSelectedVendor('All');
    setInStockOnly(false);
    router.push('/shop');
  };

  const FilterGroup = ({ label, currentVal, setVal, options, paramKey }) => (
    <div className="space-y-2 border-b border-zinc-100 pb-5">
      <h4 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">{label}</h4>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => { setVal(opt); updateUrlParams(paramKey, opt); }}
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

  const FilterSidebar = () => (
    <>
      <FilterGroup label="Collection" currentVal={selectedCollection} setVal={setSelectedCollection} options={collectionTitles} paramKey="collection" />
      {productTypes.length > 1 && <FilterGroup label="Product Type" currentVal={selectedType} setVal={setSelectedType} options={productTypes} paramKey="type" />}
      {vendors.length > 1 && <FilterGroup label="Brand / Vendor" currentVal={selectedVendor} setVal={setSelectedVendor} options={vendors} paramKey="vendor" />}
      <div className="space-y-2 pb-5">
        <h4 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Availability</h4>
        <label className="flex items-center space-x-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-gold w-4 h-4"
          />
          <span className="text-xs text-zinc-600 font-sans">In Stock Only</span>
        </label>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#FAF8F5] text-[#1C1917] min-h-screen">

      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Shop</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917] mt-1">Our Collection</h1>
        <p className="text-zinc-600 text-xs sm:text-sm mt-2 leading-relaxed">
          {loading ? 'Loading products...' : `${products.length} products found`}
        </p>
      </div>

      {/* Collection Tabs */}
      {!loading && collections.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {collectionTitles.map(col => (
            <button
              key={col}
              onClick={() => { setSelectedCollection(col); updateUrlParams('collection', col); }}
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCollection === col
                  ? 'bg-gold text-black border-gold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-gold/50'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      )}

      {/* Search & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 rounded bg-white border border-gold/10 shadow-sm">
        <div className="w-full md:max-w-md flex relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); updateUrlParams('search', e.target.value); }}
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
            <span className="hidden sm:inline">Reset</span>
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
            <span className="font-serif text-sm text-[#1C1917] font-bold uppercase tracking-wider">Filter By</span>
          </div>
          <FilterSidebar />
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
              <h3 className="font-serif text-xl text-[#1C1917]">No Products Found</h3>
              <p className="text-zinc-600 text-sm max-w-sm">Try resetting your filters or search.</p>
              <button onClick={handleReset} className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black font-semibold rounded transition-all duration-300 cursor-pointer uppercase tracking-wider text-xs">
                Clear Filters
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 bg-black z-50 cursor-pointer" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white z-50 flex flex-col shadow-2xl overflow-hidden p-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                <span className="font-serif text-lg text-gold font-bold uppercase tracking-wider">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-gold cursor-pointer"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <FilterSidebar />
              </div>
              <div className="pt-4 border-t border-zinc-100">
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full py-3 bg-gold hover:bg-gold-dark text-black font-semibold uppercase tracking-wider text-xs rounded transition-all cursor-pointer">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}

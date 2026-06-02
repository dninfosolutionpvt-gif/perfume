'use client';

import React, { useState, useEffect, use } from 'react';
import { useCart } from '../../../context/CartContext';
import { Heart, ShoppingBag, Star, ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TrustBadges from '../../../components/TrustBadges';
import { getProduct } from '../../../lib/shopify';

export default function ProductDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const handle = params.id; // could be handle or ID
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Reviews (local only — Shopify Storefront API doesn't expose reviews)
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  const wishlisted = isInWishlist(product?.id);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await getProduct(handle);
        setProduct(prod);
        if (prod) {
          // Set default selected options (first value of each option)
          const defaults = {};
          prod.options?.forEach(opt => {
            defaults[opt.name] = opt.values[0];
          });
          setSelectedOptions(defaults);
          setSelectedVariant(prod.variants?.[0] || null);
        }
      } catch (err) {
        console.error('Shopify product fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [handle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product?.variants?.length) return;
    const matched = product.variants.find(v =>
      v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
    );
    if (matched) setSelectedVariant(matched);
  }, [selectedOptions, product]);

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variantId = selectedVariant?.id || product.variantId;
    addToCart(product, 1, variantId);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviews(prev => [{
      id: Date.now(),
      user_name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString()
    }, ...prev]);
    setReviewName('');
    setReviewComment('');
    setReviewMessage('Thank you! Your review has been posted.');
    setTimeout(() => setReviewMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5] text-center p-6">
        <h2 className="font-serif text-2xl text-[#1C1917] font-bold">Product Not Found</h2>
        <p className="text-zinc-500 text-sm">This product could not be found in our store.</p>
        <Link href="/shop" className="px-6 py-2.5 bg-gold text-black uppercase text-xs font-sans font-bold tracking-widest rounded">
          Back to Shop
        </Link>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const hasSale = displayCompareAtPrice && displayCompareAtPrice > displayPrice;
  const allImages = product.allImages?.length > 0 ? product.allImages : [product.image_front, product.image_side].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 bg-[#FAF8F5] text-[#1C1917] min-h-screen">

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-800 font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-white border border-gold/15 overflow-hidden relative shadow-sm">
            {hasSale && (
              <span className="absolute left-4 top-4 z-10 px-3 py-1 bg-red-600 text-white font-sans text-xs uppercase font-bold tracking-wider rounded shadow-sm">
                Sale
              </span>
            )}
            <img
              src={allImages[activeImage] || product.image_front}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded overflow-hidden border transition-all cursor-pointer bg-white ${
                    activeImage === i ? 'border-gold scale-95 shadow' : 'border-zinc-200 hover:border-gold/30'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">

          {/* Vendor / Collection */}
          <div className="flex flex-wrap gap-2">
            {product.vendor && (
              <span className="text-[11px] text-gold uppercase tracking-widest border border-gold/30 rounded px-2.5 py-0.5 bg-gold/5">
                {product.vendor}
              </span>
            )}
            {product.collections?.slice(0, 2).map(col => (
              <span key={col} className="text-[11px] text-zinc-500 uppercase tracking-widest border border-zinc-200 rounded px-2.5 py-0.5 bg-zinc-50">
                {col}
              </span>
            ))}
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-wide mb-2">
              {product.name}
            </h1>
            {product.rating > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-gold stroke-gold' : 'stroke-zinc-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-sans text-zinc-700 font-semibold">{product.rating}</span>
                {product.reviews_count > 0 && <span className="text-xs font-sans text-zinc-500">({product.reviews_count} reviews)</span>}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="border-t border-b border-zinc-100 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-sans font-bold text-gold">
                ₹{displayPrice.toLocaleString()}
              </span>
              {hasSale && (
                <span className="text-lg text-zinc-400 line-through font-sans">
                  ₹{displayCompareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
            {selectedVariant && (
              <span className={`text-xs font-sans font-bold uppercase tracking-wider px-2 py-1 rounded ${
                selectedVariant.availableForSale ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-zinc-600 text-sm leading-relaxed font-sans">{product.description}</p>
          )}

          {/* Variant Selectors */}
          {product.options?.filter(opt => opt.values.length > 1).map(option => (
            <div key={option.id} className="space-y-2">
              <h3 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">
                {option.name}: <span className="text-[#1C1917] normal-case font-normal">{selectedOptions[option.name]}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {option.values.map(value => (
                  <button
                    key={value}
                    onClick={() => handleOptionSelect(option.name, value)}
                    className={`px-3 py-1.5 rounded border text-xs font-sans font-semibold transition-all cursor-pointer ${
                      selectedOptions[option.name] === value
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-gold/40'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 6).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-[#FAF8F5] border border-zinc-200 text-zinc-500 text-[9px] uppercase tracking-wider rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant && !selectedVariant.availableForSale}
              className="flex-1 py-4 bg-gold hover:bg-gold-dark text-black rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{selectedVariant && !selectedVariant.availableForSale ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-4 rounded border transition-colors cursor-pointer bg-white ${
                wishlisted ? 'border-gold bg-gold/10 text-gold shadow-sm' : 'border-zinc-200 text-zinc-500 hover:text-gold hover:border-gold/30 shadow-sm'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-gold' : ''}`} />
            </button>
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <TrustBadges detailed={true} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Write a Review</span>
          </div>
          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded bg-white border border-gold/15 shadow-sm text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold">Your Name</label>
              <input required type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name"
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold block">Rating</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none">
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold">Review</label>
              <textarea required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="3"
                placeholder="Share your experience..."
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-[10px] rounded transition-colors cursor-pointer">
              Post Review
            </button>
            {reviewMessage && <p className="text-[10px] text-gold font-sans text-center">{reviewMessage}</p>}
          </form>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">Reviews ({reviews.length})</h3>
          </div>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-10 text-center">Be the first to review {product.name}!</p>
            ) : reviews.map((review) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded bg-white border border-gold/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#1C1917]">{review.user_name}</span>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold stroke-gold' : 'stroke-zinc-300'}`} />)}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

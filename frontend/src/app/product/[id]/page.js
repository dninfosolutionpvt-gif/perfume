'use client';

import React, { useState, useEffect, use } from 'react';
import { useCart } from '../../../context/CartContext';
import { Heart, ShoppingBag, Star, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TrustBadges from '../../../components/TrustBadges';
import { getProduct } from '../../../lib/shopify';

export default function ProductDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params.id;
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(productId);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('front');

  // Review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const defaultFront = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600';
  const defaultSide = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600';
  const defaultLife = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600';
  const defaultSpray = 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600';
  const defaultBox = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600';

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await getProduct(productId);
        setProduct(prod);
      } catch (err) {
        console.error('Shopify product fetch error:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setSubmittingReview(true);
    const newRev = {
      id: Date.now(),
      user_name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);
    setReviewName('');
    setReviewComment('');
    setReviewMessage('Thank you! Your review has been posted.');
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest font-bold">Loading Scent Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5] text-center p-6">
        <h2 className="font-serif text-2xl text-[#1C1917] font-bold">Fragrance Not Found</h2>
        <p className="text-zinc-500 text-sm">We could not find this perfume. Please return to our collection.</p>
        <Link href="/shop" className="px-6 py-2.5 bg-gold text-black uppercase text-xs font-sans font-bold tracking-widest rounded">
          Back to Shop
        </Link>
      </div>
    );
  }

  const galleryImages = {
    front: product.image_front || defaultFront,
    side: product.image_side || defaultSide,
    lifestyle: product.image_lifestyle || defaultLife,
    spray: product.image_spray || defaultSpray,
    box: product.image_box || defaultBox,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 bg-[#FAF8F5] text-[#1C1917] min-h-screen">

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-800 font-semibold">{product.name}</span>
      </div>

      {/* Main product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-white border border-gold/15 overflow-hidden relative group shadow-sm">
            {product.stock <= 5 && (
              <div className="absolute left-4 top-4 z-10 px-3 py-1 bg-red-50 border border-red-200 text-red-600 font-sans text-xs uppercase font-bold tracking-wider rounded flex items-center space-x-1 animate-pulse shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>Only {product.stock} Left</span>
              </div>
            )}
            <img
              src={galleryImages[activeImage]}
              alt={`${product.name}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(galleryImages).map((key) => (
              <button
                key={key}
                onClick={() => setActiveImage(key)}
                className={`aspect-square rounded overflow-hidden border transition-all cursor-pointer bg-white ${
                  activeImage === key ? 'border-gold scale-95 shadow' : 'border-zinc-200 hover:border-gold/30'
                }`}
              >
                <img src={galleryImages[key]} alt={key} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <span className="inline-block text-[11px] text-gold uppercase tracking-widest border border-gold/30 rounded px-2.5 py-0.5 bg-gold/5 mb-3 italic">
              Inspired by {product.inspired_by || 'Original Formula'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-wide mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-gold stroke-gold' : 'stroke-zinc-300'}`} />
                ))}
              </div>
              <span className="text-sm font-sans text-zinc-700 font-semibold">{product.rating}</span>
              <span className="text-xs font-sans text-zinc-500">({product.reviews_count} reviews)</span>
            </div>
          </div>

          <div className="border-t border-b border-zinc-100 py-4 flex items-center justify-between">
            <span className="text-3xl font-sans font-bold text-gold">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-sans">Extrait De Parfum • 100ml</span>
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed font-sans">{product.description}</p>

          {/* Sillage & Projection */}
          <div className="space-y-4 p-4 rounded bg-white border border-gold/15 shadow-sm">
            <h3 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Projection & Trail</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Sillage (Fragrance Trail)</span>
                <span className="text-gold font-bold">{product.sillage}</span>
              </div>
              <div className="h-1.5 w-full bg-[#FAF8F5] border border-zinc-100 rounded-full overflow-hidden">
                <div className="bg-gold h-full rounded-full" style={{ width: product.sillage === 'Heavy' ? '100%' : product.sillage === 'Strong' ? '75%' : '50%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Projection (Strength)</span>
                <span className="text-gold font-bold">{product.projection}</span>
              </div>
              <div className="h-1.5 w-full bg-[#FAF8F5] border border-zinc-100 rounded-full overflow-hidden">
                <div className="bg-gold h-full rounded-full" style={{ width: product.projection === 'Strong' ? '100%' : product.projection === 'Moderate' ? '65%' : '35%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-zinc-100 mt-2">
              <div>
                <span className="text-zinc-500 block">Best Season:</span>
                <span className="text-zinc-700 font-semibold">{product.best_season}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Best Time:</span>
                <span className="text-zinc-700 font-semibold">{product.best_time}</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="flex-1 py-4 bg-gold hover:bg-gold-dark text-black rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
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

      {/* Fragrance Notes */}
      {(product.top_notes?.length > 0 || product.heart_notes?.length > 0 || product.base_notes?.length > 0) && (
        <section className="bg-white border border-gold/15 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-10 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Botanical Anatomy</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">Fragrance Pyramid Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { label: 'Top Notes', sub: 'First 15-30 Minutes', notes: product.top_notes || [] },
              { label: 'Heart Notes', sub: '2-4 Hours', notes: product.heart_notes || [] },
              { label: 'Base Notes', sub: '8-12+ Hours', notes: product.base_notes || [] },
            ].map(({ label, sub, notes }) => (
              <div key={label} className="p-6 rounded bg-[#FAF8F5] border border-gold/15 hover:border-gold/45 transition-colors shadow-sm">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">{label}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">{sub}</p>
                <div className="flex flex-wrap gap-1.5">
                  {notes.length > 0 ? notes.map((note) => (
                    <span key={note} className="px-2.5 py-1 bg-white border border-zinc-200 text-zinc-800 text-xs rounded font-sans font-medium shadow-sm">{note}</span>
                  )) : <span className="text-xs text-zinc-400 italic">See product description</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Prestige Comparison</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">Perfume Comparison Chart</h2>
        </div>
        <div className="w-full overflow-x-auto rounded border border-gold/10 bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-[#FAF8F5]">
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">Feature</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">OROVA PARIS</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-zinc-500">Retail Brand</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600 divide-y divide-zinc-100 font-sans">
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Concentration</td>
                <td className="p-4">Extrait de Parfum (22% Oils)</td>
                <td className="p-4 text-zinc-500">EDT / EDP (10-15%)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Longevity</td>
                <td className="p-4">{product.longevity} on Skin</td>
                <td className="p-4 text-zinc-500">4-6 Hours avg.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Price (India)</td>
                <td className="p-4 text-gold font-bold">₹{product.price.toLocaleString()}</td>
                <td className="p-4 text-zinc-500">₹12,000 - ₹18,000</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Sillage</td>
                <td className="p-4">{product.sillage} Trail</td>
                <td className="p-4 text-zinc-500">Intimate / Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Add Testimonial</span>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">Write a Review</h3>
          </div>
          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded bg-white border border-gold/15 shadow-sm text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold">Your Name</label>
              <input required type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Aarav Mehta"
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold block">Star Rating</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none">
                <option value={5}>5 Stars - Elite</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Unsatisfactory</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-600 font-semibold">Comments</label>
              <textarea required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="3"
                placeholder="Tell others about the scent..."
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none resize-none" />
            </div>
            <button type="submit" disabled={submittingReview}
              className="w-full py-2.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-[10px] rounded transition-colors disabled:opacity-50 cursor-pointer">
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
            {reviewMessage && <p className="text-[10px] text-gold font-sans text-center mt-2">{reviewMessage}</p>}
          </form>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">Customer Reviews ({reviews.length})</h3>
          </div>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-10 text-center">Be the first to review {product.name}!</p>
            ) : (
              reviews.map((review) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded bg-white border border-gold/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#1C1917]">{review.user_name}</span>
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold stroke-gold' : 'stroke-zinc-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-serif italic">&ldquo;{review.comment}&rdquo;</p>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

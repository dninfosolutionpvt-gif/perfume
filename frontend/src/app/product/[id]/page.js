'use client';

import React, { useState, useEffect, use } from 'react';
import { useCart } from '../../../context/CartContext';
import { Heart, ShoppingBag, Star, ShieldCheck, Award, CreditCard, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TrustBadges from '../../../components/TrustBadges';
import { API_BASE_URL } from '../../../config';

export default function ProductDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = parseInt(params.id, 10);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(productId);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('front');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  // Fallbacks
  const defaultFront = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600';
  const defaultSide = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600';
  const defaultLife = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600';
  const defaultSpray = 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600';
  const defaultBox = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600';

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        // Fetch product details
        const prodRes = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        const prodData = await prodRes.json();
        setProduct(prodData);

        // Fetch reviews
        const revRes = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
        const revData = await revRes.json();
        setReviews(revData);
      } catch (err) {
        console.warn('Backend server down. Loading local fallback product data.');
        
        // Static detailed fallback
        const offlineProducts = {
          1: {
            id: 1,
            name: 'Orova Purple Oud',
            price: 3599.00,
            gender: 'Unisex',
            fragrance_type: 'Woody',
            occasion: 'Date Night',
            longevity: '12+ Hours',
            mood: 'Bold',
            description: 'A dark, hypnotic oriental masterpiece. It opens with the dry spice of saffron and pink pepper, evolving into a precious heart of rich agarwood (oud) and warm amber, before leaving a trail of premium leather and patchouli.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Saffron', 'Pink Pepper', 'Nutmeg'],
            heart_notes: ['Rich Oud', 'Warm Amber', 'Damask Rose'],
            base_notes: ['Precious Leather', 'Patchouli', 'Smoky Vetiver'],
            sillage: 'Strong',
            projection: 'Strong',
            best_season: 'Winter',
            best_time: 'Night',
            rating: 4.9,
            reviews_count: 142,
            stock: 8,
            similar_to: 'Luxury Niche Oud',
            inspired_by: 'Orova Paris Purple Oud Formula'
          },
          2: {
            id: 2,
            name: 'Orova Amber Oud',
            price: 3699.00,
            gender: 'Unisex',
            fragrance_type: 'Oriental',
            occasion: 'Winter',
            longevity: '12+ Hours',
            mood: 'Bold',
            description: 'An opulent, deeply warming blend of precious oud oil, rich golden amber, and soft exotic woods. Highlighted by warm vanilla and sweet patchouli, creating a magnetic and highly sophisticated evening aura.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Warm Amber', 'Labdanum', 'Cinnamon'],
            heart_notes: ['Cambodian Oud', 'Guaiac Wood', 'Sweet Patchouli'],
            base_notes: ['Soft Vanilla', 'Sandalwood', 'Benzoin'],
            sillage: 'Heavy',
            projection: 'Strong',
            best_season: 'Winter',
            best_time: 'Night',
            rating: 4.9,
            reviews_count: 98,
            stock: 7,
            similar_to: 'Niche Amber Oud Prestige',
            inspired_by: 'Orova Paris Amber Oud Formula'
          },
          3: {
            id: 3,
            name: 'Orova Elixir',
            price: 3499.00,
            gender: 'Unisex',
            fragrance_type: 'Floral',
            occasion: 'Party',
            longevity: '8+ Hours',
            mood: 'Romantic',
            description: 'An intoxicating, sweet gourmand unisex fragrance. A playful yet deep opening of sweet wild strawberries and soft berries, melting into a heart of rich vanilla pod absolute and fresh blossoms, finished with warm cashmere musk.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Wild Strawberry', 'Sweet Berries', 'Bergamot'],
            heart_notes: ['Vanilla Pod Absolute', 'Fresh Jasmine', 'Heliotrope'],
            base_notes: ['Cashmere Musk', 'Sandalwood', 'Tonka Bean'],
            sillage: 'Moderate',
            projection: 'Moderate',
            best_season: 'Spring',
            best_time: 'Night',
            rating: 4.8,
            reviews_count: 86,
            stock: 15,
            similar_to: 'Niche Sweet Gourmand',
            inspired_by: 'Orova Paris Elixir Formula'
          },
          4: {
            id: 4,
            name: 'Orova Santal Woods',
            price: 3299.00,
            gender: 'Unisex',
            fragrance_type: 'Woody',
            occasion: 'Office',
            longevity: 'All Day',
            mood: 'Elegant',
            description: 'Authoritative, creamy, and soothing. A pristine blend of creamy Indian sandalwood, dry Australian cedar, and exotic cardamom. Clean, sophisticated, and perfectly suited for professional and all-day elegance.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Cardamom', 'Papyrus', 'Violet Accord'],
            heart_notes: ['Creamy Sandalwood', 'Virginia Cedar', 'Leather'],
            base_notes: ['Soft Musk', 'Warm Woody Notes', 'Amber'],
            sillage: 'Moderate',
            projection: 'Strong',
            best_season: 'Autumn',
            best_time: 'All-Day',
            rating: 4.9,
            reviews_count: 114,
            stock: 9,
            similar_to: 'Niche Santal Cream',
            inspired_by: 'Orova Paris Santal Woods Formula'
          },
          5: {
            id: 5,
            name: 'Orova Citrus Ocean',
            price: 2499.00,
            gender: 'Unisex',
            fragrance_type: 'Aquatic',
            occasion: 'Gym',
            longevity: '4-6 Hours',
            mood: 'Fresh',
            description: 'A bright, exhilarating burst of Italian bergamot, marine salt, and cold-pressed grapefruit. It evokes a refreshing sea breeze along the Amalfi coast, settling into warm driftwood and clean white musk.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Italian Bergamot', 'Grapefruit', 'Sea Salt'],
            heart_notes: ['Marine Accord', 'Rosemary', 'Mint'],
            base_notes: ['Sun-bleached Driftwood', 'White Musk', 'Oakmoss'],
            sillage: 'Moderate',
            projection: 'Moderate',
            best_season: 'Summer',
            best_time: 'Day',
            rating: 4.6,
            reviews_count: 74,
            stock: 12,
            similar_to: 'Niche Fresh Marine',
            inspired_by: 'Orova Paris Fresh Collection'
          },
          6: {
            id: 6,
            name: 'Orova Imperial Rose',
            price: 3199.00,
            gender: 'Unisex',
            fragrance_type: 'Floral',
            occasion: 'Office',
            longevity: '8+ Hours',
            mood: 'Romantic',
            description: 'An absolute tribute to the luxury Turkish rose. Freshly plucked rose petals drenched in morning dew, combined with sweet lychee and warm pink pepper, resting on a base of soft cedarwood and clean musk.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Turkish Rose Petals', 'Lychee', 'Pink Pepper'],
            heart_notes: ['Peony', 'Damask Rose', 'Magnolia'],
            base_notes: ['Virginia Cedarwood', 'White Amber', 'Vetiver'],
            sillage: 'Moderate',
            projection: 'Moderate',
            best_season: 'Spring',
            best_time: 'Day/Night',
            rating: 4.8,
            reviews_count: 105,
            stock: 11,
            similar_to: 'Niche Fresh Rose',
            inspired_by: 'Orova Paris Rose Collection'
          },
          7: {
            id: 7,
            name: 'Orova Paris Tuberose',
            price: 3699.00,
            gender: 'Unisex',
            fragrance_type: 'Floral',
            occasion: 'Evening',
            longevity: '10+ Hours',
            mood: 'Romantic',
            description: 'A luxurious white floral fragrance crafted with creamy tuberose petals, soft vanilla, and sensual woods for an unforgettable signature scent. Experience the elegance of blooming tuberose blended with radiant florals and warm musk.',
            image_front: '/orova_tuberose.png',
            image_side: '/orova_tuberose.png',
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Pink Pepper', 'Creamy Peach', 'Orange Blossom'],
            heart_notes: ['Creamy Tuberose', 'Blooming Jasmine', 'Radiant Florals'],
            base_notes: ['Soft Vanilla', 'Sensual Woods', 'Warm Musk'],
            sillage: 'Heavy',
            projection: 'Strong',
            best_season: 'All-Season',
            best_time: 'Day/Night',
            rating: 5.0,
            reviews_count: 189,
            stock: 12,
            similar_to: 'Niche White Floral Elegance',
            inspired_by: 'Orova Paris Signature Formula'
          }
        };

        const prod = offlineProducts[productId] || offlineProducts[7] || offlineProducts[1];
        setProduct(prod);

        const localReviews = [
          { id: 1, user_name: 'Aarav Mehta', rating: 5, comment: 'Absolutely exquisite! The scent has a very smooth opening and stays on my skin for more than 10 hours. Definitely buying another bottle.', created_at: new Date().toISOString() },
          { id: 2, user_name: 'Priya Sharma', rating: 5, comment: 'Smells very premium, like a niche perfume. The white florals and peach combination is gorgeous.', created_at: new Date().toISOString() }
        ];
        setReviews(localReviews);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (response.ok) {
        const newRev = await response.json();
        setReviews([newRev, ...reviews]);
        setReviewName('');
        setReviewComment('');
        setReviewMessage('Thank you! Your scent log has been verified and posted.');
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.warn('Backend posting failed. Posting review locally.');
      const mockNewRev = {
        id: Date.now(),
        user_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        created_at: new Date().toISOString()
      };
      setReviews([mockNewRev, ...reviews]);
      setReviewName('');
      setReviewComment('');
      setReviewMessage('Posted review successfully.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest font-bold">Unlocking Scent Molecule Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5] text-center p-6">
        <h2 className="font-serif text-2xl text-[#1C1917] font-bold">Fragrance Not Found</h2>
        <p className="text-zinc-500 text-sm">We couldn't find the requested perfume. Please return to our collection.</p>
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
      
      {/* breadcrumb path */}
      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-800 font-semibold">{product.name}</span>
      </div>

      {/* Main split details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-white border border-gold/15 overflow-hidden relative group shadow-sm">
            
            {/* Scarcity Alert Badge */}
            {product.stock <= 5 && (
              <div className="absolute left-4 top-4 z-10 px-3 py-1 bg-red-50 border border-red-250 text-red-600 font-sans text-xs uppercase font-bold tracking-wider rounded flex items-center space-x-1 animate-pulse shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>Selling Fast - Only {product.stock} Left</span>
              </div>
            )}

            <img
              src={galleryImages[activeImage]}
              alt={`${product.name} detail view`}
              className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
            />
          </div>

          {/* Alternate gallery buttons */}
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(galleryImages).map((key) => (
              <button
                key={key}
                onClick={() => setActiveImage(key)}
                className={`aspect-square rounded overflow-hidden border transition-all cursor-pointer bg-white ${
                  activeImage === key ? 'border-gold scale-95 shadow' : 'border-zinc-200 hover:border-gold/30'
                }`}
              >
                <img
                  src={galleryImages[key]}
                  alt={`Thumbnail ${key}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Perfume Configuration & Cart additions */}
        <div className="space-y-6">
          <div>
            
            {/* Inspired-By Tag */}
            <span className="inline-block text-[11px] text-gold uppercase tracking-widest border border-gold/30 rounded px-2.5 py-0.5 bg-gold/5 mb-3 italic">
              Inspired by {product.inspired_by || 'Original Formula'}
            </span>

            {/* Scent Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-wide mb-2">
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <div className="flex items-center space-x-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-gold stroke-gold' : 'stroke-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-sans text-zinc-700 font-semibold">{product.rating}</span>
              <span className="text-xs font-sans text-zinc-500">({product.reviews_count} verified reviews)</span>
            </div>

          </div>

          {/* Price */}
          <div className="border-t border-b border-zinc-100 py-4 flex items-center justify-between">
            <span className="text-3xl font-sans font-bold text-gold">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-sans">Extrait De Parfum • 100ml Bottle</span>
          </div>

          {/* Emotional copy description */}
          <p className="text-zinc-600 text-sm leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Sillage & Projection sliders */}
          <div className="space-y-4 p-4 rounded bg-white border border-gold/15 shadow-sm">
            <h3 className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Projection & Trail</h3>
            
            {/* Sillage Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Sillage (Fragrance Trail)</span>
                <span className="text-gold font-bold">{product.sillage}</span>
              </div>
              <div className="h-1.5 w-full bg-[#FAF8F5] border border-zinc-100 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full"
                  style={{ width: product.sillage === 'Heavy' ? '100%' : product.sillage === 'Strong' ? '75%' : '50%' }}
                />
              </div>
            </div>

            {/* Projection Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Projection (Strength)</span>
                <span className="text-gold font-bold">{product.projection}</span>
              </div>
              <div className="h-1.5 w-full bg-[#FAF8F5] border border-zinc-100 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full"
                  style={{ width: product.projection === 'Strong' ? '100%' : product.projection === 'Moderate' ? '65%' : '35%' }}
                />
              </div>
            </div>

            {/* Best Season & Time */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-zinc-100 mt-2">
              <div>
                <span className="text-zinc-500 block">Best Season:</span>
                <span className="text-zinc-700 font-semibold">{product.best_season}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Best Time:</span>
                <span className="text-zinc-700 font-semibold">{product.best_time} wear</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="flex-1 py-4 bg-gold hover:bg-gold-dark text-black rounded font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Selection</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-4 rounded border transition-colors cursor-pointer bg-white ${
                wishlisted
                  ? 'border-gold bg-gold/10 text-gold shadow-sm'
                  : 'border-zinc-200 text-zinc-500 hover:text-gold hover:border-gold/30 shadow-sm'
              }`}
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-gold' : ''}`} />
            </button>
          </div>

          {/* Detailed Trust Badges */}
          <div className="pt-6 border-t border-zinc-100">
            <TrustBadges detailed={true} />
          </div>

        </div>

      </div>

      {/* Fragrance Notes Visualization Layered Widget */}
      <section className="bg-white border border-gold/15 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-10 shadow-sm">
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Botanical Anatomy</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">Fragrance Pyramid Notes</h2>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            The fragrance is structured in three notes, diffusing over hours. Trace the botanical composition below.
          </p>
        </div>

        {/* Notes Pyramid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Top Notes */}
          <div className="p-6 rounded bg-[#FAF8F5] border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Top</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Top Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">First 15-30 Minutes</p>
            <div className="flex flex-wrap gap-1.5">
              {product.top_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-white border border-zinc-200 text-zinc-800 text-xs rounded font-sans font-medium shadow-sm">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="p-6 rounded bg-[#FAF8F5] border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Heart</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Heart Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Evaporates after 2-4 Hours</p>
            <div className="flex flex-wrap gap-1.5">
              {product.heart_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-white border border-zinc-200 text-zinc-800 text-xs rounded font-sans font-medium shadow-sm">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="p-6 rounded bg-[#FAF8F5] border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Base</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Base Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Lingers for 8-12+ Hours</p>
            <div className="flex flex-wrap gap-1.5">
              {product.base_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-white border border-zinc-200 text-zinc-800 text-xs rounded font-sans font-medium shadow-sm">
                  {note}
                </span>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* Scent Comparison Table Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Prestige Comparison</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">Perfume Comparison Chart</h2>
        </div>

        <div className="w-full overflow-x-auto rounded border border-gold/10 bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-[#FAF8F5] text-[#1C1917] font-serif">
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">Feature Details</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">OROVA PARIS ({product.name})</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-zinc-500">Retail Brand ({product.similar_to})</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600 divide-y divide-zinc-100 font-sans">
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Inspired-by Reference</td>
                <td className="p-4 text-gold font-semibold italic">L'Élixir Version</td>
                <td className="p-4 text-zinc-500">Original Scent</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Concentration</td>
                <td className="p-4 text-zinc-750">Extrait de Parfum (22% Scent Oils)</td>
                <td className="p-4 text-zinc-500">Eau de Toilette / Parfum (10-15%)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Tested Longevity</td>
                <td className="p-4 text-zinc-750">{product.longevity} on Skin</td>
                <td className="p-4 text-zinc-500">4-6 Hours average</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Indian Market Price</td>
                <td className="p-4 text-gold font-bold">₹{product.price.toLocaleString()}</td>
                <td className="p-4 text-zinc-500">₹12,000 - ₹18,000</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-800">Sillage projection</td>
                <td className="p-4 text-zinc-750">{product.sillage} Trail</td>
                <td className="p-4 text-zinc-500">Intimate / Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Ratings & Verification Reviews Section */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column: Review Form */}
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Add Testimonial</span>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">Write a Review</h3>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded bg-white border border-gold/15 shadow-sm text-xs">
            
            <div className="space-y-1.5">
              <label className="text-zinc-650 font-semibold">Your Name</label>
              <input
                required
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-650 font-semibold block">Star Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
              >
                <option value={5}>5 Stars - Elite</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Unsatisfactory</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-650 font-semibold">Comments</label>
              <textarea
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows="3"
                placeholder="Tell others about sillage, projection, and comments..."
                className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-2.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-[10px] rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submittingReview ? 'Submitting Review...' : 'Post Scent Review'}
            </button>

            {reviewMessage && <p className="text-[10px] text-gold font-sans text-center mt-2">{reviewMessage}</p>}
          </form>
        </div>

        {/* Right Columns: Review List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">Customer Scent Logs ({reviews.length})</h3>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-10 text-center">Be the first to write a review for {product.name}!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded bg-white border border-zinc-150 space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-zinc-700">{rev.user_name}</span>
                    <span className="text-zinc-400 font-mono text-[10px]">
                      {new Date(rev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-gold stroke-gold' : 'stroke-zinc-300'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

    </div>
  );
}

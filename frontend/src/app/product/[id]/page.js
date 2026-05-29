'use client';

import React, { useState, useEffect, use } from 'react';
import { useCart } from '../../../context/CartContext';
import { Heart, ShoppingBag, Star, ShieldCheck, Award, CreditCard, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
        const prodRes = await fetch(`http://localhost:5000/api/products/${productId}`);
        const prodData = await prodRes.json();
        setProduct(prodData);

        // Fetch reviews
        const revRes = await fetch(`http://localhost:5000/api/products/${productId}/reviews`);
        const revData = await revRes.json();
        setReviews(revData);
      } catch (err) {
        console.warn('Backend server down. Loading local fallback product data.');
        
        // Static detailed fallback
        const offlineProducts = {
          1: {
            id: 1,
            name: 'Oud Midnight',
            price: 3499.00,
            gender: 'Unisex',
            fragrance_type: 'Woody',
            occasion: 'Date Night',
            longevity: '8+ Hours',
            mood: 'Bold',
            description: 'A rich, hypnotic blend of dark agarwood (oud) and sweet damask rose. Crafted for evening confidence, this fragrance opens with warm saffron, evolving into a heart of sensual rose before settling into a deep, smoky amber and vetiver base.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Saffron', 'Nutmeg', 'Cardamom'],
            heart_notes: ['Damask Rose', 'Jasmine Sambac'],
            base_notes: ['Oud (Agarwood)', 'Ambergris', 'Patchouli', 'Smoky Vetiver'],
            sillage: 'Heavy',
            projection: 'Strong',
            best_season: 'Winter',
            best_time: 'Night',
            rating: 4.9,
            reviews_count: 142,
            stock: 8,
            similar_to: 'Tom Ford Oud Wood',
            inspired_by: 'Oud Wood'
          },
          2: {
            id: 2,
            name: 'Citrus Breeze',
            price: 2199.00,
            gender: 'Men',
            fragrance_type: 'Citrus',
            occasion: 'Gym',
            longevity: '4-6 Hours',
            mood: 'Fresh',
            description: 'An explosive burst of crisp Mediterranean lemon and bitter bergamot, layered with aromatic marine salts and rosemary. Perfect for a refreshing gym workout or a hot summer day outdoors.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Calabrian Lemon', 'Bergamot', 'Grapefruit'],
            heart_notes: ['Sea Salt', 'Rosemary', 'Lavender'],
            base_notes: ['Oakmoss', 'White Musk', 'Cedarwood'],
            sillage: 'Moderate',
            projection: 'Moderate',
            best_season: 'Summer',
            best_time: 'Day',
            rating: 4.7,
            reviews_count: 98,
            stock: 15,
            similar_to: 'Dior Sauvage',
            inspired_by: 'Dior Sauvage'
          },
          3: {
            id: 3,
            name: 'Velvet Bloom',
            price: 2899.00,
            gender: 'Women',
            fragrance_type: 'Floral',
            occasion: 'Party',
            longevity: '8+ Hours',
            mood: 'Romantic',
            description: 'A luxurious, ultra-feminine bouquet of white tuberose, blooming jasmine, and velvet roses, softened by cream-infused vanilla and cashmeran wood. Designed to turn heads at celebrations and evening galas.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Pink Pepper', 'Pear', 'Peach'],
            heart_notes: ['Tuberose', 'Jasmine Sambac', 'Red Rose'],
            base_notes: ['Vanilla Pod Absolute', 'Patchouli', 'Cashmere Wood'],
            sillage: 'Strong',
            projection: 'Strong',
            best_season: 'Spring',
            best_time: 'Night',
            rating: 4.8,
            reviews_count: 86,
            stock: 7,
            similar_to: 'Armani My Way',
            inspired_by: 'My Way'
          },
          4: {
            id: 4,
            name: 'Sandalwood Monarch',
            price: 3299.00,
            gender: 'Men',
            fragrance_type: 'Woody',
            occasion: 'Office',
            longevity: 'All Day',
            mood: 'Elegant',
            description: 'Sophisticated and authoritative. A warm, creamy Indian sandalwood core, sharpened by dry cedar and spiced cardamom. The ideal companion for high-profile business meetings and daily office prestige.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Cardamom', 'Violet Accord'],
            heart_notes: ['Papyrus', 'Iris Concrete'],
            base_notes: ['Mysore Sandalwood', 'Virginia Cedarwood', 'Ambergris'],
            sillage: 'Moderate',
            projection: 'Strong',
            best_season: 'Autumn',
            best_time: 'All-Day',
            rating: 4.9,
            reviews_count: 114,
            stock: 9,
            similar_to: 'Santal 33',
            inspired_by: 'Le Labo Santal 33'
          },
          5: {
            id: 5,
            name: 'Blue Vague',
            price: 2499.00,
            gender: 'Unisex',
            fragrance_type: 'Aquatic',
            occasion: 'Summer',
            longevity: '4-6 Hours',
            mood: 'Fresh',
            description: 'An endless summer in a bottle. Shimmering marine accords, ozone, and wet stones meet the warmth of sun-bleached driftwood, vetiver, and crisp pine needles. Clean, breezy, and refreshing.',
            image_front: defaultFront,
            image_side: defaultSide,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Marine Accord', 'Ozone', 'Grapefruit'],
            heart_notes: ['Seaweed', 'Eucalyptus', 'Sage'],
            base_notes: ['Driftwood', 'Ambrette Seeds', 'Vetiver'],
            sillage: 'Moderate',
            projection: 'Moderate',
            best_season: 'Summer',
            best_time: 'Day',
            rating: 4.6,
            reviews_count: 74,
            stock: 12,
            similar_to: 'Jo Malone Wood Sage & Sea Salt',
            inspired_by: 'Wood Sage & Sea Salt'
          },
          6: {
            id: 6,
            name: 'Nuit Noir',
            price: 3599.00,
            gender: 'Women',
            fragrance_type: 'Oriental',
            occasion: 'Date Night',
            longevity: 'All Day',
            mood: 'Bold',
            description: 'Seductive, mysterious, and intoxicating. Rich, dark roasted coffee beans combined with sweet vanilla pod absolute, orange blossom, and a base of smooth white musk. A true masterpiece for intimate night-outs.',
            image_front: defaultSide,
            image_side: defaultFront,
            image_lifestyle: defaultLife,
            image_spray: defaultSpray,
            image_box: defaultBox,
            top_notes: ['Pear', 'Orange Blossom'],
            heart_notes: ['Coffee Beans', 'Bitter Almond', 'Licorice'],
            base_notes: ['Vanilla', 'Patchouli', 'Cedarwood', 'Cashmere'],
            sillage: 'Strong',
            projection: 'Strong',
            best_season: 'Winter',
            best_time: 'Night',
            rating: 4.9,
            reviews_count: 156,
            stock: 5,
            similar_to: 'YSL Black Opium',
            inspired_by: 'Black Opium'
          }
        };

        const prod = offlineProducts[productId] || offlineProducts[1];
        setProduct(prod);

        const localReviews = [
          { id: 1, user_name: 'Aarav Mehta', rating: 5, comment: 'Absolutely exquisite! The oud has a very smooth opening and stays on my skin for more than 10 hours. Definitely buying another bottle.', created_at: new Date().toISOString() },
          { id: 2, user_name: 'Priya Sharma', rating: 5, comment: 'Smells very premium, like a niche perfume. The rose and saffron combination is gorgeous.', created_at: new Date().toISOString() }
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
      const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewName('');
      setReviewComment('');
      setReviewMessage('Your review has been successfully posted. Thank you!');
    } catch (err) {
      console.warn('Failed to submit review to backend. Storing in-memory.');
      // Local fallback addition
      const mockRev = {
        id: Date.now(),
        user_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        created_at: new Date().toISOString()
      };
      setReviews([mockRev, ...reviews]);
      
      // Update local rating statistics
      setProduct(prev => ({
        ...prev,
        reviews_count: prev.reviews_count + 1,
        rating: parseFloat(((prev.rating * prev.reviews_count + reviewRating) / (prev.reviews_count + 1)).toFixed(1))
      }));

      setReviewName('');
      setReviewComment('');
      setReviewMessage('Your review was saved locally.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest">Extracting Scent Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-4 p-6">
        <h3 className="font-serif text-2xl text-zinc-300">Scent Profile Displaced</h3>
        <p className="text-zinc-500 text-sm">We couldn\'t find the requested perfume. Please return to our collection.</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* breadcrumb path */}
      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-300 font-semibold">{product.name}</span>
      </div>

      {/* Main split details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-zinc-950 border border-zinc-900 overflow-hidden relative group">
            
            {/* Scarcity Alert Badge */}
            {product.stock <= 5 && (
              <div className="absolute left-4 top-4 z-10 px-3 py-1 bg-red-950/80 border border-red-900 text-red-400 font-sans text-xs uppercase font-bold tracking-wider rounded flex items-center space-x-1 animate-pulse">
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
                className={`aspect-square rounded overflow-hidden border transition-all cursor-pointer ${
                  activeImage === key ? 'border-gold scale-95' : 'border-zinc-900 hover:border-zinc-800'
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
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-wide mb-2">
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <div className="flex items-center space-x-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-gold stroke-gold' : 'stroke-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-sans text-zinc-300 font-semibold">{product.rating}</span>
              <span className="text-xs font-sans text-zinc-500">({product.reviews_count} verified reviews)</span>
            </div>

          </div>

          {/* Price */}
          <div className="border-t border-b border-zinc-900 py-4 flex items-center justify-between">
            <span className="text-3xl font-sans font-bold text-gold">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-sans">Extrait De Parfum • 100ml Bottle</span>
          </div>

          {/* Emotional copy description */}
          <p className="text-zinc-400 text-sm leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Sillage & Projection sliders */}
          <div className="space-y-4 p-4 rounded bg-zinc-950/40 border border-zinc-900">
            <h3 className="font-serif text-xs uppercase tracking-widest text-zinc-300 font-bold">Projection & Trail</h3>
            
            {/* Sillage Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Sillage (Fragrance Trail)</span>
                <span className="text-gold font-bold">{product.sillage}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
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
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full"
                  style={{ width: product.projection === 'Strong' ? '100%' : product.projection === 'Moderate' ? '65%' : '35%' }}
                />
              </div>
            </div>

            {/* Best Season & Time */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-zinc-900/60 mt-2">
              <div>
                <span className="text-zinc-500 block">Best Season:</span>
                <span className="text-zinc-300 font-semibold">{product.best_season}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Best Time:</span>
                <span className="text-zinc-300 font-semibold">{product.best_time} wear</span>
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
              className={`p-4 rounded border transition-colors cursor-pointer ${
                wishlisted
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-gold hover:border-zinc-700'
              }`}
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-gold' : ''}`} />
            </button>
          </div>

          {/* India checkout badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-500">
            <div className="flex flex-col items-center">
              <CreditCard className="w-5 h-5 text-gold mb-1" />
              <span>Cash On Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-gold mb-1" />
              <span>100% Original</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-5 h-5 text-gold mb-1" />
              <span>IFRA Compliant</span>
            </div>
          </div>

        </div>

      </div>

      {/* Fragrance Notes Visualization Layered Widget */}
      <section className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-10">
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Botanical Anatomy</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-200">Fragrance Pyramid Notes</h2>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            The fragrance is structured in three notes, diffusing over hours. Trace the botanical composition below.
          </p>
        </div>

        {/* Notes Pyramid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Top Notes */}
          <div className="p-6 rounded bg-zinc-950/80 border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Top</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Top Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">First 15-30 Minutes</p>
            <div className="flex flex-wrap gap-1.5">
              {product.top_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded font-sans font-medium">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="p-6 rounded bg-zinc-950/80 border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Heart</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Heart Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Evaporates after 2-4 Hours</p>
            <div className="flex flex-wrap gap-1.5">
              {product.heart_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded font-sans font-medium">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="p-6 rounded bg-zinc-950/80 border border-gold/15 relative overflow-hidden group hover:border-gold/45 transition-colors">
            <div className="absolute top-0 right-0 p-3 bg-gold/10 border-l border-b border-gold/10 text-[9px] uppercase tracking-wider text-gold font-bold">Base</div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-1.5">Base Notes</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Lingers for 8-12+ Hours</p>
            <div className="flex flex-wrap gap-1.5">
              {product.base_notes.map((note) => (
                <span key={note} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded font-sans font-medium">
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-200 mt-1">Perfume Comparison Chart</h2>
        </div>

        <div className="w-full overflow-x-auto rounded border border-zinc-900 bg-zinc-950/40">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-300 font-serif">
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">Feature Details</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-gold">AURA LUXE ({product.name})</th>
                <th className="p-4 uppercase tracking-widest font-bold text-[10px] text-zinc-500">Retail Brand ({product.similar_to})</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400 divide-y divide-zinc-900/60 font-sans">
              <tr>
                <td className="p-4 font-semibold text-zinc-300">Inspired-by Reference</td>
                <td className="p-4 text-gold font-semibold italic">L\'Élixir Version</td>
                <td className="p-4 text-zinc-500">Original Scent</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-300">Concentration</td>
                <td className="p-4 text-zinc-200">Extrait de Parfum (22% Scent Oils)</td>
                <td className="p-4 text-zinc-500">Eau de Toilette / Parfum (10-15%)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-300">Tested Longevity</td>
                <td className="p-4 text-zinc-200">{product.longevity} on Skin</td>
                <td className="p-4 text-zinc-500">4-6 Hours average</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-300">Indian Market Price</td>
                <td className="p-4 text-gold font-bold">₹{product.price.toLocaleString()}</td>
                <td className="p-4 text-zinc-500">₹12,000 - ₹18,000</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-300">Sillage projection</td>
                <td className="p-4 text-zinc-200">{product.sillage} Trail</td>
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
            <h3 className="font-serif text-xl font-bold text-zinc-200">Write a Review</h3>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded bg-zinc-950/40 border border-zinc-900 text-xs">
            
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold">Your Name</label>
              <input
                required
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-gold p-2.5 rounded text-zinc-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold block">Star Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-gold p-2.5 rounded text-zinc-200 focus:outline-none"
              >
                <option value={5}>5 Stars - Elite</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Unsatisfactory</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold">Comments</label>
              <textarea
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows="3"
                placeholder="Tell others about sillage, projection, and comments..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-gold p-2.5 rounded text-zinc-200 focus:outline-none resize-none"
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
            <h3 className="font-serif text-xl font-bold text-zinc-200">Customer Scent Logs ({reviews.length})</h3>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-10 text-center">Be the first to write a review for {product.name}!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded bg-zinc-950/40 border border-zinc-900 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-zinc-300">{rev.user_name}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">
                      {new Date(rev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-gold stroke-gold' : 'stroke-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

    </div>
  );
}

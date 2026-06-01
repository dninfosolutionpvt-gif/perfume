'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  // Fallback images in case local assets are not present
  const defaultFront = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600';
  const defaultSide = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600';

  const imageFront = product.image_front.startsWith('/') && !product.image_front.includes('/images/')
    ? product.image_front 
    : (product.id === 2 || product.id === 4 || product.id === 6 ? defaultSide : defaultFront);
    
  const imageSide = product.image_side.startsWith('/') && !product.image_side.includes('/images/')
    ? product.image_side 
    : (product.id === 2 || product.id === 4 || product.id === 6 ? defaultFront : defaultSide);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white border border-gold-transition rounded-md overflow-hidden shadow-sm"
    >
      
      {/* Wishlist Button Overlay */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute right-3 top-3 z-10 p-2 rounded-full glass border border-gold/15 hover:border-gold/30 hover:bg-gold/10 text-zinc-500 hover:text-gold transition-all duration-300 cursor-pointer"
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 transition-transform duration-300 active:scale-125 ${wishlisted ? 'text-gold fill-gold' : ''}`} />
      </button>

      {/* Scarcity / Low Stock Indicator */}
      {product.stock <= 8 && (
        <span className="absolute left-3 top-3 z-10 px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 font-sans text-[10px] uppercase font-bold tracking-wider rounded shadow-sm">
          Only {product.stock} Left
        </span>
      )}

      {/* Image Area with Double Image Hover Transition */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#FAF8F5] border-b border-zinc-100 cursor-pointer">
        
        {/* Front Image */}
        <img
          src={imageFront}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />

        {/* Side/Lifestyle Image (Revealed on hover) */}
        <img
          src={imageSide}
          alt={`${product.name} alternate view`}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Floating Quick Shop CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold border border-gold/40 px-3 py-1 rounded bg-white shadow-sm">
            Discover Scent
          </span>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Inspired By tag */}
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 italic">
            Inspired by {product.inspired_by || 'Original'}
          </p>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="cursor-pointer">
            <h3 className="font-serif font-bold text-base text-[#1C1917] group-hover:text-gold transition-colors duration-300 mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-gold stroke-gold' : 'stroke-zinc-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-sans text-zinc-700 font-semibold">{product.rating}</span>
            <span className="text-[10px] font-sans text-zinc-500">({product.reviews_count} reviews)</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-zinc-200 text-zinc-600 text-[9px] uppercase tracking-wider rounded">
              {product.gender}
            </span>
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-zinc-200 text-zinc-600 text-[9px] uppercase tracking-wider rounded">
              {product.longevity}
            </span>
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-zinc-200 text-zinc-600 text-[9px] uppercase tracking-wider rounded">
              {product.fragrance_type}
            </span>
          </div>

        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <span className="font-sans font-bold text-base text-gold">
            ₹{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gold hover:bg-gold-dark text-black rounded text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow hover:shadow-gold/10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
}

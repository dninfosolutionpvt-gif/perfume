'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useCart();

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-intense z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-gold/15 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-gold fill-gold" />
                <span className="font-serif text-lg tracking-wide uppercase text-gold-gradient font-bold">
                  My Scent Wishlist
                </span>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="text-zinc-400 hover:text-gold transition-colors duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <Heart className="w-16 h-16 text-zinc-600 stroke-[1]" />
                  <h3 className="font-serif text-xl text-zinc-300">Your Wishlist is Empty</h3>
                  <p className="text-zinc-500 text-sm max-w-xs">
                    Browse our luxury fragrances and tap the heart icon to save your favorites here.
                  </p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black font-semibold rounded transition-all duration-300 cursor-pointer uppercase tracking-wider text-xs font-sans mt-2"
                  >
                    Explore Perfumes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-3 rounded bg-zinc-950/40 border border-zinc-900"
                    >
                      <img
                        src={product.image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded bg-zinc-900 border border-zinc-800"
                      />
                      <div className="flex-1">
                        <h4 className="font-serif font-semibold text-sm text-zinc-200">{product.name}</h4>
                        <p className="text-xs text-zinc-500 italic mb-1">Inspired by {product.inspired_by || 'Original Formula'}</p>
                        <span className="text-sm font-semibold text-gold font-sans">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            toggleWishlist(product); // Remove from wishlist on move-to-cart
                          }}
                          className="p-2 rounded bg-gold hover:bg-gold-dark text-black transition-colors cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors border border-zinc-800 cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gold/15 bg-zinc-950/80">
              <button
                onClick={() => setWishlistOpen(false)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-gold border border-zinc-800 font-semibold uppercase tracking-wider text-xs font-sans rounded transition-all duration-300 cursor-pointer"
              >
                Close Wishlist
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

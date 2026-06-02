'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartLoading,
    checkoutUrl,
    goToCheckout,
  } = useCart();

  const freeShippingThreshold = 999;
  const shippingCharge = cartTotal >= freeShippingThreshold ? 0 : 99;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer */}
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
                <ShoppingBag className="w-5 h-5 text-gold" />
                <span className="font-serif text-lg tracking-wide uppercase text-gold-gradient font-bold">
                  Your Cart {cart.length > 0 && `(${cart.reduce((t,i)=>t+i.quantity,0)})`}
                </span>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-zinc-500 hover:text-gold transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Free Shipping Progress */}
              {cart.length > 0 && (
                <div className="mb-6 p-4 rounded bg-[#FAF8F5] border border-gold/10 shadow-sm">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center text-[#1C1917] font-semibold">
                      <Truck className="w-4 h-4 text-gold mr-1" />
                      {cartTotal >= freeShippingThreshold ? 'Free Shipping Unlocked!' : `Add ₹${freeShippingThreshold - cartTotal} more for Free Shipping`}
                    </span>
                    <span className="text-gold font-bold">{cartTotal >= freeShippingThreshold ? 'FREE' : `₹${cartTotal}/${freeShippingThreshold}`}</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}

              {/* Empty Cart */}
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <ShoppingBag className="w-16 h-16 text-zinc-400 stroke-[1]" />
                  <h3 className="font-serif text-xl text-zinc-700 font-bold">Cart is Empty</h3>
                  <p className="text-zinc-500 text-sm max-w-xs">Add products to your cart to checkout via Shopify.</p>
                  <button onClick={() => setCartOpen(false)} className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black font-semibold rounded transition-all cursor-pointer uppercase tracking-wider text-xs font-sans mt-2">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.lineId || item.id} className="flex items-center space-x-4 p-3 rounded bg-white border border-gold/10 shadow-sm">
                      <img
                        src={item.image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded bg-[#FAF8F5] border border-zinc-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#1C1917] truncate">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 mb-2">₹{item.price.toLocaleString()} each</p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white hover:bg-gold/5 flex items-center justify-center text-zinc-600 hover:text-gold border border-zinc-200 transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-[#1C1917] w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white hover:bg-gold/5 flex items-center justify-center text-zinc-600 hover:text-gold border border-zinc-200 transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-semibold text-gold font-sans">₹{(item.price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.id)} className="block mt-2 ml-auto text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gold/15 bg-white">
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping:</span>
                    <span className="font-mono font-bold">
                      {shippingCharge === 0 ? <span className="text-gold">FREE</span> : `₹${shippingCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#1C1917] font-bold text-lg pt-2 border-t border-zinc-100">
                    <span className="font-serif">Total:</span>
                    <span className="text-gold font-mono">₹{(cartTotal + shippingCharge).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={goToCheckout}
                  disabled={cartLoading || !checkoutUrl}
                  className="w-full py-3.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{cartLoading ? 'Loading...' : 'Checkout with Shopify'}</span>
                </button>
                <p className="text-[10px] text-zinc-400 text-center mt-2">Secure checkout powered by Shopify</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

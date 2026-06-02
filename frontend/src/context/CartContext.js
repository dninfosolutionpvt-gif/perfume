'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createCart,
  addToCart as shopifyAddToCart,
  removeFromCart as shopifyRemoveFromCart,
  updateCartLine,
  getCart,
} from '../lib/shopify';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Local cart state (mirrors Shopify cart)
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Shopify cart state
  const [shopifyCartId, setShopifyCartId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  // ─── Initialize from localStorage ────────────────────────────────
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('orova_paris_wishlist');
      const storedCartId = localStorage.getItem('orova_shopify_cart_id');
      const storedCheckoutUrl = localStorage.getItem('orova_shopify_checkout_url');
      const storedLocalCart = localStorage.getItem('orova_paris_cart');

      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedLocalCart) setCart(JSON.parse(storedLocalCart));

      if (storedCartId) {
        setShopifyCartId(storedCartId);
        if (storedCheckoutUrl) setCheckoutUrl(storedCheckoutUrl);
        // Sync cart from Shopify
        getCart(storedCartId)
          .then(shopifyCart => {
            if (shopifyCart) {
              setCheckoutUrl(shopifyCart.checkoutUrl);
              syncLocalCartFromShopify(shopifyCart);
            }
          })
          .catch(() => {
            // Cart expired or invalid — clear it
            localStorage.removeItem('orova_shopify_cart_id');
            localStorage.removeItem('orova_shopify_checkout_url');
          });
      }
    } catch (e) {
      console.error('Error loading from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync local cart state from Shopify cart response
  const syncLocalCartFromShopify = (shopifyCart) => {
    if (!shopifyCart?.lines?.edges) return;
    const lines = shopifyCart.lines.edges.map(e => ({
      id: e.node.merchandise?.product?.title || 'Unknown',
      lineId: e.node.id,
      variantId: e.node.merchandise?.id,
      name: e.node.merchandise?.product?.title || 'Unknown',
      price: parseFloat(e.node.merchandise?.price?.amount || 0),
      quantity: e.node.quantity,
      image_front: e.node.merchandise?.product?.images?.edges?.[0]?.node?.url || '',
    }));
    setCart(lines);
    // Save to localStorage as backup
    localStorage.setItem('orova_paris_cart', JSON.stringify(lines));
  };

  // ─── Save wishlist to localStorage ───────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('orova_paris_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, isLoaded]);

  // ─── Add to Cart ──────────────────────────────────────────────────
  const addToCart = useCallback(async (product, quantity = 1) => {
    setCartLoading(true);
    try {
      const variantId = product.variantId;

      if (variantId) {
        // Shopify cart flow
        if (shopifyCartId) {
          // Add to existing Shopify cart
          const updatedCart = await shopifyAddToCart(shopifyCartId, variantId, quantity);
          setCheckoutUrl(updatedCart.checkoutUrl);
          localStorage.setItem('orova_shopify_checkout_url', updatedCart.checkoutUrl);
          syncLocalCartFromShopify(updatedCart);
        } else {
          // Create new Shopify cart
          const newCart = await createCart([{ variantId, quantity }]);
          setShopifyCartId(newCart.id);
          setCheckoutUrl(newCart.checkoutUrl);
          localStorage.setItem('orova_shopify_cart_id', newCart.id);
          localStorage.setItem('orova_shopify_checkout_url', newCart.checkoutUrl);
          syncLocalCartFromShopify(newCart);
        }
      } else {
        // Fallback: local cart (no Shopify variantId available)
        setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          const updated = existing
            ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
            : [...prev, { ...product, quantity }];
          localStorage.setItem('orova_paris_cart', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Shopify cart error, using local fallback:', err);
      // Local fallback
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        const updated = existing
          ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...prev, { ...product, quantity }];
        localStorage.setItem('orova_paris_cart', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setCartLoading(false);
      setCartOpen(true);
    }
  }, [shopifyCartId]);

  // ─── Remove from Cart ─────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId) => {
    const item = cart.find(i => i.id === String(productId) || i.id === productId);
    if (item?.lineId && shopifyCartId) {
      try {
        const updatedCart = await shopifyRemoveFromCart(shopifyCartId, item.lineId);
        syncLocalCartFromShopify(updatedCart);
        return;
      } catch (err) {
        console.error('Shopify remove error:', err);
      }
    }
    // Local fallback
    setCart(prev => {
      const updated = prev.filter(i => i.id !== productId && i.id !== String(productId));
      localStorage.setItem('orova_paris_cart', JSON.stringify(updated));
      return updated;
    });
  }, [cart, shopifyCartId]);

  // ─── Update Quantity ──────────────────────────────────────────────
  const updateQuantity = useCallback(async (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(i => i.id === String(productId) || i.id === productId);
    if (item?.lineId && shopifyCartId) {
      try {
        const updatedCart = await updateCartLine(shopifyCartId, item.lineId, newQty);
        syncLocalCartFromShopify(updatedCart);
        return;
      } catch (err) {
        console.error('Shopify update error:', err);
      }
    }
    // Local fallback
    setCart(prev => {
      const updated = prev.map(i => (i.id === productId || i.id === String(productId)) ? { ...i, quantity: newQty } : i);
      localStorage.setItem('orova_paris_cart', JSON.stringify(updated));
      return updated;
    });
  }, [cart, shopifyCartId, removeFromCart]);

  // ─── Clear Cart ───────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCart([]);
    setShopifyCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem('orova_paris_cart');
    localStorage.removeItem('orova_shopify_cart_id');
    localStorage.removeItem('orova_shopify_checkout_url');
  }, []);

  // ─── Checkout ─────────────────────────────────────────────────────
  // Redirects to Shopify's hosted checkout page
  const goToCheckout = useCallback(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      console.warn('No checkout URL available');
    }
  }, [checkoutUrl]);

  // ─── Wishlist ─────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      return exists ? prev.filter(item => item.id !== product.id) : [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId || item.id === String(productId));

  // ─── Computed values ──────────────────────────────────────────────
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        wishlistOpen,
        setCartOpen,
        setWishlistOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        cartLoading,
        checkoutUrl,
        goToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

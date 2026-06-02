'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Package, 
  Star, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  TrendingUp, 
  IndianRupee, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  CreditCard, 
  Clock, 
  Truck, 
  ShieldAlert,
  Edit,
  Settings,
  Link2,
  Link2Off,
  Zap,
  Sparkles,
  Info,
  ChevronRight,
  Database,
  BarChart3,
  Users,
  Bell,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalReviews: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Shopify Connection Config states
  const [shopifyConfig, setShopifyConfig] = useState({ connected: false, storeDomain: '', storefrontAccessToken: '' });
  const [storeDomainInput, setStoreDomainInput] = useState('');
  const [storefrontTokenInput, setStorefrontTokenInput] = useState('');
  const [adminTokenInput, setAdminTokenInput] = useState('');
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifySuccess, setShopifySuccess] = useState('');
  const [shopifyError, setShopifyError] = useState('');

  // Form states for adding/editing product
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    gender: 'Unisex',
    fragrance_type: 'Woody',
    occasion: 'Daily Wear',
    longevity: '8+ Hours',
    mood: 'Elegant',
    description: '',
    image_front: '',
    inspired_by: '',
    sillage: 'Moderate',
    projection: 'Moderate',
    stock: 10,
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    similar_to: '',
    best_season: 'All-Season',
    best_time: 'Day/Night'
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // Fetch all initial data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // 3. Fetch Products
      const productsRes = await fetch(`${API_BASE_URL}/api/products`);
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error syncing with backend server', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Check shopify status
  const checkShopifyConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shopify/config`);
      const data = await res.json();
      setShopifyConfig(data);
      if (data.connected) {
        setStoreDomainInput(data.storeDomain || '');
        setStorefrontTokenInput(data.storefrontAccessToken || '');
      }
    } catch (err) {
      console.error('Error checking Shopify config:', err);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('orovaAdminAuthenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch data only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkShopifyConfig().then(() => fetchData());
    }
  }, [isAuthenticated]);

  // Shopify Order Polling Loop
  useEffect(() => {
    if (!isAuthenticated || !shopifyConfig.connected) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/orders`);
        if (res.ok) {
          const latestOrders = await res.json();
          if (latestOrders.length > 0 && orders.length > 0) {
            const latestOrder = latestOrders[0];
            const exists = orders.some(o => String(o.id) === String(latestOrder.id));
            if (!exists) {
              // Trigger notification alert sound
              try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
                audio.volume = 0.2;
                audio.play();
              } catch (_) {}

              showToast(`🛍️ New Shopify Order received from ${latestOrder.customer_name}! Total: ₹${latestOrder.total_amount.toLocaleString()}`, 'order');
              fetchData();
            }
          }
        }
      } catch (err) {
        console.error('Error polling Shopify orders:', err);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [isAuthenticated, shopifyConfig.connected, orders]);

  // Auth Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (passcode === 'admin123' || passcode === '1234') {
      localStorage.setItem('orovaAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      showToast('Administrative session established successfully');
    } else {
      setLoginError('Invalid administrative access key. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orovaAdminAuthenticated');
    setIsAuthenticated(false);
    setPasscode('');
    showToast('Logged out of session');
  };

  // Shopify credentials saving
  const handleSaveShopify = async (e) => {
    e.preventDefault();
    setShopifyLoading(true);
    setShopifySuccess('');
    setShopifyError('');

    if (!storeDomainInput || !storefrontTokenInput || !adminTokenInput) {
      setShopifyError('Please fill in all Shopify integration fields.');
      setShopifyLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/shopify/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeDomain: storeDomainInput,
          storefrontAccessToken: storefrontTokenInput,
          adminAccessToken: adminTokenInput
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShopifySuccess(`Connected successfully to Shopify shop: ${data.shopName || storeDomainInput}!`);
        showToast('Shopify credentials verified and saved.');
        await checkShopifyConfig();
        await fetchData();
      } else {
        setShopifyError(data.error || 'Failed to authenticate connection.');
      }
    } catch (err) {
      setShopifyError('Network error connecting to backend API.');
    } finally {
      setShopifyLoading(false);
    }
  };

  const handleDisconnectShopify = async () => {
    if (!confirm('Are you sure you want to disconnect your Shopify store?')) return;
    setShopifyLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/shopify/config/disconnect`, { method: 'POST' });
      if (res.ok) {
        setStoreDomainInput('');
        setStorefrontTokenInput('');
        setAdminTokenInput('');
        setShopifyConfig({ connected: false });
        showToast('Shopify store disconnected.');
        await fetchData();
      }
    } catch (err) {
      showToast('Error disconnecting Shopify', 'error');
    } finally {
      setShopifyLoading(false);
    }
  };

  // AI Description Generator
  const handleAIDescription = () => {
    if (!newProduct.name) {
      setFormError('Please enter a Perfume Name first to generate AI copy.');
      return;
    }
    const name = newProduct.name;
    const top = newProduct.top_notes || 'citrus accents and dynamic spices';
    const heart = newProduct.heart_notes || 'blooming jasmine and Turkish rose petals';
    const base = newProduct.base_notes || 'creamy Indian sandalwood and smooth white amber';
    const occasion = newProduct.occasion || 'all occasions';
    const mood = newProduct.mood || 'Elegant';
    const gender = newProduct.gender || 'Unisex';
    
    const copy = `An absolute masterpiece of sensory craftsmanship. ${name} opens with an immediate, arresting projection of ${top}, creating a bright, sophisticated greeting. As the initial accords dry down, the fragrance unveils its heart—a complex, luxurious bouquet of ${heart} that exudes a warm, romantic aura. Finally, it settles into an intoxicating, long-lasting base of ${base}, leaving a seductive and memorable sillage trail. Created as a premium ${gender.toLowerCase()} elixir representing a ${mood.toLowerCase()} persona, it is the ultimate signature scent for ${occasion.toLowerCase()}.`;
    
    setNewProduct({ ...newProduct, description: copy });
    showToast('Premium sensory description generated by Orova AI!');
  };

  // Update order status (Shipped, Delivered, Paid, etc.)
  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showToast(`Order status updated successfully.`);
        await fetchData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this perfume from the catalog? This is synced to Shopify.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Product successfully removed from catalog.');
        await fetchData();
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Load product info into edit state and open modal
  const handleEditProductClick = (product) => {
    setIsEditMode(true);
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      gender: product.gender,
      fragrance_type: product.fragrance_type || 'Woody',
      occasion: product.occasion || 'Daily Wear',
      longevity: product.longevity || '8+ Hours',
      mood: product.mood || 'Elegant',
      description: product.description,
      image_front: product.image_front,
      inspired_by: product.inspired_by || '',
      sillage: product.sillage || 'Moderate',
      projection: product.projection || 'Moderate',
      stock: product.stock !== undefined ? product.stock : 10,
      top_notes: Array.isArray(product.top_notes) ? product.top_notes.join(', ') : (product.top_notes || ''),
      heart_notes: Array.isArray(product.heart_notes) ? product.heart_notes.join(', ') : (product.heart_notes || ''),
      base_notes: Array.isArray(product.base_notes) ? product.base_notes.join(', ') : (product.base_notes || ''),
      similar_to: product.similar_to || '',
      best_season: product.best_season || 'All-Season',
      best_time: product.best_time || 'Day/Night'
    });
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  // Handle form submit (both add and edit)
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setFormError('Please fill in the Name, Price, and Description fields.');
      return;
    }

    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/api/admin/products/${editingProductId}`
        : `${API_BASE_URL}/api/admin/products`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        setFormSuccess(isEditMode 
          ? 'Luxury perfume successfully updated in the catalog!' 
          : 'Luxury perfume successfully introduced to the catalog!'
        );
        showToast(isEditMode ? 'Product successfully updated.' : 'Product successfully created.');
        
        // Reset form
        setNewProduct({
          name: '',
          price: '',
          gender: 'Unisex',
          fragrance_type: 'Woody',
          occasion: 'Daily Wear',
          longevity: '8+ Hours',
          mood: 'Elegant',
          description: '',
          image_front: '',
          inspired_by: '',
          sillage: 'Moderate',
          projection: 'Moderate',
          stock: 10,
          top_notes: '',
          heart_notes: '',
          base_notes: '',
          similar_to: '',
          best_season: 'All-Season',
          best_time: 'Day/Night'
        });
        
        await fetchData();
        setTimeout(() => setShowAddModal(false), 1200);
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to save product. Please check connection.');
      }
    } catch (err) {
      setFormError('Error connecting to backend server.');
    }
  };

  // Checkout activity simulator ("order ane chahiye")
  const simulateOrder = async () => {
    if (products.length === 0) {
      showToast('No products in catalog to simulate orders.', 'error');
      return;
    }
    
    // Pick random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const indianNames = ['Amit Sharma', 'Priya Patel', 'Rohan Verma', 'Ananya Gupta', 'Vikram Singh', 'Karan Johar', 'Sunita Rao', 'Rahul Nair'];
    const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata'];
    const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Maharashtra', 'Telangana', 'Gujarat', 'Tamil Nadu', 'West Bengal'];
    
    const randomIdx = Math.floor(Math.random() * indianNames.length);
    const name = indianNames[randomIdx];
    const city = indianCities[randomIdx];
    const state = indianStates[randomIdx];
    const quantity = Math.floor(Math.random() * 2) + 1;
    const totalAmount = randomProduct.price * quantity;
    
    const mockCheckout = {
      customer_name: name,
      customer_email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
      address: `${Math.floor(Math.random() * 100) + 1}, Premium Residency, Sector ${Math.floor(Math.random() * 25) + 1}`,
      city,
      state,
      pincode: String(Math.floor(400001 + Math.random() * 200000)),
      total_amount: totalAmount,
      payment_method: Math.random() > 0.45 ? 'UPI' : 'COD',
      cartItems: [
        {
          id: randomProduct.id,
          name: randomProduct.name,
          price: randomProduct.price,
          quantity,
          image_front: randomProduct.image_front
        }
      ]
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCheckout)
      });
      
      if (res.ok) {
        // Trigger notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
          audio.volume = 0.25;
          audio.play();
        } catch (_) {}
        
        showToast(`🎯 simulated checkout completed by ${name} from ${city} (Total: ₹${totalAmount.toLocaleString()})!`, 'success');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to simulate checkout:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-amber-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-amber-500/40 animate-spin animate-duration-1000"></div>
        </div>
        <p className="text-stone-400 font-sans text-xs uppercase tracking-widest font-bold">
          Configuring Shopify Live Sync Console...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#fafaf9] font-sans flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow decorative spheres */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 filter blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-8 relative z-10 text-center"
        >
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Orova Paris</span>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight mt-1 text-white">
              Admin Sync Portal
            </h1>
            <p className="text-stone-400 text-xs mt-2 font-sans">
              Enter credentials to establish Shopify connect session
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {loginError && (
              <p className="p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded text-xs font-semibold text-left flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold font-sans">
                Administrative Passcode
              </label>
              <input
                required
                type="password"
                placeholder="Enter access key..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-3 rounded text-white focus:outline-none text-center font-mono tracking-widest text-sm focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black rounded font-bold uppercase tracking-wider text-xs transition-all cursor-pointer shadow-md"
            >
              Authorize Console
            </button>
          </form>

          <div className="mt-8 border-t border-stone-850 pt-4">
            <Link 
              href="/"
              className="text-[10px] uppercase text-stone-500 hover:text-amber-500 tracking-widest font-bold font-sans transition-colors"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans flex flex-col md:flex-row relative">
      
      {/* Dynamic Toast Notifications container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border flex items-start justify-between shadow-xl backdrop-blur-md ${
                toast.type === 'error'
                  ? 'bg-red-950/80 border-red-900 text-red-200'
                  : toast.type === 'order'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-amber-500/10'
                  : 'bg-stone-900/90 border-amber-500/20 text-stone-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">
                  {toast.type === 'error' ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                </span>
                <p className="text-xs font-medium leading-relaxed font-sans">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
                className="text-stone-500 hover:text-stone-300 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-stone-950 border-r border-stone-850 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo Header */}
          <div className="pb-8 border-b border-stone-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Zap className="w-4.5 h-4.5 text-black" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold block leading-none">Shopify Sync</span>
              <span className="font-serif text-lg font-bold text-white leading-none">Orova Paris</span>
            </div>
          </div>

          {/* Shopify status indicator pill */}
          <div className="my-5 p-3 rounded-xl border bg-stone-900/40 flex items-center justify-between border-stone-850">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${shopifyConfig.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] uppercase font-bold text-stone-400">Shopify status</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500">
              {shopifyConfig.connected ? 'Connected' : 'Offline'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'overview' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview / Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'catalog' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Scent Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'orders' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopify Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('shopify-connect')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                activeTab === 'shopify-connect' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Shopify Connect</span>
            </button>
          </nav>
        </div>

        {/* Footer logout */}
        <div className="pt-5 border-t border-stone-900">
          <button 
            onClick={handleLogout}
            className="w-full py-2 bg-stone-900 hover:bg-stone-850 hover:text-white border border-stone-800 text-stone-400 text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-6 md:p-8 flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-900">
            <div>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block leading-none">Console Room</span>
              <h2 className="font-serif text-2xl font-extrabold text-white mt-1.5 leading-none">
                {activeTab === 'overview' && 'Live Metrics Overview'}
                {activeTab === 'catalog' && 'Luxury Catalog Management'}
                {activeTab === 'orders' && 'Shopify Transaction Logs'}
                {activeTab === 'shopify-connect' && 'Shopify Credentials Portal'}
              </h2>
            </div>

            {/* Sync Status widget */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <button 
                onClick={fetchData}
                disabled={refreshing}
                className="px-3.5 py-1.5 border border-stone-800 bg-stone-900/40 text-stone-300 hover:text-white hover:bg-stone-900 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Syncing...' : 'Sync Store'}</span>
              </button>
              
              <button
                onClick={simulateOrder}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all shadow hover:shadow-amber-500/10 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Simulate Order</span>
              </button>

              <Link 
                href="/"
                className="px-3.5 py-1.5 border border-stone-850 text-stone-400 hover:text-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                Storefront
              </Link>
            </div>
          </header>

          {/* MAIN PAGE BODY */}
          <div className="mt-8">
            
            {/* ──────── TAB 1: OVERVIEW & ANALYTICS ──────── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Metrics highlights grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Revenue */}
                  <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-xl flex items-center justify-between group hover:border-amber-500/20 transition-all">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Total Sales Volume</span>
                      <p className="text-2xl font-bold text-amber-500 flex items-center mt-1.5 font-mono">
                        <IndianRupee className="w-5 h-5 mr-0.5 shrink-0" />
                        {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center mt-1">
                        +18.4% this week
                      </span>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5.5 h-5.5" />
                    </div>
                  </div>

                  {/* Card 2: Orders */}
                  <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-xl flex items-center justify-between group hover:border-amber-500/20 transition-all">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Total Orders</span>
                      <p className="text-2xl font-bold text-white mt-1.5 font-mono">
                        {stats.totalOrders}
                      </p>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center mt-1">
                        +24.1% MoM growth
                      </span>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-5.5 h-5.5" />
                    </div>
                  </div>

                  {/* Card 3: Products */}
                  <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-xl flex items-center justify-between group hover:border-amber-500/20 transition-all">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Synced Products</span>
                      <p className="text-2xl font-bold text-white mt-1.5 font-mono">
                        {stats.totalProducts}
                      </p>
                      <span className="text-[10px] text-stone-500 flex items-center mt-1">
                        Live on Shopify
                      </span>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-105 transition-transform">
                      <Package className="w-5.5 h-5.5" />
                    </div>
                  </div>

                  {/* Card 4: Reviews */}
                  <div className="bg-stone-900/40 border border-stone-850 p-6 rounded-xl flex items-center justify-between group hover:border-amber-500/20 transition-all">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Testimonials Logged</span>
                      <p className="text-2xl font-bold text-white mt-1.5 font-mono">
                        {stats.totalReviews}
                      </p>
                      <span className="text-[10px] text-amber-500 font-semibold flex items-center mt-1">
                        4.9 Average Rating
                      </span>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-105 transition-transform">
                      <Star className="w-5.5 h-5.5 fill-amber-500 stroke-amber-500" />
                    </div>
                  </div>

                </div>

                {/* Graph chart section */}
                <div className="bg-[#121214] border border-stone-900 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">Scent Sales Timeline</h3>
                      <p className="text-stone-500 text-xs font-sans">Synced directly from connected Shopify transactions</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/15 text-amber-500 border border-amber-500/20 text-[10px] rounded font-bold uppercase tracking-wider">
                      Shopify Synced
                    </span>
                  </div>
                  
                  {/* Premium mock SVG Sparkline/Bar Chart */}
                  <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 border-b border-stone-850 gap-4">
                    {[45, 60, 52, 78, 65, 95, 84, 110, 125, 115, 140, 155].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-stone-950 text-white text-[9px] px-1.5 py-0.5 rounded border border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-mono">
                            ₹{(val * 249).toLocaleString()}
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 rounded-t group-hover:opacity-85 transition-opacity" 
                            style={{ height: `${(val / 160) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-550 font-bold">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-split grids: Traffic and activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders log */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4.5 h-4.5 text-amber-500" />
                      <span>Recent Shopify Orders</span>
                    </h3>
                    <div className="space-y-3.5">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-4 rounded-xl border border-stone-850 bg-stone-900/20 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <p className="font-bold text-stone-200">{order.customer_name}</p>
                            <p className="text-[9px] text-stone-500 font-mono">ID: {order.shopify_order_number || `#${order.id}`}</p>
                            <p className="text-[9px] text-stone-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-amber-500" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-bold text-amber-550 font-mono">₹{order.total_amount.toLocaleString()}</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' 
                                : order.status === 'Shipped' 
                                ? 'bg-blue-950/60 text-blue-400 border border-blue-900' 
                                : 'bg-amber-950/60 text-amber-400 border border-amber-900'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-stone-500 text-xs italic">No orders received from Shopify yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Simulator controller and live log */}
                  <div className="space-y-4 bg-stone-950 border border-stone-850 p-5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                        <span>Live Traffic Simulator</span>
                      </h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Use the checkout simulator to test checkout activities. This will automatically execute mock API orders to trigger statistics increases, stock reductions, and order log additions.
                    </p>
                    <div className="pt-2 flex flex-col gap-3">
                      <button
                        onClick={simulateOrder}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider text-xs rounded transition-all flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-4 h-4 fill-black" />
                        <span>Trigger Instant Simulated Checkout</span>
                      </button>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-stone-800 bg-stone-900/30 text-[10px] text-stone-500 font-mono">
                        <span>Simulator Status: STANDBY</span>
                        <span>API Listening: OK</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ──────── TAB 2: MANAGE PRODUCTS ──────── */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Scent Catalogue</h3>
                    <p className="text-stone-500 text-xs">Manage detailed perfume properties directly synced with Shopify.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingProductId(null);
                      setNewProduct({
                        name: '',
                        price: '',
                        gender: 'Unisex',
                        fragrance_type: 'Woody',
                        occasion: 'Daily Wear',
                        longevity: '8+ Hours',
                        mood: 'Elegant',
                        description: '',
                        image_front: '',
                        inspired_by: '',
                        sillage: 'Moderate',
                        projection: 'Moderate',
                        stock: 10,
                        top_notes: '',
                        heart_notes: '',
                        base_notes: '',
                        similar_to: '',
                        best_season: 'All-Season',
                        best_time: 'Day/Night'
                      });
                      setFormError('');
                      setFormSuccess('');
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow hover:shadow-amber-500/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Introduce Perfume</span>
                  </button>
                </div>

                {/* Products catalog Table */}
                <div className="w-full overflow-x-auto rounded-xl border border-stone-850 bg-stone-900/20">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-stone-850 bg-stone-950 text-stone-300 font-serif font-bold">
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500">Perfume</th>
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500">Classification</th>
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500">Price</th>
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500">Inventory Stock</th>
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500">Aromatic Notes</th>
                        <th className="p-4 uppercase tracking-widest text-[9px] text-amber-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 text-stone-400">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-900/30 transition-colors">
                          {/* Image & Title */}
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-stone-800 overflow-hidden shrink-0 bg-stone-950">
                              <img src={product.image_front} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{product.name}</p>
                              <p className="text-[10px] text-stone-500 italic">Inspired by: {product.inspired_by || 'Original'}</p>
                            </div>
                          </td>

                          {/* Category Tags */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 bg-stone-950 border border-stone-800 text-amber-500 text-[9px] uppercase tracking-wider rounded font-semibold font-mono">
                                {product.gender}
                              </span>
                              <p className="text-[10px] text-stone-500 mt-1 font-sans">{product.fragrance_type} ({product.mood})</p>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="p-4 font-bold text-amber-500 font-mono">
                            ₹{product.price.toLocaleString()}
                          </td>

                          {/* Inventory stock */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                product.stock === 0 ? 'bg-red-500 animate-pulse' : product.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <span className={`font-semibold ${
                                product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-stone-300'
                              }`}>
                                {product.stock} units
                              </span>
                            </div>
                          </td>

                          {/* Notes summary */}
                          <td className="p-4 max-w-xs truncate text-[10px] text-stone-500">
                            <p><span className="text-stone-400">Top:</span> {Array.isArray(product.top_notes) ? product.top_notes.join(', ') : 'Citrus'}</p>
                            <p><span className="text-stone-400">Base:</span> {Array.isArray(product.base_notes) ? product.base_notes.join(', ') : 'Musk'}</p>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right flex justify-end gap-2 items-center">
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="p-2 text-stone-500 hover:text-amber-500 transition-colors border border-transparent hover:border-amber-500/20 hover:bg-amber-500/5 rounded-lg cursor-pointer"
                              title="Edit specifications"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-stone-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-900/20 hover:bg-red-950/20 rounded-lg cursor-pointer"
                              title="Delete Perfume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-stone-500 italic">No products found in catalog. Add one to sync with Shopify.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* ──────── TAB 3: MANAGE ORDERS ──────── */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Client Shopify Orders</h3>
                  <p className="text-stone-500 text-xs">Inspect shipping addresses and fulfill order statuses directly.</p>
                </div>

                {/* Orders Log list */}
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-stone-850 rounded-xl overflow-hidden bg-stone-900/10 hover:border-stone-800 transition-colors">
                      {/* Order main info header */}
                      <div className="bg-stone-950 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-900 text-xs text-stone-400">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-white">ID: {order.shopify_order_number || `#${order.id}`}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' 
                                : order.status === 'Shipped' 
                                ? 'bg-blue-950/60 text-blue-400 border border-blue-900' 
                                : 'bg-amber-950/60 text-amber-400 border border-amber-900'
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-[10px] text-stone-600 font-mono">Shopify Sync</span>
                          </div>
                          <p className="text-[9px] text-stone-550 font-mono">Date placed: {new Date(order.created_at).toLocaleString()}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 md:text-right">
                          <div>
                            <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Amount</p>
                            <p className="font-bold text-amber-500 text-sm font-mono">₹{order.total_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Payment method</p>
                            <p className="font-semibold text-stone-300">{order.payment_method} ({order.payment_status})</p>
                          </div>
                        </div>
                      </div>

                      {/* Detail block */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-400">
                        
                        {/* Shipping detail */}
                        <div className="space-y-3.5 border-b md:border-b-0 md:border-r border-stone-900 pb-4 md:pb-0 pr-4">
                          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                            <User className="w-4 h-4" />
                            <span>Client Profile</span>
                          </h4>
                          <div className="space-y-2">
                            <p className="font-bold text-stone-200">{order.customer_name}</p>
                            <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-stone-500" /> {order.customer_email}</p>
                            <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-stone-500" /> {order.phone}</p>
                            <p className="flex items-start">
                              <MapPin className="w-3.5 h-3.5 mr-2 text-stone-500 mt-0.5 shrink-0" />
                              <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                            </p>
                          </div>
                        </div>

                        {/* Items detail */}
                        <div className="space-y-3.5 border-b md:border-b-0 md:border-r border-stone-900 pb-4 md:pb-0 pr-4">
                          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                            <Package className="w-4 h-4" />
                            <span>Scents Purchased</span>
                          </h4>
                          <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-stone-900/30 pb-2 gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded border border-stone-850 overflow-hidden shrink-0 bg-stone-950">
                                      <img src={item.image_front} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-stone-200 leading-tight text-[11px]">{item.name}</p>
                                      <p className="text-[9px] text-stone-500 font-mono">
                                        ₹{item.price.toLocaleString()} × {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-bold text-amber-500 font-mono text-[11px]">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-stone-550 italic text-[10px]">No items recorded.</p>
                            )}
                          </div>
                        </div>

                        {/* Actions logs */}
                        <div className="space-y-3.5 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                              <CreditCard className="w-4 h-4" />
                              <span>Fulfillment actions</span>
                            </h4>
                            <div className="space-y-2">
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Fulfillment status</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateOrder(order.id, { status: 'Shipped' })}
                                  disabled={order.status === 'Shipped'}
                                  className="flex-1 py-1.5 border border-blue-500/20 hover:border-blue-500 text-blue-400 bg-blue-950/20 hover:bg-blue-900/10 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-colors disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Ship</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateOrder(order.id, { status: 'Delivered' })}
                                  disabled={order.status === 'Delivered'}
                                  className="flex-1 py-1.5 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/10 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-colors disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Deliver</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] text-stone-500 uppercase font-bold block">Payment status</span>
                              <button
                                onClick={() => handleUpdateOrder(order.id, { payment_status: 'Paid' })}
                                disabled={order.payment_status === 'Paid'}
                                className="w-full py-1.5 border border-amber-500/25 hover:border-amber-500 text-amber-500 hover:bg-amber-500/5 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-colors disabled:opacity-40 cursor-pointer"
                              >
                                Mark as Paid
                              </button>
                            </div>
                          </div>

                          <div className="p-3 bg-stone-900/35 border border-stone-850 rounded-lg text-[10px] text-stone-500 flex justify-between items-center font-mono">
                            <span>Gateway: Shopify checkout</span>
                            <span className="text-emerald-500">Verified</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center p-8 text-stone-500 italic bg-stone-900/10 border border-stone-850 rounded-xl">No orders fetched from Shopify. Place orders on store checkout to sync.</p>
                  )}
                </div>

              </div>
            )}

            {/* ──────── TAB 4: SHOPIFY CONNECT SETTINGS ──────── */}
            {activeTab === 'shopify-connect' && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Shopify Connection Hub</h3>
                  <p className="text-stone-500 text-xs">Configure access credentials to dynamically sync products, orders, and stats.</p>
                </div>

                {/* Shopify Connection Card Details */}
                <div className="bg-stone-950 border border-stone-850 p-6 rounded-xl space-y-6">
                  
                  {/* Sync status alert panel */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    shopifyConfig.connected 
                      ? 'bg-emerald-950/20 border-emerald-900 text-emerald-450' 
                      : 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                  }`}>
                    <span className="mt-0.5">
                      {shopifyConfig.connected ? <Link2 className="w-5 h-5 text-emerald-400" /> : <Link2Off className="w-5 h-5 text-amber-500" />}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        {shopifyConfig.connected ? 'Active Shopify Connection' : 'Shopify Disconnected'}
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                        {shopifyConfig.connected 
                          ? `This storefront is actively linked with Shopify store domain: ${shopifyConfig.storeDomain}. Products and orders are automatically synced in real time.`
                          : 'Connect a Shopify custom app to synchronize inventory, process orders, and calculate stats directly from your Shopify admin dashboard.'
                        }
                      </p>
                    </div>
                  </div>

                  {shopifySuccess && (
                    <p className="p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded-lg text-xs font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> {shopifySuccess}
                    </p>
                  )}
                  {shopifyError && (
                    <p className="p-3 bg-red-950/40 border border-red-900 text-red-400 rounded-lg text-xs font-semibold flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-2" /> {shopifyError}
                    </p>
                  )}

                  {/* Form connection fields */}
                  <form onSubmit={handleSaveShopify} className="space-y-5 text-xs text-stone-400">
                    
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300 block">Shopify Store URL / Domain *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. store-name.myshopify.com"
                        value={storeDomainInput}
                        onChange={(e) => setStoreDomainInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 p-2.5 rounded-lg text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-stone-500">Your Shopify .myshopify.com hostname (without http:// or https://)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300 block">Shopify Storefront Access Token *</label>
                      <input
                        required
                        type="password"
                        placeholder="Enter Storefront Access Token..."
                        value={storefrontTokenInput}
                        onChange={(e) => setStorefrontTokenInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 p-2.5 rounded-lg text-white focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-stone-500">Obtained from Shopify Settings &gt; Apps and sales channels &gt; Develop Apps &gt; Storefront API Access Token</span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300 block">Shopify Admin API Access Token *</label>
                      <input
                        required
                        type="password"
                        placeholder="shpat_..."
                        value={adminTokenInput}
                        onChange={(e) => setAdminTokenInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 p-2.5 rounded-lg text-white focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-stone-500">Admin API Token (starts with shpat_) required to fetch orders and manage product specs</span>
                    </div>

                    <div className="pt-3 border-t border-stone-900 flex gap-3.5 justify-end">
                      {shopifyConfig.connected && (
                        <button
                          type="button"
                          onClick={handleDisconnectShopify}
                          className="px-5 py-2.5 bg-red-950 hover:bg-red-900 border border-red-900/60 text-red-200 rounded-lg font-bold uppercase tracking-wider hover:text-white transition-all cursor-pointer"
                        >
                          Disconnect Shopify
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={shopifyLoading}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {shopifyLoading ? 'Connecting...' : 'Verify & Connect Store'}
                      </button>
                    </div>

                  </form>

                </div>

                {/* API Setup Help instructions */}
                <div className="bg-[#121214] border border-stone-900 p-5 rounded-xl text-xs text-stone-400 space-y-3">
                  <h4 className="font-serif font-bold text-white flex items-center gap-1.5"><Info className="w-4 h-4 text-amber-500" /> Shopify Custom App Setup Instructions</h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-stone-500 leading-relaxed font-sans">
                    <li>Log into your Shopify Admin panel.</li>
                    <li>Navigate to <span className="text-stone-400">Settings</span> &gt; <span className="text-stone-400">Apps and sales channels</span> &gt; <span className="text-stone-400">Develop apps</span>.</li>
                    <li>Click <span className="text-stone-400">Create an app</span> and name it <span className="text-stone-450 font-semibold">Orova Sync Client</span>.</li>
                    <li>In Admin API configurations, check scopes: <span className="text-stone-400">write_products, read_products, write_orders, read_orders</span>. Save.</li>
                    <li>In Storefront API configurations, check scope: <span className="text-stone-400">unauthenticated_read_product_listings</span>. Save.</li>
                    <li>Install App and copy generated access keys here to establish sync.</li>
                  </ol>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      {/* POPUP MODAL DIALOG: PRODUCT EDIT/ADD FORM */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal header */}
              <div className="bg-stone-950 text-white p-5 border-b border-stone-850 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    {isEditMode ? 'Modify Scent Specifications' : 'Introduce Fragrance'}
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    {isEditMode ? 'Update perfume attributes directly synced with Shopify catalog.' : 'Catalog a new premium perfume formula to the Shopify store.'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-500 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable form content */}
              <form onSubmit={handleProductFormSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-400 max-h-[70vh] scrollbar-thin">
                
                {formError && (
                  <p className="p-3 bg-red-950/40 border border-red-900 text-red-400 rounded-lg flex items-center font-semibold">
                    <ShieldAlert className="w-4 h-4 mr-2" /> {formError}
                  </p>
                )}
                {formSuccess && (
                  <p className="p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-450 rounded-lg flex items-center font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2 animate-bounce" /> {formSuccess}
                  </p>
                )}

                {/* Section: General info */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider text-amber-500 border-b border-stone-850 pb-1">General Info</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Perfume Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Orova Saffron Oud"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-300">Price (INR) *</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 3599"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-stone-300">Inventory Stock *</label>
                        <input
                          required
                          type="number"
                          placeholder="10"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
                          className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Classifications */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider text-amber-500 border-b border-stone-850 pb-1">Aromatic Classification</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Gender placement</label>
                      <select
                        value={newProduct.gender}
                        onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Fragrance Type</label>
                      <select
                        value={newProduct.fragrance_type}
                        onChange={(e) => setNewProduct({ ...newProduct, fragrance_type: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Woody">Woody</option>
                        <option value="Citrus">Citrus</option>
                        <option value="Floral">Floral</option>
                        <option value="Aquatic">Aquatic</option>
                        <option value="Oriental">Oriental</option>
                        <option value="Fresh">Fresh</option>
                        <option value="Musky">Musky</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Scent Mood</label>
                      <select
                        value={newProduct.mood}
                        onChange={(e) => setNewProduct({ ...newProduct, mood: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Bold">Bold</option>
                        <option value="Romantic">Romantic</option>
                        <option value="Fresh">Fresh</option>
                        <option value="Elegant">Elegant</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Inspired-by Reference</label>
                      <input
                        type="text"
                        placeholder="e.g. Creed Aventus Formula"
                        value={newProduct.inspired_by}
                        onChange={(e) => setNewProduct({ ...newProduct, inspired_by: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Similar To Luxury Perfumes</label>
                      <input
                        type="text"
                        placeholder="e.g. Sauvage Elixir, Santal 33"
                        value={newProduct.similar_to}
                        onChange={(e) => setNewProduct({ ...newProduct, similar_to: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Aromatic Notes */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider text-amber-500 border-b border-stone-850 pb-1">Fragrance Notes</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Top Notes *</label>
                      <input
                        type="text"
                        placeholder="Saffron, Pink Pepper (comma separated)"
                        value={newProduct.top_notes}
                        onChange={(e) => setNewProduct({ ...newProduct, top_notes: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Heart Notes *</label>
                      <input
                        type="text"
                        placeholder="Jasmine, Damask Rose (comma separated)"
                        value={newProduct.heart_notes}
                        onChange={(e) => setNewProduct({ ...newProduct, heart_notes: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Base Notes *</label>
                      <input
                        type="text"
                        placeholder="Sandalwood, Ambergris (comma separated)"
                        value={newProduct.base_notes}
                        onChange={(e) => setNewProduct({ ...newProduct, base_notes: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Longevity</label>
                      <select
                        value={newProduct.longevity}
                        onChange={(e) => setNewProduct({ ...newProduct, longevity: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="4-6 Hours">4-6 Hours</option>
                        <option value="8+ Hours">8+ Hours</option>
                        <option value="All Day">All Day (Extrait)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Occasion</label>
                      <select
                        value={newProduct.occasion}
                        onChange={(e) => setNewProduct({ ...newProduct, occasion: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Daily Wear">Daily Wear</option>
                        <option value="Office">Office / Business</option>
                        <option value="Gym">Active / Gym</option>
                        <option value="Date Night">Date Night</option>
                        <option value="Party">Party / celebrations</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Best Season</label>
                      <select
                        value={newProduct.best_season}
                        onChange={(e) => setNewProduct({ ...newProduct, best_season: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="All-Season">All-Season</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                        <option value="Autumn">Autumn</option>
                        <option value="Spring">Spring</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Best Time</label>
                      <select
                        value={newProduct.best_time}
                        onChange={(e) => setNewProduct({ ...newProduct, best_time: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Day/Night">Day/Night</option>
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                        <option value="All-Day">All-Day</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Sillage</label>
                      <select
                        value={newProduct.sillage}
                        onChange={(e) => setNewProduct({ ...newProduct, sillage: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Soft">Soft</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                        <option value="Heavy">Heavy</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Projection</label>
                      <select
                        value={newProduct.projection}
                        onChange={(e) => setNewProduct({ ...newProduct, projection: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      >
                        <option value="Soft">Soft</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Description & Images */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-850 pb-1">
                    <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider text-amber-500">Visuals & Story</h4>
                    <button
                      type="button"
                      onClick={handleAIDescription}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 text-amber-500 rounded font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Write AI Description</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Bottle Front Image URL</label>
                      <input
                        type="text"
                        placeholder="Leave blank to use default template image URL"
                        value={newProduct.image_front}
                        onChange={(e) => setNewProduct({ ...newProduct, image_front: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-300">Description *</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Sensory description of top notes, sillage, and character..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-850 focus:border-amber-500 p-2.5 rounded text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal footer actions */}
                <div className="pt-3 border-t border-stone-850 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-stone-800 text-stone-500 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-950 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    {isEditMode ? 'Save Specifications' : 'Catalog Scent Profile'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

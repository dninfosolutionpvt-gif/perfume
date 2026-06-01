'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldAlert 
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

  // Form states for adding new product
  const [showAddModal, setShowAddModal] = useState(false);
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
    projection: 'Moderate'
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status (Shipped, Delivered, Paid, etc.)
  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        // Refresh local state
        await fetchData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this exquisite perfume from the catalog?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Handle add product submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setFormError('Please fill in the Name, Price, and Description fields.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        setFormSuccess('Luxury perfume successfully introduced to the catalog!');
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
          projection: 'Moderate'
        });
        await fetchData();
        setTimeout(() => setShowAddModal(false), 1500);
      } else {
        setFormError('Failed to add product. Please check the backend connection.');
      }
    } catch (err) {
      setFormError('Error connecting to backend server.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest font-bold">
          Authenticating Administrative Console...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-[#1C1917] text-white py-12 px-6 border-b border-gold/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(168,128,32,0.12),_transparent_40%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Orova Paris</span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Administrative Console
            </h1>
            <p className="text-zinc-400 text-xs mt-1.5 font-sans">
              Manage luxury scent profiles, catalog listings, and client transactions.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchData}
              disabled={refreshing}
              className="px-4 py-2 border border-gold/30 rounded text-gold hover:bg-gold/5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Console'}</span>
            </button>
            <Link 
              href="/"
              className="px-4 py-2 bg-gold hover:bg-gold-dark text-black rounded text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Go to Storefront
            </Link>
          </div>
        </div>
      </div>

      {/* Main Console Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Analytics Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Revenue */}
          <div className="bg-white border border-gold/15 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-gold/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Net Sales Revenue</span>
              <p className="text-2xl font-bold text-gold flex items-center font-sans">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-gold/15 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-gold/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Placed Orders</span>
              <p className="text-2xl font-bold text-[#1C1917] font-sans">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Products */}
          <div className="bg-white border border-gold/15 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-gold/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Scent Catalog</span>
              <p className="text-2xl font-bold text-[#1C1917] font-sans">
                {stats.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-lg group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Reviews */}
          <div className="bg-white border border-gold/15 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-gold/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Testimonials Logged</span>
              <p className="text-2xl font-bold text-[#1C1917] font-sans">
                {stats.totalReviews}
              </p>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-lg group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 fill-gold stroke-gold" />
            </div>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-200 gap-6 mb-8 text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-gold text-gold' : 'border-transparent text-zinc-500 hover:text-[#1C1917]'
            }`}
          >
            Console Overview
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'catalog' ? 'border-gold text-gold' : 'border-transparent text-zinc-500 hover:text-[#1C1917]'
            }`}
          >
            Manage Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders' ? 'border-gold text-gold' : 'border-transparent text-zinc-500 hover:text-[#1C1917]'
            }`}
          >
            Client Orders ({orders.length})
          </button>
        </div>

        {/* TAB WORKSPACES */}
        <div className="bg-white border border-gold/15 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Sales Graph Placeholder */}
              <div className="bg-[#FAF8F5] border border-gold/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">Scent Sales Progression</h3>
                    <p className="text-zinc-500 text-xs font-sans">Monthly sales trajectory and volume</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 text-xs rounded font-bold uppercase tracking-wider">
                    Target Met • +14.2% MoM
                  </span>
                </div>
                
                {/* Beautiful Mock SVG Bar Chart representing premium sales performance */}
                <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 border-b border-zinc-200 gap-4">
                  {[45, 60, 52, 78, 65, 95, 84, 110, 125, 115, 140, 155].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full relative">
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#1C1917] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ₹{(val * 249).toLocaleString()}
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-t group-hover:opacity-85 transition-opacity" 
                          style={{ height: `${(val / 160) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column details split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Side: Recent Client Orders */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">Recent Order Logs</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-xs uppercase text-gold hover:text-gold-dark tracking-wider font-bold"
                    >
                      View All Logs
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-4 rounded-xl border border-zinc-150 bg-[#FAF8F5] flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-zinc-800">{order.customer_name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">Order ID: #{order.id}</p>
                          <p className="text-[10px] text-zinc-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-gold">₹{order.total_amount.toLocaleString()}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : order.status === 'Shipped' 
                              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Popular Fragrances */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">Popular Elixirs</h3>
                    <button 
                      onClick={() => setActiveTab('catalog')}
                      className="text-xs uppercase text-gold hover:text-gold-dark tracking-wider font-bold"
                    >
                      Manage Products
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="p-4 rounded-xl border border-zinc-150 bg-[#FAF8F5] flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded border border-zinc-200 bg-white overflow-hidden flex-shrink-0">
                            <img src={product.image_front} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-zinc-800">{product.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{product.fragrance_type} • {product.gender}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-gold">₹{product.price.toLocaleString()}</p>
                          <p className="text-[10px] text-zinc-500 font-semibold">{product.stock} units in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MANAGE CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">Scent Catalog Cataloging</h3>
                  <p className="text-zinc-500 text-xs font-sans">Modify, introduce, or discontinue product lines.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 bg-gold hover:bg-gold-dark text-black rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow hover:shadow-gold/10 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Introduce Perfume</span>
                </button>
              </div>

              {/* Product Catalog Listings Table */}
              <div className="w-full overflow-x-auto rounded-xl border border-gold/15 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-150 bg-[#FAF8F5] text-[#1C1917] font-serif font-bold">
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold">Product details</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold">Category</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold">Price</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold">Stock</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold text-center">Rating</th>
                      <th className="p-4 uppercase tracking-widest text-[10px] text-gold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-650">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        
                        {/* Title & Image */}
                        <td className="p-4 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded border border-zinc-200 overflow-hidden flex-shrink-0 bg-[#FAF8F5]">
                            <img src={product.image_front} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-800 text-sm">{product.name}</p>
                            <p className="text-[10px] text-zinc-400 italic">Inspired by {product.inspired_by || 'Original'}</p>
                          </div>
                        </td>

                        {/* Category tag */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-zinc-200 text-zinc-600 text-[9px] uppercase tracking-wider rounded font-semibold font-mono">
                              {product.gender}
                            </span>
                            <p className="text-[10px] text-zinc-400 mt-1 font-sans">{product.fragrance_type} ({product.mood})</p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-bold text-gold font-mono">
                          ₹{product.price.toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td className="p-4">
                          <span className={`font-semibold font-sans ${product.stock <= 5 ? 'text-red-500' : 'text-zinc-650'}`}>
                            {product.stock} units
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center space-x-1 font-bold text-zinc-700 bg-gold/10 px-2 py-0.5 rounded border border-gold/10">
                            <Star className="w-3.5 h-3.5 fill-gold stroke-gold" />
                            <span>{product.rating}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CLIENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Customer Scent Orders</h3>
                <p className="text-zinc-500 text-xs font-sans">Inspect detailed shipping addresses and transition client orders.</p>
              </div>

              {/* Orders List Accordion Card */}
              <div className="space-y-5">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gold/15 rounded-xl overflow-hidden shadow-sm bg-white hover:border-gold/30 transition-colors">
                    
                    {/* Collapsed view banner */}
                    <div className="bg-[#FAF8F5] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3.5">
                          <span className="font-bold text-sm text-zinc-800">#{order.id} - {order.customer_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : order.status === 'Shipped' 
                              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono">Date: {new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 md:text-right">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Amount</p>
                          <p className="font-bold text-gold text-sm font-mono">₹{order.total_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Payment Method</p>
                          <p className="font-semibold text-zinc-700">{order.payment_method} ({order.payment_status})</p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details container */}
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-zinc-650">
                      
                      {/* 1. Client profile detail */}
                      <div className="space-y-3.5 border-b lg:border-b-0 lg:border-r border-zinc-100 pb-4 lg:pb-0 pr-4">
                        <h4 className="font-serif font-bold text-[#1C1917] text-sm uppercase tracking-wider flex items-center space-x-1 text-gold">
                          <User className="w-4 h-4" />
                          <span>Client Profile</span>
                        </h4>
                        <div className="space-y-2">
                          <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-zinc-450" /> {order.customer_email}</p>
                          <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-zinc-450" /> {order.phone}</p>
                          <p className="flex items-start">
                            <MapPin className="w-3.5 h-3.5 mr-2 text-zinc-450 mt-0.5" /> 
                            <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                          </p>
                        </div>
                      </div>

                      {/* 2. Order actions transition */}
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-[#1C1917] text-sm uppercase tracking-wider flex items-center space-x-1 text-gold">
                          <CreditCard className="w-4 h-4" />
                          <span>Fulfillment Actions</span>
                        </h4>
                        <div className="space-y-3.5">
                          {/* Transit stage buttons */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-zinc-450 uppercase font-bold">Shipping Status</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateOrder(order.id, { status: 'Shipped' })}
                                disabled={order.status === 'Shipped'}
                                className="flex-1 py-1.5 border border-blue-200 hover:border-blue-300 text-blue-600 bg-blue-50/20 hover:bg-blue-50 rounded font-bold uppercase tracking-wider text-[9px] transition-all disabled:opacity-40 flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Ship</span>
                              </button>
                              <button
                                onClick={() => handleUpdateOrder(order.id, { status: 'Delivered' })}
                                disabled={order.status === 'Delivered'}
                                className="flex-1 py-1.5 border border-green-200 hover:border-green-300 text-green-600 bg-green-50/20 hover:bg-green-50 rounded font-bold uppercase tracking-wider text-[9px] transition-all disabled:opacity-40 flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Deliver</span>
                              </button>
                            </div>
                          </div>

                          {/* Payment updates */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-zinc-450 uppercase font-bold">Payment Clearing</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateOrder(order.id, { payment_status: 'Paid' })}
                                disabled={order.payment_status === 'Paid'}
                                className="flex-1 py-1.5 border border-gold/30 hover:border-gold text-gold hover:bg-gold/5 rounded font-bold uppercase tracking-wider text-[9px] transition-all disabled:opacity-40 cursor-pointer"
                              >
                                Mark As Paid
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* 3. Transaction Security log */}
                      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-gold/10 space-y-2.5 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <p className="font-bold text-[#1C1917] flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                            <span>Transaction Verified</span>
                          </p>
                          <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                            Client checkout processed securely with signature validation. Invoice generated automatically.
                          </p>
                        </div>
                        <div className="border-t border-zinc-150 pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>Gateway: Razorpay Secure</span>
                          <span>Logs: OK</span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* POPUP MODAL DIALOG: INTRODUCE PRODUCT */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gold/25 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal header */}
              <div className="bg-[#1C1917] text-white p-5 border-b border-gold/20 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Introduce Scent Profile</h3>
                  <p className="text-[10px] text-zinc-400">Introduce a custom niche fragrance to the market catalog.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable form content */}
              <form onSubmit={handleAddProductSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-650 max-h-[70vh] scrollbar-thin">
                
                {formError && (
                  <p className="p-3 bg-red-50 border border-red-200 text-red-600 rounded flex items-center font-semibold">
                    <ShieldAlert className="w-4 h-4 mr-2" /> {formError}
                  </p>
                )}
                {formSuccess && (
                  <p className="p-3 bg-green-50 border border-green-200 text-green-600 rounded flex items-center font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2 animate-bounce" /> {formSuccess}
                  </p>
                )}

                {/* Grid Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold">Perfume Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Amber Horizon"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Price (INR) *</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 2999"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold">Gender Archetype</label>
                    <select
                      value={newProduct.gender}
                      onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Fragrance Type</label>
                    <select
                      value={newProduct.fragrance_type}
                      onChange={(e) => setNewProduct({ ...newProduct, fragrance_type: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    >
                      <option value="Woody">Woody</option>
                      <option value="Citrus">Citrus</option>
                      <option value="Floral">Floral</option>
                      <option value="Aquatic">Aquatic</option>
                      <option value="Oriental">Oriental</option>
                      <option value="Fresh">Fresh</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Scent Mood</label>
                    <select
                      value={newProduct.mood}
                      onChange={(e) => setNewProduct({ ...newProduct, mood: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    >
                      <option value="Bold">Bold</option>
                      <option value="Romantic">Romantic</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Elegant">Elegant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold">Inspired-by Reference Scent</label>
                    <input
                      type="text"
                      placeholder="e.g. Creed Aventus"
                      value={newProduct.inspired_by}
                      onChange={(e) => setNewProduct({ ...newProduct, inspired_by: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Front Scent Bottle Image URL</label>
                    <input
                      type="text"
                      placeholder="Leave blank to use elegant luxury placeholder"
                      value={newProduct.image_front}
                      onChange={(e) => setNewProduct({ ...newProduct, image_front: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold">Longevity Concentration</label>
                    <select
                      value={newProduct.longevity}
                      onChange={(e) => setNewProduct({ ...newProduct, longevity: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    >
                      <option value="4-6 Hours">4-6 Hours (EDT style)</option>
                      <option value="8+ Hours">8+ Hours (EDP style)</option>
                      <option value="All Day">All Day (Extrait de Parfum)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">Occasion Placement</label>
                    <select
                      value={newProduct.occasion}
                      onChange={(e) => setNewProduct({ ...newProduct, occasion: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none"
                    >
                      <option value="Daily Wear">Daily Wear</option>
                      <option value="Office">Office / Business</option>
                      <option value="Gym">Active / Gym</option>
                      <option value="Date Night">Date Night / Intimate</option>
                      <option value="Party">Party / Celebrations</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold">Emotional Scent Description *</label>
                  <textarea
                    required
                    rows="3.5"
                    placeholder="Craft a highly sensory description outlining ingredients, sillage evolution, and personality trail..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-zinc-200 focus:border-gold p-2.5 rounded text-[#1C1917] focus:outline-none resize-none"
                  />
                </div>

                {/* Footer Modal Action */}
                <div className="pt-3 border-t border-zinc-150 flex justify-end space-x-3.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-zinc-300 text-zinc-500 rounded font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1C1917] hover:bg-[#2e2a27] text-gold border border-gold/30 hover:border-gold rounded font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Catalog Scent profile
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

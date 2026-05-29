const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-Memory Fallback Data (for robustness if PostgreSQL is not running)
const mockProducts = [
  {
    id: 1,
    name: 'Oud Midnight',
    price: 3499.00,
    gender: 'Unisex',
    fragrance_type: 'Woody',
    occasion: 'Date Night',
    longevity: '8+ Hours',
    mood: 'Bold',
    description: 'A rich, hypnotic blend of dark agarwood (oud) and sweet damask rose. Crafted for evening confidence, this fragrance opens with warm saffron, evolving into a heart of sensual rose before settling into a deep, smoky amber and vetiver base.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    top_notes: ['Saffron', 'Nutmeg'],
    heart_notes: ['Damask Rose', 'Jasmine'],
    base_notes: ['Oud (Agarwood)', 'Amber', 'Patchouli'],
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
  {
    id: 2,
    name: 'Citrus Breeze',
    price: 2199.00,
    gender: 'Men',
    fragrance_type: 'Citrus',
    occasion: 'Gym',
    longevity: '4-6 Hours',
    mood: 'Fresh',
    description: 'An explosive burst of crisp Mediterranean lemon and bitter bergamot, layered with aromatic marine salts and rosemary. Perfect for a refreshing gym workout or a hot summer day outdoors.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 3,
    name: 'Velvet Bloom',
    price: 2899.00,
    gender: 'Women',
    fragrance_type: 'Floral',
    occasion: 'Party',
    longevity: '8+ Hours',
    mood: 'Romantic',
    description: 'A luxurious, ultra-feminine bouquet of white tuberose, blooming jasmine, and velvet roses, softened by cream-infused vanilla and cashmeran wood. Designed to turn heads at celebrations and evening galas.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    top_notes: ['Pink Pepper', 'Pear'],
    heart_notes: ['Tuberose', 'Jasmine Sambac', 'Red Rose'],
    base_notes: ['Vanilla', 'Patchouli', 'Cashmere Wood'],
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
  {
    id: 4,
    name: 'Sandalwood Monarch',
    price: 3299.00,
    gender: 'Men',
    fragrance_type: 'Woody',
    occasion: 'Office',
    longevity: 'All Day',
    mood: 'Elegant',
    description: 'Sophisticated and authoritative. A warm, creamy Indian sandalwood core, sharpened by dry cedar and spiced cardamom. The ideal companion for high-profile business meetings and daily office prestige.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    top_notes: ['Cardamom', 'Violet Accord'],
    heart_notes: ['Papyrus', 'Iris'],
    base_notes: ['Sandalwood', 'Cedarwood', 'Leather'],
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
  {
    id: 5,
    name: 'Blue Vague',
    price: 2499.00,
    gender: 'Unisex',
    fragrance_type: 'Aquatic',
    occasion: 'Summer',
    longevity: '4-6 Hours',
    mood: 'Fresh',
    description: 'An endless summer in a bottle. Shimmering marine accords, ozone, and wet stones meet the warmth of sun-bleached driftwood, vetiver, and crisp pine needles. Clean, breezy, and refreshing.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    top_notes: ['Marine Accord', 'Grapefruit'],
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
  {
    id: 6,
    name: 'Nuit Noir',
    price: 3599.00,
    gender: 'Women',
    fragrance_type: 'Oriental',
    occasion: 'Date Night',
    longevity: 'All Day',
    mood: 'Bold',
    description: 'Seductive, mysterious, and intoxicating. Rich, dark roasted coffee beans combined with sweet vanilla pod absolute, orange blossom, and a base of smooth white musk. A true masterpiece for intimate night-outs.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
];

const mockReviews = {
  1: [
    { id: 1, user_name: 'Aarav Mehta', rating: 5, comment: 'Absolutely exquisite! The oud has a very smooth opening and stays on my skin for more than 10 hours. Definitely buying another bottle.', created_at: new Date() },
    { id: 2, user_name: 'Priya Sharma', rating: 5, comment: 'Smells very premium, like a niche perfume. The rose and saffron combination is gorgeous.', created_at: new Date() }
  ],
  2: [
    { id: 3, user_name: 'Kabir Malhotra', rating: 4, comment: 'Very fresh and uplifting. Great for everyday use, especially before gym workouts.', created_at: new Date() }
  ],
  3: [
    { id: 4, user_name: 'Neha Patel', rating: 5, comment: 'I wore this to a wedding reception and got so many compliments! It has a heavy, elegant floral trail.', created_at: new Date() }
  ],
  4: [
    { id: 5, user_name: 'Rohan Das', rating: 5, comment: 'Extremely professional and clean sandalwood scent. Perfect for office wear. Worth every rupee.', created_at: new Date() }
  ],
  5: [
    { id: 6, user_name: 'Vikram Singh', rating: 4, comment: 'Very refreshing and natural salty beach scent. I wish it lasted a bit longer, but it is great for hot summer days.', created_at: new Date() }
  ],
  6: [
    { id: 7, user_name: 'Ananya Sen', rating: 5, comment: 'This is pure luxury in a bottle. The coffee and vanilla make a beautiful intoxicating combo.', created_at: new Date() }
  ]
};

const mockOrders = [];

// 1. Get All Products (with filters)
app.get('/api/products', async (req, res) => {
  const { search, gender, type, occasion, longevity, mood } = req.query;

  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let count = 1;

    if (search) {
      sql += ` AND (name ILIKE $${count} OR description ILIKE $${count})`;
      params.push(`%${search}%`);
      count++;
    }
    if (gender && gender !== 'All') {
      sql += ` AND gender = $${count}`;
      params.push(gender);
      count++;
    }
    if (type && type !== 'All') {
      sql += ` AND fragrance_type = $${count}`;
      params.push(type);
      count++;
    }
    if (occasion && occasion !== 'All') {
      sql += ` AND occasion = $${count}`;
      params.push(occasion);
      count++;
    }
    if (longevity && longevity !== 'All') {
      sql += ` AND longevity = $${count}`;
      params.push(longevity);
      count++;
    }
    if (mood && mood !== 'All') {
      sql += ` AND mood = $${count}`;
      params.push(mood);
      count++;
    }

    const { rows } = await db.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.warn('⚠️ DB query failed, falling back to static mock data. Error:', error.message);
    
    // In-memory filtration fallback
    let filtered = [...mockProducts];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (gender && gender !== 'All') {
      filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }
    if (type && type !== 'All') {
      filtered = filtered.filter(p => p.fragrance_type.toLowerCase() === type.toLowerCase());
    }
    if (occasion && occasion !== 'All') {
      filtered = filtered.filter(p => p.occasion.toLowerCase() === occasion.toLowerCase());
    }
    if (longevity && longevity !== 'All') {
      filtered = filtered.filter(p => p.longevity.toLowerCase() === longevity.toLowerCase());
    }
    if (mood && mood !== 'All') {
      filtered = filtered.filter(p => p.mood.toLowerCase() === mood.toLowerCase());
    }

    return res.json(filtered);
  }
});

// 2. Get Product By ID
app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(440).json({ error: 'Product not found' });
    return res.json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB lookup failed, falling back to static product details.');
    const product = mockProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  }
});

// 3. Get Reviews for Product
app.get('/api/products/:id/reviews', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const { rows } = await db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC', [productId]);
    return res.json(rows);
  } catch (error) {
    console.warn('⚠️ DB reviews fetch failed, falling back to static reviews.');
    return res.json(mockReviews[productId] || []);
  }
});

// 4. Create Review for Product
app.post('/api/products/:id/reviews', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { user_name, rating, comment } = req.body;

  if (!user_name || !rating || !comment) {
    return res.status(400).json({ error: 'Missing review fields' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, user_name, rating, comment]
    );
    // Update aggregate rating
    await db.query(
      'UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1), reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1) WHERE id = $1',
      [productId]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB review creation failed, saving to in-memory fallback.');
    if (!mockReviews[productId]) mockReviews[productId] = [];
    const newRev = {
      id: Date.now(),
      product_id: productId,
      user_name,
      rating: parseInt(rating, 10),
      comment,
      created_at: new Date()
    };
    mockReviews[productId].push(newRev);

    // Update in-memory product counts
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      const avg = mockReviews[productId].reduce((sum, r) => sum + r.rating, 0) / mockReviews[productId].length;
      product.rating = parseFloat(avg.toFixed(1));
      product.reviews_count = mockReviews[productId].length;
    }

    return res.status(201).json(newRev);
  }
});

// 5. Scent Matcher Quiz Evaluating Route
app.post('/api/quiz', async (req, res) => {
  const { sweetness, daytime, venue, time_period } = req.body;
  // sweetness: 'sweet' (floral/oriental) or 'strong' (woody/oriental)
  // daytime: 'day' (citrus/aquatic/fresh) or 'night' (woody/oriental/floral)
  // venue: 'office' (fresh/wood/citrus) or 'party' (floral/woody/oriental/bold) or 'date' (woody/oriental/floral)
  // time_period: '4-6' or '8+' or 'allday'

  try {
    // We will query all products and score them in-app to find the best match
    let productsList = [];
    try {
      const { rows } = await db.query('SELECT * FROM products');
      productsList = rows;
    } catch {
      productsList = mockProducts;
    }

    // Evaluate match scores
    const scored = productsList.map(product => {
      let score = 0;

      // 1. Sweetness alignment
      if (sweetness === 'sweet') {
        if (['Floral', 'Oriental'].includes(product.fragrance_type)) score += 3;
      } else {
        if (['Woody', 'Musky', 'Oriental'].includes(product.fragrance_type)) score += 3;
      }

      // 2. Daytime alignment
      if (daytime === 'day') {
        if (product.best_time.toLowerCase().includes('day')) score += 2;
        if (['Citrus', 'Fresh', 'Aquatic'].includes(product.fragrance_type)) score += 2;
      } else {
        if (product.best_time.toLowerCase().includes('night')) score += 2;
        if (['Woody', 'Oriental', 'Floral'].includes(product.fragrance_type)) score += 2;
      }

      // 3. Venue alignment
      if (venue === 'office') {
        if (product.occasion.toLowerCase() === 'office') score += 3;
        if (product.projection === 'Moderate') score += 1;
      } else if (venue === 'party') {
        if (product.occasion.toLowerCase() === 'party') score += 3;
        if (product.sillage === 'Strong' || product.sillage === 'Heavy') score += 2;
      } else if (venue === 'date') {
        if (product.occasion.toLowerCase() === 'date night') score += 3;
        if (product.mood.toLowerCase() === 'bold' || product.mood.toLowerCase() === 'romantic') score += 2;
      }

      // 4. Longevity alignment
      if (time_period === 'allday') {
        if (product.longevity === 'All Day' || product.longevity === '8+ Hours') score += 2;
      } else if (time_period === '8+') {
        if (product.longevity === '8+ Hours' || product.longevity === 'All Day') score += 2;
      } else {
        if (product.longevity === '4-6 Hours') score += 2;
      }

      return { ...product, matchScore: score };
    });

    // Sort by descending score
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return res.json(scored.slice(0, 3)); // Return top 3 matches
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 6. Checkout Order Creator
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_email, phone, address, city, state, pincode, total_amount, payment_method, cartItems } = req.body;

  if (!customer_name || !customer_email || !phone || !address || !city || !state || !pincode || !total_amount || !payment_method || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Missing checkout information' });
  }

  try {
    // Start transaction
    await db.query('BEGIN');

    const orderRes = await db.query(
      `INSERT INTO orders (customer_name, customer_email, phone, address, city, state, pincode, total_amount, payment_method, payment_status, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [customer_name, customer_email, phone, address, city, state, pincode, total_amount, payment_method, payment_method === 'COD' ? 'Pending' : 'Paid', 'Placed']
    );

    const orderId = orderRes.rows[0].id;

    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
      // Reduce stock
      await db.query(
        'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
        [item.quantity, item.id]
      );
    }

    await db.query('COMMIT');
    return res.status(201).json({ success: true, orderId, order: orderRes.rows[0] });

  } catch (error) {
    try {
      await db.query('ROLLBACK');
    } catch (_) {}
    
    console.warn('⚠️ DB Order insertion failed, completing checkout in-memory.');
    const orderId = Date.now();
    const newOrder = {
      id: orderId,
      customer_name,
      customer_email,
      phone,
      address,
      city,
      state,
      pincode,
      total_amount,
      payment_method,
      payment_status: payment_method === 'COD' ? 'Pending' : 'Paid',
      status: 'Placed',
      created_at: new Date()
    };
    mockOrders.push(newOrder);

    // Mock stock reduction
    for (const item of cartItems) {
      const product = mockProducts.find(p => p.id === item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }

    return res.status(201).json({ success: true, orderId, order: newOrder });
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`✨ Premium Perfume Server running on port http://localhost:${PORT}`);
});

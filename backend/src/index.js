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
    name: 'Orova Purple Oud',
    price: 3599.00,
    gender: 'Unisex',
    fragrance_type: 'Woody',
    occasion: 'Date Night',
    longevity: '12+ Hours',
    mood: 'Bold',
    description: 'A dark, hypnotic oriental masterpiece. It opens with the dry spice of saffron and pink pepper, evolving into a precious heart of rich agarwood (oud) and warm amber, before leaving a trail of premium leather and patchouli.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 2,
    name: 'Orova Amber Oud',
    price: 3699.00,
    gender: 'Unisex',
    fragrance_type: 'Oriental',
    occasion: 'Winter',
    longevity: '12+ Hours',
    mood: 'Bold',
    description: 'An opulent, deeply warming blend of precious oud oil, rich golden amber, and soft exotic woods. Highlighted by warm vanilla and sweet patchouli, creating a magnetic and highly sophisticated evening aura.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 3,
    name: 'Orova Elixir',
    price: 3499.00,
    gender: 'Unisex',
    fragrance_type: 'Floral',
    occasion: 'Party',
    longevity: '8+ Hours',
    mood: 'Romantic',
    description: 'An intoxicating, sweet gourmand unisex fragrance. A playful yet deep opening of sweet wild strawberries and soft berries, melting into a heart of rich vanilla pod absolute and fresh blossoms, finished with warm cashmere musk.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 4,
    name: 'Orova Santal Woods',
    price: 3299.00,
    gender: 'Unisex',
    fragrance_type: 'Woody',
    occasion: 'Office',
    longevity: 'All Day',
    mood: 'Elegant',
    description: 'Authoritative, creamy, and soothing. A pristine blend of creamy Indian sandalwood, dry Australian cedar, and exotic cardamom. Clean, sophisticated, and perfectly suited for professional and all-day elegance.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 5,
    name: 'Orova Citrus Ocean',
    price: 2499.00,
    gender: 'Unisex',
    fragrance_type: 'Aquatic',
    occasion: 'Gym',
    longevity: '4-6 Hours',
    mood: 'Fresh',
    description: 'A bright, exhilarating burst of Italian bergamot, marine salt, and cold-pressed grapefruit. It evokes a refreshing sea breeze along the Amalfi coast, settling into warm driftwood and clean white musk.',
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
    id: 6,
    name: 'Orova Imperial Rose',
    price: 3199.00,
    gender: 'Unisex',
    fragrance_type: 'Floral',
    occasion: 'Office',
    longevity: '8+ Hours',
    mood: 'Romantic',
    description: 'An absolute tribute to the luxury Turkish rose. Freshly plucked rose petals drenched in morning dew, combined with sweet lychee and warm pink pepper, resting on a base of soft cedarwood and clean musk.',
    image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600',
    image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
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
  {
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
    image_lifestyle: '/orova_tuberose.png',
    image_spray: '/orova_tuberose.png',
    image_box: '/orova_tuberose.png',
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
];

const mockReviews = {
  1: [
    { id: 1, user_name: 'Aarav Mehta', rating: 5, comment: 'Absolutely exquisite! The Purple Oud has a very smooth opening and stays on my skin for more than 10 hours. Definitely buying another bottle.', created_at: new Date() },
    { id: 2, user_name: 'Priya Sharma', rating: 5, comment: 'Smells very premium, like a niche perfume. The rose and saffron combination in Purple Oud is gorgeous.', created_at: new Date() }
  ],
  2: [
    { id: 3, user_name: 'Kabir Malhotra', rating: 5, comment: 'Very premium Amber Oud. Perfectly warm and sweet for cooler days. Great projection!', created_at: new Date() }
  ],
  3: [
    { id: 4, user_name: 'Neha Patel', rating: 5, comment: 'I wore Orova Elixir to a wedding reception and got so many compliments! It has a heavy, elegant sweet trail.', created_at: new Date() }
  ],
  4: [
    { id: 5, user_name: 'Rohan Das', rating: 5, comment: 'Extremely professional and clean sandalwood scent. Perfect for office wear. Worth every rupee.', created_at: new Date() }
  ],
  5: [
    { id: 6, user_name: 'Vikram Singh', rating: 4, comment: 'Very refreshing and natural salty beach scent. I wish it lasted a bit longer, but it is great for hot summer days.', created_at: new Date() }
  ],
  6: [
    { id: 7, user_name: 'Ananya Sen', rating: 5, comment: 'Gorgeous rose blend. Fresh, elegant, and turns heads everywhere.', created_at: new Date() }
  ],
  7: [
    { id: 8, user_name: 'Shreya Ghoshal', rating: 5, comment: 'Stunning white floral fragrance! The creamy tuberose is so long lasting. Absolutely gorgeous.', created_at: new Date() },
    { id: 9, user_name: 'Meera Rajput', rating: 5, comment: 'Rich, elegant, and smells exactly like luxury Grasse tuberose blooms. Worth every single rupee.', created_at: new Date() }
  ]
};

const mockOrders = [
  {
    id: 1001,
    customer_name: 'Aarav Mehta',
    customer_email: 'aarav.mehta@gmail.com',
    phone: '9876543210',
    address: 'Flat 402, Sea Breeze Apartments, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    total_amount: 3599.00,
    payment_method: 'UPI',
    payment_status: 'Paid',
    status: 'Delivered',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 1002,
    customer_name: 'Neha Patel',
    customer_email: 'neha.patel@yahoo.com',
    phone: '8765432109',
    address: '12, Orchid Villa, Satellite',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    total_amount: 5798.00,
    payment_method: 'COD',
    payment_status: 'Pending',
    status: 'Shipped',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 1003,
    customer_name: 'Kabir Malhotra',
    customer_email: 'kabir.m@outlook.com',
    phone: '7654321098',
    address: 'H-18, Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    total_amount: 2499.00,
    payment_method: 'UPI',
    payment_status: 'Paid',
    status: 'Placed',
    created_at: new Date()
  }
];

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

// --- ADMIN API ENDPOINTS ---

// Get all orders for admin panel
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    console.warn('⚠️ DB orders query failed, falling back to mock orders.');
    return res.json(mockOrders);
  }
});

// Update order status/payment
app.put('/api/admin/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const { status, payment_status } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE orders SET status = COALESCE($1, status), payment_status = COALESCE($2, payment_status) WHERE id = $3 RETURNING *',
      [status, payment_status, orderId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    return res.json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB order update failed, updating in-memory mock order.');
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    return res.json(order);
  }
});

// Get admin stats dashboard overview
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalOrdersRes = await db.query('SELECT COUNT(*) FROM orders');
    const revenueRes = await db.query('SELECT SUM(total_amount) FROM orders WHERE payment_status = $1', ['Paid']);
    const productsRes = await db.query('SELECT COUNT(*) FROM products');
    const reviewsRes = await db.query('SELECT COUNT(*) FROM reviews');

    return res.json({
      totalOrders: parseInt(totalOrdersRes.rows[0].count, 10) || 0,
      totalRevenue: parseFloat(revenueRes.rows[0].sum || 0),
      totalProducts: parseInt(productsRes.rows[0].count, 10) || 0,
      totalReviews: parseInt(reviewsRes.rows[0].count, 10) || 0,
    });
  } catch (error) {
    console.warn('⚠️ DB stats query failed, calculating in-memory.');
    const totalOrders = mockOrders.length;
    const totalRevenue = mockOrders.reduce((sum, o) => o.payment_status === 'Paid' ? sum + Number(o.total_amount) : sum, 0);
    const totalProducts = mockProducts.length;
    const totalReviews = Object.values(mockReviews).reduce((sum, r) => sum + r.length, 0);
    return res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalReviews,
    });
  }
});

// Admin Add new product
app.post('/api/admin/products', async (req, res) => {
  const { name, price, gender, fragrance_type, occasion, longevity, mood, description, image_front, inspired_by, sillage, projection } = req.body;
  if (!name || !price || !gender || !fragrance_type || !occasion || !longevity || !mood || !description) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO products (name, price, gender, fragrance_type, occasion, longevity, mood, description, image_front, image_side, image_lifestyle, image_spray, image_box, top_notes, heart_notes, base_notes, sillage, projection, best_season, best_time, rating, reviews_count, stock, similar_to, inspired_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $9, $9, $9, $10, $11, $12, $13, $14, $15, $16, 5.0, 0, 10, $17, $18) RETURNING *`,
      [
        name, parseFloat(price), gender, fragrance_type, occasion, longevity, mood, description,
        image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        ['Citrus', 'Spices'], ['Flora', 'Jasmine'], ['Musk', 'Amber'], sillage || 'Moderate', projection || 'Moderate', 'All-Season', 'Day/Night', 'Niche Perfume', inspired_by || 'Original Formula'
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB product creation failed, saving to in-memory fallback.');
    const newProduct = {
      id: mockProducts.length + 1,
      name,
      price: parseFloat(price),
      gender,
      fragrance_type,
      occasion,
      longevity,
      mood,
      description,
      image_front: image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
      image_side: image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
      image_lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
      image_spray: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
      image_box: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
      top_notes: ['Saffron', 'Spices'],
      heart_notes: ['Rose', 'Jasmine'],
      base_notes: ['Amber', 'Musk'],
      sillage: sillage || 'Moderate',
      projection: projection || 'Moderate',
      best_season: 'All-Season',
      best_time: 'Day/Night',
      rating: 5.0,
      reviews_count: 0,
      stock: 10,
      similar_to: 'Niche Perfume',
      inspired_by: inspired_by || 'Original Formula'
    };
    mockProducts.push(newProduct);
    return res.status(201).json(newProduct);
  }
});

// Admin Delete product
app.delete('/api/admin/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [productId]);
    if (rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.warn('⚠️ DB product delete failed, deleting from in-memory.');
    const idx = mockProducts.findIndex(p => p.id === productId);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    mockProducts.splice(idx, 1);
    return res.json({ success: true, message: 'Product deleted successfully in-memory' });
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`✨ Premium Perfume Server running on port http://localhost:${PORT}`);
});

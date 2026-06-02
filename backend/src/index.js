const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

const path = require('path');
const fs = require('fs');
const https = require('https');

const configPath = path.join(__dirname, 'config', 'shopify_config.json');

function getShopifyConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading shopify config:', err.message);
  }
  return null;
}

function saveShopifyConfig(config) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving shopify config:', err.message);
    return false;
  }
}

async function shopifyAdminRequest(config, endpoint, method = 'GET', body = null) {
  const { storeDomain, adminAccessToken } = config;
  const cleanDomain = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const url = `https://${cleanDomain}/admin/api/2024-01/${endpoint}`;
  
  if (typeof fetch !== 'undefined') {
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    };
    const options = {
      method,
      headers,
    };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${text}`);
    }
    return await response.json();
  } else {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: cleanDomain,
        path: `/admin/api/2024-01/${endpoint}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminAccessToken,
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          } else {
            reject(new Error(`Shopify API error (${res.statusCode}): ${data}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      if (body && method !== 'GET') {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }
}

function parseShopifyTags(tagsString) {
  const result = {
    gender: 'Unisex',
    fragrance_type: 'Floral',
    mood: 'Elegant',
    occasion: 'Daily Wear',
    longevity: '8+ Hours',
    sillage: 'Moderate',
    projection: 'Moderate',
    inspired_by: 'Original Formula',
    similar_to: 'Niche Perfume',
    best_season: 'All-Season',
    best_time: 'Day/Night',
    top_notes: ['Citrus', 'Spices'],
    heart_notes: ['Jasmine', 'Rose'],
    base_notes: ['Sandalwood', 'Musk']
  };

  if (!tagsString) return result;
  
  const tags = tagsString.split(',').map(t => t.trim());

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    
    if (lower === 'men' || lower === 'male') result.gender = 'Men';
    else if (lower === 'women' || lower === 'female') result.gender = 'Women';
    else if (lower === 'unisex') result.gender = 'Unisex';
    
    if (['woody', 'floral', 'citrus', 'oriental', 'aquatic', 'fresh', 'musky'].includes(lower)) {
      result.fragrance_type = tag.charAt(0).toUpperCase() + tag.slice(1);
    }
    
    if (['bold', 'romantic', 'fresh', 'elegant'].includes(lower)) {
      result.mood = tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    if (lower.startsWith('top:')) {
      result.top_notes = tag.slice(4).split(';').map(n => n.trim());
    }
    if (lower.startsWith('heart:')) {
      result.heart_notes = tag.slice(6).split(';').map(n => n.trim());
    }
    if (lower.startsWith('base:')) {
      result.base_notes = tag.slice(5).split(';').map(n => n.trim());
    }
    if (lower.startsWith('inspired_by:')) {
      result.inspired_by = tag.slice(12);
    }
    if (lower.startsWith('similar_to:')) {
      result.similar_to = tag.slice(11);
    }
    if (lower.startsWith('longevity:')) {
      result.longevity = tag.slice(10);
    }
    if (lower.startsWith('occasion:')) {
      result.occasion = tag.slice(9);
    }
    if (lower.startsWith('season:')) {
      result.best_season = tag.slice(7);
    }
    if (lower.startsWith('time:')) {
      result.best_time = tag.slice(5);
    }
  }
  
  return result;
}

function mapShopifyProductToAppFormat(p) {
  const price = p.variants && p.variants[0] ? parseFloat(p.variants[0].price) : 0;
  const stock = p.variants && p.variants[0] ? parseInt(p.variants[0].inventory_quantity ?? 10, 10) : 10;
  
  const parsedTags = parseShopifyTags(p.tags);
  
  const images = p.images || [];
  const image_front = images[0] ? images[0].src : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600';
  const image_side = images[1] ? images[1].src : image_front;
  const image_lifestyle = images[2] ? images[2].src : image_front;
  const image_spray = images[3] ? images[3].src : image_front;
  const image_box = images[4] ? images[4].src : image_front;
  
  return {
    id: p.id,
    name: p.title,
    price: price,
    gender: parsedTags.gender,
    fragrance_type: parsedTags.fragrance_type,
    occasion: parsedTags.occasion,
    longevity: parsedTags.longevity,
    mood: parsedTags.mood,
    description: p.body_html ? p.body_html.replace(/<\/?[^>]+(>|$)/g, "") : "",
    image_front,
    image_side,
    image_lifestyle,
    image_spray,
    image_box,
    top_notes: parsedTags.top_notes,
    heart_notes: parsedTags.heart_notes,
    base_notes: parsedTags.base_notes,
    sillage: parsedTags.sillage,
    projection: parsedTags.projection,
    best_season: parsedTags.best_season,
    best_time: parsedTags.best_time,
    rating: 4.9,
    reviews_count: 8,
    stock: stock,
    similar_to: parsedTags.similar_to,
    inspired_by: parsedTags.inspired_by,
    shopify_status: p.status || 'active'
  };
}

function mapShopifyOrderToAppFormat(o) {
  const customer_name = o.shipping_address 
    ? `${o.shipping_address.first_name || ''} ${o.shipping_address.last_name || ''}`.trim()
    : (o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}`.trim() : 'Guest Customer');

  let payment_status = 'Pending';
  if (o.financial_status === 'paid') payment_status = 'Paid';
  else if (o.financial_status === 'refunded') payment_status = 'Refunded';

  let status = 'Placed';
  if (o.fulfillment_status === 'fulfilled') status = 'Delivered';
  else if (o.fulfillment_status === 'partial') status = 'Shipped';
  else if (o.cancelled_at) status = 'Cancelled';

  const items = (o.line_items || []).map(item => ({
    id: item.product_id,
    name: item.title,
    quantity: item.quantity,
    price: parseFloat(item.price),
    image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794251f?auto=format&fit=crop&q=80&w=600'
  }));

  return {
    id: o.id,
    shopify_order_number: o.name,
    customer_name: customer_name || 'Anonymous Customer',
    customer_email: o.email || 'no-email@shopify.com',
    phone: o.phone || (o.shipping_address ? o.shipping_address.phone : '') || 'N/A',
    address: o.shipping_address ? o.shipping_address.address1 : 'No Address',
    city: o.shipping_address ? o.shipping_address.city : '',
    state: o.shipping_address ? o.shipping_address.province : '',
    pincode: o.shipping_address ? o.shipping_address.zip : '',
    total_amount: parseFloat(o.total_price),
    payment_method: o.gateway || 'Shopify Gateway',
    payment_status,
    status,
    created_at: o.created_at,
    items
  };
}


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
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    items: [
      { id: 1, name: 'Orova Purple Oud', quantity: 1, price: 3599.00, image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600' }
    ]
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
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    items: [
      { id: 4, name: 'Orova Santal Woods', quantity: 1, price: 3299.00, image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600' },
      { id: 5, name: 'Orova Citrus Ocean', quantity: 1, price: 2499.00, image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600' }
    ]
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
    created_at: new Date(),
    items: [
      { id: 5, name: 'Orova Citrus Ocean', quantity: 1, price: 2499.00, image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600' }
    ]
  }
];

// --- SHOPIFY CONNECT CONFIG ENDPOINTS ---

// Get shopify credentials config status
app.get('/api/shopify/config', (req, res) => {
  const config = getShopifyConfig();
  if (config && config.connected) {
    return res.json({
      connected: true,
      storeDomain: config.storeDomain,
      storefrontAccessToken: config.storefrontAccessToken
    });
  }
  return res.json({ connected: false });
});

// OAuth Step 1: Initiate Shopify Authorization Redirect
app.post('/api/shopify/authorize', async (req, res) => {
  const { storeDomain, storefrontAccessToken, clientId, clientSecret, frontendUrl } = req.body;
  if (!storeDomain || !storefrontAccessToken || !clientId || !clientSecret || !frontendUrl) {
    return res.status(400).json({ error: 'Missing Shopify configuration details' });
  }

  const cleanDomain = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Store credentials temporarily (needed during callback token exchange)
  const tempConfig = {
    storeDomain: cleanDomain,
    storefrontAccessToken,
    clientId,
    clientSecret,
    connected: false,
    frontendUrl
  };
  saveShopifyConfig(tempConfig);

  const scopes = 'read_products,write_products,read_orders,write_orders';
  const redirectUri = `${req.protocol}://${req.get('host')}/api/shopify/callback`;
  const state = encodeURIComponent(frontendUrl);
  
  const authorizeUrl = `https://${cleanDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  
  return res.json({ authorizeUrl });
});

// OAuth Step 2: Shopify Redirect Callback & Token Exchange
app.get('/api/shopify/callback', async (req, res) => {
  const { code, shop, state } = req.query;
  const frontendUrl = decodeURIComponent(state || '');

  if (!code || !shop) {
    return res.redirect(`${frontendUrl || 'http://localhost:3000'}/admin?shopify_error=Missing_callback_params`);
  }

  const config = getShopifyConfig();
  if (!config) {
    return res.redirect(`${frontendUrl || 'http://localhost:3000'}/admin?shopify_error=No_temporary_config_found`);
  }

  const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    const tokenUrl = `https://${cleanShop}/admin/oauth/access_token`;
    const body = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code
    };

    let responseData;
    if (typeof fetch !== 'undefined') {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Token exchange failed (${response.status}): ${errText}`);
      }
      responseData = await response.json();
    } else {
      responseData = await new Promise((resolve, reject) => {
        const options = {
          hostname: cleanShop,
          path: '/admin/oauth/access_token',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        };
        const reqPost = https.request(options, (resPost) => {
          let data = '';
          resPost.on('data', chunk => { data += chunk; });
          resPost.on('end', () => {
            if (resPost.statusCode >= 200 && resPost.statusCode < 300) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`Token exchange failed (${resPost.statusCode}): ${data}`));
            }
          });
        });
        reqPost.on('error', reject);
        reqPost.write(JSON.stringify(body));
        reqPost.end();
      });
    }

    const { access_token } = responseData;
    if (!access_token) {
      throw new Error('No access_token returned in Shopify response');
    }

    // Save final config with access token
    config.adminAccessToken = access_token;
    config.connected = true;
    saveShopifyConfig(config);

    return res.redirect(`${frontendUrl || 'http://localhost:3000'}/admin?shopify_connected=true`);
  } catch (err) {
    console.error('Shopify OAuth Callback Error:', err.message);
    return res.redirect(`${frontendUrl || 'http://localhost:3000'}/admin?shopify_error=${encodeURIComponent(err.message)}`);
  }
});

// Disconnect shopify credentials
app.post('/api/shopify/config/disconnect', (req, res) => {
  try {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    return res.json({ success: true, message: 'Shopify connection cleared.' });
  } catch (err) {
    return res.status(500).json({ error: `Failed to disconnect: ${err.message}` });
  }
});

// 1. Get All Products (with filters)
app.get('/api/products', async (req, res) => {
  const { search, gender, type, occasion, longevity, mood } = req.query;

  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const data = await shopifyAdminRequest(shopifyConfig, 'products.json?limit=250');
      let productsList = (data.products || []).map(mapShopifyProductToAppFormat);
      
      if (search) {
        const q = search.toLowerCase();
        productsList = productsList.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (gender && gender !== 'All') {
        productsList = productsList.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
      }
      if (type && type !== 'All') {
        productsList = productsList.filter(p => p.fragrance_type.toLowerCase() === type.toLowerCase());
      }
      if (occasion && occasion !== 'All') {
        productsList = productsList.filter(p => p.occasion.toLowerCase() === occasion.toLowerCase());
      }
      if (longevity && longevity !== 'All') {
        productsList = productsList.filter(p => p.longevity.toLowerCase() === longevity.toLowerCase());
      }
      if (mood && mood !== 'All') {
        productsList = productsList.filter(p => p.mood.toLowerCase() === mood.toLowerCase());
      }
      return res.json(productsList);
    } catch (err) {
      console.warn('⚠️ Shopify products fetch failed, falling back to database/mock data. Error:', err.message);
    }
  }

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

app.get('/api/products/:id', async (req, res) => {
  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const data = await shopifyAdminRequest(shopifyConfig, `products/${req.params.id}.json`);
      if (data && data.product) {
        return res.json(mapShopifyProductToAppFormat(data.product));
      }
    } catch (err) {
      console.warn('⚠️ Shopify product fetch failed, falling back to database/mock details. Error:', err.message);
    }
  }

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
      created_at: new Date(),
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_front: item.image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
      }))
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

app.get('/api/admin/orders', async (req, res) => {
  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const data = await shopifyAdminRequest(shopifyConfig, 'orders.json?status=any&limit=100');
      const ordersList = (data.orders || []).map(mapShopifyOrderToAppFormat);
      return res.json(ordersList);
    } catch (err) {
      console.warn('⚠️ Shopify orders fetch failed, falling back to local. Error:', err.message);
    }
  }

  try {
    const { rows } = await db.query(`
      SELECT o.*, 
             COALESCE(
                 json_agg(
                     json_build_object(
                         'id', p.id,
                         'name', p.name,
                         'image_front', p.image_front,
                         'quantity', oi.quantity,
                         'price', oi.price
                     )
                 ) FILTER (WHERE oi.id IS NOT NULL),
                 '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.warn('⚠️ DB orders query failed, falling back to mock orders. Error:', error.message);
    return res.json(mockOrders);
  }
});

// Update order status/payment
app.put('/api/admin/orders/:id', async (req, res) => {
  const { status, payment_status } = req.body;

  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const getOrder = await shopifyAdminRequest(shopifyConfig, `orders/${req.params.id}.json`);
      let tags = getOrder.order.tags ? getOrder.order.tags.split(',').map(t => t.trim()) : [];
      
      tags = tags.filter(t => !t.startsWith('status:') && !t.startsWith('payment:'));
      if (status) tags.push(`status:${status}`);
      if (payment_status) tags.push(`payment:${payment_status}`);
      
      const updateData = {
        order: {
          id: getOrder.order.id,
          tags: tags.join(', ')
        }
      };

      const data = await shopifyAdminRequest(shopifyConfig, `orders/${req.params.id}.json`, 'PUT', updateData);
      return res.json(mapShopifyOrderToAppFormat(data.order));
    } catch (err) {
      console.warn('⚠️ Shopify order update failed, falling back to local. Error:', err.message);
    }
  }

  const orderId = parseInt(req.params.id, 10);
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
  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const ordersData = await shopifyAdminRequest(shopifyConfig, 'orders.json?status=any&limit=250');
      const productsData = await shopifyAdminRequest(shopifyConfig, 'products.json?limit=250');
      
      const orders = ordersData.orders || [];
      const totalOrders = orders.length;
      
      const totalRevenue = orders.reduce((sum, o) => {
        let isPaid = o.financial_status === 'paid';
        if (o.tags) {
          const tags = o.tags.split(',').map(t => t.trim().toLowerCase());
          if (tags.includes('payment:paid')) isPaid = true;
        }
        return isPaid ? sum + parseFloat(o.total_price || 0) : sum;
      }, 0);
      
      const totalProducts = (productsData.products || []).length;
      const totalReviews = 18;
      
      return res.json({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalReviews
      });
    } catch (err) {
      console.warn('⚠️ Shopify stats fetch failed, falling back to local. Error:', err.message);
    }
  }

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
  const { name, price, gender, fragrance_type, occasion, longevity, mood, description, image_front, inspired_by, sillage, projection, stock, top_notes, heart_notes, base_notes, similar_to, best_season, best_time } = req.body;
  if (!name || !price || !gender || !fragrance_type || !occasion || !longevity || !mood || !description) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const tagsList = [
        gender,
        fragrance_type,
        mood,
        `longevity:${longevity}`,
        `occasion:${occasion}`
      ];
      if (inspired_by) tagsList.push(`inspired_by:${inspired_by}`);
      if (similar_to) tagsList.push(`similar_to:${similar_to}`);
      if (sillage) tagsList.push(`sillage:${sillage}`);
      if (projection) tagsList.push(`projection:${projection}`);
      if (best_season) tagsList.push(`season:${best_season}`);
      if (best_time) tagsList.push(`time:${best_time}`);
      
      const topNotesArr = Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(x=>x.trim()) : []);
      const heartNotesArr = Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(x=>x.trim()) : []);
      const baseNotesArr = Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(x=>x.trim()) : []);

      if (topNotesArr.length > 0) tagsList.push(`top:${topNotesArr.join(';')}`);
      if (heartNotesArr.length > 0) tagsList.push(`heart:${heartNotesArr.join(';')}`);
      if (baseNotesArr.length > 0) tagsList.push(`base:${baseNotesArr.join(';')}`);

      const shopifyProduct = {
        product: {
          title: name,
          body_html: description,
          vendor: 'Orova Paris',
          product_type: 'Perfume',
          status: 'active',
          tags: tagsList.join(', '),
          variants: [
            {
              price: String(price),
              inventory_management: 'shopify',
              inventory_quantity: stock !== undefined ? parseInt(stock, 10) : 10
            }
          ],
          images: image_front ? [{ src: image_front }] : []
        }
      };

      const data = await shopifyAdminRequest(shopifyConfig, 'products.json', 'POST', shopifyProduct);
      return res.status(201).json(mapShopifyProductToAppFormat(data.product));
    } catch (err) {
      console.warn('⚠️ Shopify product creation failed, falling back to local. Error:', err.message);
      return res.status(400).json({ error: `Shopify create failed: ${err.message}` });
    }
  }

  try {
    const topNotesArr = Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(n => n.trim()) : ['Citrus', 'Spices']);
    const heartNotesArr = Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(n => n.trim()) : ['Flora', 'Jasmine']);
    const baseNotesArr = Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(n => n.trim()) : ['Musk', 'Amber']);

    const { rows } = await db.query(
      `INSERT INTO products (name, price, gender, fragrance_type, occasion, longevity, mood, description, image_front, image_side, image_lifestyle, image_spray, image_box, top_notes, heart_notes, base_notes, sillage, projection, best_season, best_time, rating, reviews_count, stock, similar_to, inspired_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $9, $9, $9, $10, $11, $12, $13, $14, $15, $16, 5.0, 0, $17, $18, $19) RETURNING *`,
      [
        name, parseFloat(price), gender, fragrance_type, occasion, longevity, mood, description,
        image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        topNotesArr, heartNotesArr, baseNotesArr, sillage || 'Moderate', projection || 'Moderate', best_season || 'All-Season', best_time || 'Day/Night',
        parseInt(stock || 10, 10), similar_to || 'Niche Perfume', inspired_by || 'Original Formula'
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB product creation failed, saving to in-memory fallback. Error:', error.message);
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
      top_notes: Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(n => n.trim()) : ['Saffron', 'Spices']),
      heart_notes: Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(n => n.trim()) : ['Rose', 'Jasmine']),
      base_notes: Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(n => n.trim()) : ['Amber', 'Musk']),
      sillage: sillage || 'Moderate',
      projection: projection || 'Moderate',
      best_season: best_season || 'All-Season',
      best_time: best_time || 'Day/Night',
      rating: 5.0,
      reviews_count: 0,
      stock: parseInt(stock || 10, 10),
      similar_to: similar_to || 'Niche Perfume',
      inspired_by: inspired_by || 'Original Formula'
    };
    mockProducts.push(newProduct);
    return res.status(201).json(newProduct);
  }
});

// Admin Edit existing product
app.put('/api/admin/products/:id', async (req, res) => {
  const { name, price, gender, fragrance_type, occasion, longevity, mood, description, image_front, inspired_by, sillage, projection, stock, top_notes, heart_notes, base_notes, similar_to, best_season, best_time } = req.body;
  if (!name || !price || !gender || !fragrance_type || !occasion || !longevity || !mood || !description) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      const productId = req.params.id;
      const existingProduct = await shopifyAdminRequest(shopifyConfig, `products/${productId}.json`);
      const existingImages = existingProduct.product.images || [];

      const tagsList = [
        gender,
        fragrance_type,
        mood,
        `longevity:${longevity}`,
        `occasion:${occasion}`
      ];
      if (inspired_by) tagsList.push(`inspired_by:${inspired_by}`);
      if (similar_to) tagsList.push(`similar_to:${similar_to}`);
      if (sillage) tagsList.push(`sillage:${sillage}`);
      if (projection) tagsList.push(`projection:${projection}`);
      if (best_season) tagsList.push(`season:${best_season}`);
      if (best_time) tagsList.push(`time:${best_time}`);
      
      const topNotesArr = Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(x=>x.trim()) : []);
      const heartNotesArr = Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(x=>x.trim()) : []);
      const baseNotesArr = Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(x=>x.trim()) : []);

      if (topNotesArr.length > 0) tagsList.push(`top:${topNotesArr.join(';')}`);
      if (heartNotesArr.length > 0) tagsList.push(`heart:${heartNotesArr.join(';')}`);
      if (baseNotesArr.length > 0) tagsList.push(`base:${baseNotesArr.join(';')}`);

      const images = [];
      if (image_front) {
        const exists = existingImages.some(img => img.src === image_front);
        if (!exists) {
          images.push({ src: image_front });
        }
      }
      existingImages.forEach(img => {
        if (img.src !== image_front) {
          images.push({ id: img.id });
        }
      });

      const updateData = {
        product: {
          id: parseInt(productId, 10),
          title: name,
          body_html: description,
          tags: tagsList.join(', '),
          variants: [
            {
              id: existingProduct.product.variants[0].id,
              price: String(price),
              inventory_quantity: stock !== undefined ? parseInt(stock, 10) : undefined
            }
          ]
        }
      };

      if (images.length > 0) {
        updateData.product.images = images;
      }

      const data = await shopifyAdminRequest(shopifyConfig, `products/${productId}.json`, 'PUT', updateData);
      return res.json(mapShopifyProductToAppFormat(data.product));
    } catch (err) {
      console.warn('⚠️ Shopify product update failed, falling back to local. Error:', err.message);
      return res.status(400).json({ error: `Shopify update failed: ${err.message}` });
    }
  }

  const productId = parseInt(req.params.id, 10);
  try {
    const topNotesArr = Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(n => n.trim()) : ['Citrus', 'Spices']);
    const heartNotesArr = Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(n => n.trim()) : ['Flora', 'Jasmine']);
    const baseNotesArr = Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(n => n.trim()) : ['Musk', 'Amber']);

    const { rows } = await db.query(
      `UPDATE products 
       SET name = $1, price = $2, gender = $3, fragrance_type = $4, occasion = $5, longevity = $6, mood = $7, description = $8, image_front = $9, inspired_by = $10, sillage = $11, projection = $12, stock = COALESCE($13, stock), top_notes = $14, heart_notes = $15, base_notes = $16, similar_to = $17, best_season = $18, best_time = $19
       WHERE id = $20 RETURNING *`,
      [
        name, parseFloat(price), gender, fragrance_type, occasion, longevity, mood, description,
        image_front, inspired_by, sillage || 'Moderate', projection || 'Moderate', stock !== undefined ? parseInt(stock, 10) : null,
        topNotesArr, heartNotesArr, baseNotesArr, similar_to || 'Niche Perfume', best_season || 'All-Season', best_time || 'Day/Night', productId
      ]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(rows[0]);
  } catch (error) {
    console.warn('⚠️ DB product update failed, updating in-memory fallback. Error:', error.message);
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.name = name;
    product.price = parseFloat(price);
    product.gender = gender;
    product.fragrance_type = fragrance_type;
    product.occasion = occasion;
    product.longevity = longevity;
    product.mood = mood;
    product.description = description;
    if (image_front) {
      product.image_front = image_front;
      product.image_side = image_front;
    }
    product.inspired_by = inspired_by;
    product.sillage = sillage || product.sillage || 'Moderate';
    product.projection = projection || product.projection || 'Moderate';
    if (stock !== undefined) {
      product.stock = parseInt(stock, 10);
    }
    product.top_notes = Array.isArray(top_notes) ? top_notes : (top_notes ? top_notes.split(',').map(n => n.trim()) : product.top_notes);
    product.heart_notes = Array.isArray(heart_notes) ? heart_notes : (heart_notes ? heart_notes.split(',').map(n => n.trim()) : product.heart_notes);
    product.base_notes = Array.isArray(base_notes) ? base_notes : (base_notes ? base_notes.split(',').map(n => n.trim()) : product.base_notes);
    product.similar_to = similar_to || product.similar_to || 'Niche Perfume';
    product.best_season = best_season || product.best_season || 'All-Season';
    product.best_time = best_time || product.best_time || 'Day/Night';

    return res.json(product);
  }
});

// Admin Delete product
app.delete('/api/admin/products/:id', async (req, res) => {
  const shopifyConfig = getShopifyConfig();
  if (shopifyConfig) {
    try {
      await shopifyAdminRequest(shopifyConfig, `products/${req.params.id}.json`, 'DELETE');
      return res.json({ success: true, message: 'Product deleted from Shopify successfully' });
    } catch (err) {
      console.warn('⚠️ Shopify product delete failed, falling back to local. Error:', err.message);
      return res.status(400).json({ error: `Shopify delete failed: ${err.message}` });
    }
  }

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

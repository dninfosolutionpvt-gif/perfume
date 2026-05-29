-- Drop tables if they exist
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    gender VARCHAR(50) NOT NULL, -- Men, Women, Unisex
    fragrance_type VARCHAR(50) NOT NULL, -- Woody, Fresh, Citrus, Floral, Musky, Oriental, Aquatic
    occasion VARCHAR(50) NOT NULL, -- Office, Party, Date Night, Summer, Winter, Gym
    longevity VARCHAR(50) NOT NULL, -- 4-6 Hours, 8+ Hours, All Day
    mood VARCHAR(50) NOT NULL, -- Bold, Romantic, Fresh, Elegant
    description TEXT NOT NULL,
    image_front TEXT NOT NULL,
    image_side TEXT,
    image_lifestyle TEXT,
    image_spray TEXT,
    image_box TEXT,
    top_notes TEXT[] NOT NULL,
    heart_notes TEXT[] NOT NULL,
    base_notes TEXT[] NOT NULL,
    sillage VARCHAR(50) NOT NULL, -- Soft, Moderate, Strong, Heavy
    projection VARCHAR(50) NOT NULL, -- Soft, Moderate, Strong
    best_season VARCHAR(50) NOT NULL, -- Summer, Winter, Autumn, Spring, All-Season
    best_time VARCHAR(50) NOT NULL, -- Day, Night, All-Day
    rating DECIMAL(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 10,
    similar_to VARCHAR(100),
    inspired_by VARCHAR(100)
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    status VARCHAR(20) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert Seed Data
INSERT INTO products (
    name, price, gender, fragrance_type, occasion, longevity, mood, description, 
    image_front, image_side, image_lifestyle, image_spray, image_box, 
    top_notes, heart_notes, base_notes, sillage, projection, best_season, best_time, 
    rating, reviews_count, stock, similar_to, inspired_by
) VALUES 
(
    'Oud Midnight', 3499.00, 'Unisex', 'Woody', 'Date Night', '8+ Hours', 'Bold',
    'A rich, hypnotic blend of dark agarwood (oud) and sweet damask rose. Crafted for evening confidence, this fragrance opens with warm saffron, evolving into a heart of sensual rose before settling into a deep, smoky amber and vetiver base.',
    '/images/oud_midnight_front.png', '/images/oud_midnight_side.png', '/images/oud_midnight_life.png', '/images/oud_midnight_spray.png', '/images/oud_midnight_box.png',
    ARRAY['Saffron', 'Nutmeg'], ARRAY['Damask Rose', 'Jasmine'], ARRAY['Oud (Agarwood)', 'Amber', 'Patchouli'],
    'Heavy', 'Strong', 'Winter', 'Night',
    4.9, 142, 8, 'Tom Ford Oud Wood', 'Oud Wood'
),
(
    'Citrus Breeze', 2199.00, 'Men', 'Citrus', 'Gym', '4-6 Hours', 'Fresh',
    'An explosive burst of crisp Mediterranean lemon and bitter bergamot, layered with aromatic marine salts and rosemary. Perfect for a refreshing gym workout or a hot summer day outdoors.',
    '/images/citrus_breeze_front.png', '/images/citrus_breeze_side.png', '/images/citrus_breeze_life.png', '/images/citrus_breeze_spray.png', '/images/citrus_breeze_box.png',
    ARRAY['Calabrian Lemon', 'Bergamot', 'Grapefruit'], ARRAY['Sea Salt', 'Rosemary', 'Lavender'], ARRAY['Oakmoss', 'White Musk', 'Cedarwood'],
    'Moderate', 'Moderate', 'Summer', 'Day',
    4.7, 98, 15, 'Dior Sauvage', 'Dior Sauvage'
),
(
    'Velvet Bloom', 2899.00, 'Women', 'Floral', 'Party', '8+ Hours', 'Romantic',
    'A luxurious, ultra-feminine bouquet of white tuberose, blooming jasmine, and velvet roses, softened by cream-infused vanilla and cashmeran wood. Designed to turn heads at celebrations and evening galas.',
    '/images/velvet_bloom_front.png', '/images/velvet_bloom_side.png', '/images/velvet_bloom_life.png', '/images/velvet_bloom_spray.png', '/images/velvet_bloom_box.png',
    ARRAY['Pink Pepper', 'Pear'], ARRAY['Tuberose', 'Jasmine Sambac', 'Red Rose'], ARRAY['Vanilla', 'Patchouli', 'Cashmere Wood'],
    'Strong', 'Strong', 'Spring', 'Night',
    4.8, 86, 7, 'Armani My Way', 'My Way'
),
(
    'Sandalwood Monarch', 3299.00, 'Men', 'Woody', 'Office', 'All Day', 'Elegant',
    'Sophisticated and authoritative. A warm, creamy Indian sandalwood core, sharpened by dry cedar and spiced cardamom. The ideal companion for high-profile business meetings and daily office prestige.',
    '/images/sandalwood_monarch_front.png', '/images/sandalwood_monarch_side.png', '/images/sandalwood_monarch_life.png', '/images/sandalwood_monarch_spray.png', '/images/sandalwood_monarch_box.png',
    ARRAY['Cardamom', 'Violet Accord'], ARRAY['Papyrus', 'Iris'], ARRAY['Sandalwood', 'Cedarwood', 'Leather'],
    'Moderate', 'Strong', 'Autumn', 'All-Day',
    4.9, 114, 9, 'Santal 33', 'Le Labo Santal 33'
),
(
    'Blue Vague', 2499.00, 'Unisex', 'Aquatic', 'Summer', '4-6 Hours', 'Fresh',
    'An endless summer in a bottle. Shimmering marine accords, ozone, and wet stones meet the warmth of sun-bleached driftwood, vetiver, and crisp pine needles. Clean, breezy, and refreshing.',
    '/images/blue_vague_front.png', '/images/blue_vague_side.png', '/images/blue_vague_life.png', '/images/blue_vague_spray.png', '/images/blue_vague_box.png',
    ARRAY['Marine Accord', 'Grapefruit'], ARRAY['Seaweed', 'Eucalyptus', 'Sage'], ARRAY['Driftwood', 'Ambrette Seeds', 'Vetiver'],
    'Moderate', 'Moderate', 'Summer', 'Day',
    4.6, 74, 12, 'Jo Malone Wood Sage & Sea Salt', 'Wood Sage & Sea Salt'
),
(
    'Nuit Noir', 3599.00, 'Women', 'Oriental', 'Date Night', 'All Day', 'Bold',
    'Seductive, mysterious, and intoxicating. Rich, dark roasted coffee beans combined with sweet vanilla pod absolute, orange blossom, and a base of smooth white musk. A true masterpiece for intimate night-outs.',
    '/images/nuit_noir_front.png', '/images/nuit_noir_side.png', '/images/nuit_noir_life.png', '/images/nuit_noir_spray.png', '/images/nuit_noir_box.png',
    ARRAY['Pear', 'Orange Blossom'], ARRAY['Coffee Beans', 'Bitter Almond', 'Licorice'], ARRAY['Vanilla', 'Patchouli', 'Cedarwood', 'Cashmere'],
    'Strong', 'Strong', 'Winter', 'Night',
    4.9, 156, 5, 'YSL Black Opium', 'Black Opium'
);

-- Seed Reviews
INSERT INTO reviews (product_id, user_name, rating, comment) VALUES 
(1, 'Aarav Mehta', 5, 'Absolutely exquisite! The oud has a very smooth opening and stays on my skin for more than 10 hours. Definitely buying another bottle.'),
(1, 'Priya Sharma', 5, 'Smells very premium, like a niche perfume. The rose and saffron combination is gorgeous.'),
(2, 'Kabir Malhotra', 4, 'Very fresh and uplifting. Great for everyday use, especially before gym workouts.'),
(3, 'Neha Patel', 5, 'I wore this to a wedding reception and got so many compliments! It has a heavy, elegant floral trail.'),
(4, 'Rohan Das', 5, 'Extremely professional and clean sandalwood scent. Perfect for office wear. Worth every rupee.'),
(5, 'Vikram Singh', 4, 'Very refreshing and natural salty beach scent. I wish it lasted a bit longer, but it is great for hot summer days.'),
(6, 'Ananya Sen', 5, 'This is pure luxury in a bottle. The coffee and vanilla make a beautiful intoxicating combo.');

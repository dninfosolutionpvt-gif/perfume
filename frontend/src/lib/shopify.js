/**
 * Shopify Storefront API Client
 * Store: h216uz-7z.myshopify.com
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'h216uz-7z.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '6a708829d7bd5d54443256ff4c079e55';
const SHOPIFY_API_VERSION = '2024-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Core GraphQL fetcher
async function shopifyFetch(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

// ─── Product Fragment ─────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantCompareAtPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          handle
          title
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "gender" },
      { namespace: "custom", key: "fragrance_type" },
      { namespace: "custom", key: "occasion" },
      { namespace: "custom", key: "longevity" },
      { namespace: "custom", key: "mood" },
      { namespace: "custom", key: "sillage" },
      { namespace: "custom", key: "projection" },
      { namespace: "custom", key: "top_notes" },
      { namespace: "custom", key: "heart_notes" },
      { namespace: "custom", key: "base_notes" },
      { namespace: "custom", key: "inspired_by" },
      { namespace: "custom", key: "best_season" },
      { namespace: "custom", key: "best_time" },
      { namespace: "custom", key: "rating" },
      { namespace: "custom", key: "reviews_count" }
    ]) {
      key
      value
    }
  }
`;

// ─── Transform Shopify Product → App Format ──────────────────────────

export function transformProduct(shopifyProduct) {
  const images = shopifyProduct.images.edges.map(e => e.node.url);

  // All variants with full detail
  const variants = shopifyProduct.variants.edges.map(e => ({
    id: e.node.id,
    title: e.node.title,
    price: parseFloat(e.node.price?.amount || 0),
    compareAtPrice: e.node.compareAtPrice ? parseFloat(e.node.compareAtPrice.amount) : null,
    quantityAvailable: e.node.quantityAvailable ?? 0,
    availableForSale: e.node.availableForSale,
    selectedOptions: e.node.selectedOptions || [],
  }));

  const firstVariant = variants[0];
  const price = firstVariant?.price ?? parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const compareAtPrice = firstVariant?.compareAtPrice ?? null;
  const stock = firstVariant?.quantityAvailable ?? 10;

  // Collections as array of titles
  const collections = (shopifyProduct.collections?.edges || []).map(e => e.node.title);

  // Extract metafields into a map
  const meta = {};
  (shopifyProduct.metafields || []).forEach(m => {
    if (m) meta[m.key] = m.value;
  });

  // Parse notes — stored as JSON array string or comma-separated
  const parseNotes = (val) => {
    if (!val) return [];
    try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()); }
  };

  // Extract numeric ID from Shopify GID
  const numericId = shopifyProduct.id.split('/').pop();

  return {
    id: numericId,
    shopifyId: shopifyProduct.id,
    variantId: firstVariant?.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price,
    compareAtPrice,
    stock,
    vendor: shopifyProduct.vendor || '',
    productType: shopifyProduct.productType || '',
    tags: shopifyProduct.tags || [],
    collections,
    options: shopifyProduct.options || [],
    variants,
    image_front: images[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    image_side: images[1] || images[0] || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    image_lifestyle: images[2] || images[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    image_spray: images[3] || images[0] || 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600',
    image_box: images[4] || images[0] || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
    allImages: images,
    gender: meta.gender || 'Unisex',
    fragrance_type: meta.fragrance_type || shopifyProduct.tags?.find(t => ['Woody','Floral','Oriental','Aquatic','Fresh','Citrus','Musky'].includes(t)) || 'Floral',
    occasion: meta.occasion || 'All Occasions',
    longevity: meta.longevity || '8+ Hours',
    mood: meta.mood || 'Elegant',
    sillage: meta.sillage || 'Moderate',
    projection: meta.projection || 'Moderate',
    top_notes: parseNotes(meta.top_notes),
    heart_notes: parseNotes(meta.heart_notes),
    base_notes: parseNotes(meta.base_notes),
    inspired_by: meta.inspired_by || shopifyProduct.tags?.join(', ') || 'Original Formula',
    best_season: meta.best_season || 'All-Season',
    best_time: meta.best_time || 'Day/Night',
    rating: parseFloat(meta.rating) || 4.9,
    reviews_count: parseInt(meta.reviews_count) || 0,
    similar_to: 'Niche Perfume',
  };
}

// ─── API Functions ────────────────────────────────────────────────────

// Get all products (with optional limit/query)
export async function getProducts({ first = 50, query = '' } = {}) {
  const data = await shopifyFetch(`
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `, { first, query });

  return data.products.edges.map(e => transformProduct(e.node));
}

// Get all collections from Shopify
export async function getCollections({ first = 50 } = {}) {
  const data = await shopifyFetch(`
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `, { first });

  return data.collections.edges.map(e => e.node);
}

// Get products within a specific collection by handle
export async function getProductsByCollection(collectionHandle, { first = 50 } = {}) {
  const data = await shopifyFetch(`
    ${PRODUCT_FRAGMENT}
    query GetProductsByCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        handle
        title
        products(first: $first) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    }
  `, { handle: collectionHandle, first });

  if (!data.collection) return [];
  return data.collection.products.edges.map(e => transformProduct(e.node));
}

// Get single product by handle (preferred) or numeric ID fallback
export async function getProductByHandle(handle) {
  const data = await shopifyFetch(`
    ${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `, { handle: String(handle) });

  if (data.product) return transformProduct(data.product);
  return null;
}

// Get single product by handle or numeric ID (backwards compatible)
export async function getProduct(idOrHandle) {
  // Try by handle first
  const byHandle = await getProductByHandle(String(idOrHandle));
  if (byHandle) return byHandle;

  // Fallback: fetch all and find by numeric ID
  const all = await getProducts({ first: 50 });
  return all.find(p => String(p.id) === String(idOrHandle)) || null;
}

// ─── Cart API ─────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    lines(first: 30) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              product {
                title
                handle
                images(first: 1) { edges { node { url } } }
              }
            }
          }
        }
      }
    }
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
  }
`;

// Create a new cart
export async function createCart(lines = []) {
  const data = await shopifyFetch(`
    ${CART_FRAGMENT}
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `, {
    input: {
      lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity }))
    }
  });

  return data.cartCreate.cart;
}

// Add item to existing cart
export async function addToCart(cartId, variantId, quantity = 1) {
  const data = await shopifyFetch(`
    ${CART_FRAGMENT}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] });

  return data.cartLinesAdd.cart;
}

// Remove item from cart
export async function removeFromCart(cartId, lineId) {
  const data = await shopifyFetch(`
    ${CART_FRAGMENT}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `, { cartId, lineIds: [lineId] });

  return data.cartLinesRemove.cart;
}

// Update item quantity in cart
export async function updateCartLine(cartId, lineId, quantity) {
  const data = await shopifyFetch(`
    ${CART_FRAGMENT}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] });

  return data.cartLinesUpdate.cart;
}

// Get existing cart by ID
export async function getCart(cartId) {
  const data = await shopifyFetch(`
    ${CART_FRAGMENT}
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
  `, { cartId });

  return data.cart;
}

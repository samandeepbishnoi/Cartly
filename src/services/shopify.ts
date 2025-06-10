// Shopify Storefront API Service
// This file handles all communication with Shopify's Storefront API
// for fetching products, managing carts, and handling checkout

const SHOPIFY_DOMAIN = 'storecartly1.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'b6f576526210f9f249e94c2789eba903';

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2025-04/graphql.json`;

/**
 * GraphQL Response Interface
 * Defines the structure of responses from Shopify's GraphQL API
 */
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

/**
 * Generic function to make GraphQL requests to Shopify Storefront API
 * @param query - GraphQL query string
 * @param variables - Variables for the GraphQL query
 * @returns Promise with the response data
 */
async function shopifyFetch<T>(query: string, variables?: any): Promise<T> {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

// -------------------------------- GraphQL Queries -------------------------------- //

/**
 * Query to fetch multiple products with their variants and images
 */
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          tags
          vendor
          productType
          createdAt
          updatedAt
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to fetch a single product by handle
 */
const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      vendor
      productType
      createdAt
      updatedAt
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
            }
          }
        }
      }
    }
  }
`;

/**
 * Mutation to create a new cart
 */
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to add lines to an existing cart
 */
const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to update cart line quantities
 */
const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to remove lines from cart
 */
const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// -------------------------------- API Functions -------------------------------- //

/**
 * Fetch products from Shopify store
 * @param first - Number of products to fetch
 * @param query - Optional search query
 */
export async function getProducts(first: number = 20, query?: string) {
  return shopifyFetch(PRODUCTS_QUERY, { first, query });
}

/**
 * Fetch a single product by handle
 * @param handle - Product handle (URL slug)
 */
export async function getProduct(handle: string) {
  return shopifyFetch(PRODUCT_QUERY, { handle });
}

/**
 * Create a new cart with initial line items
 * @param lines - Array of merchandise IDs and quantities
 */
export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  return shopifyFetch(CART_CREATE_MUTATION, {
    input: { lines }
  });
}

/**
 * Add items to an existing cart
 * @param cartId - Shopify cart ID
 * @param lines - Array of merchandise IDs and quantities to add
 */
export async function addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  return shopifyFetch(CART_LINES_ADD_MUTATION, { cartId, lines });
}

/**
 * Update quantities of existing cart lines
 * @param cartId - Shopify cart ID
 * @param lines - Array of line IDs and new quantities
 */
export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  return shopifyFetch(CART_LINES_UPDATE_MUTATION, { cartId, lines });
}

/**
 * Remove lines from cart
 * @param cartId - Shopify cart ID
 * @param lineIds - Array of line IDs to remove
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  return shopifyFetch(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
}

// -------------------------------- Mock Data -------------------------------- //

/**
 * Mock product data for development and fallback
 * Used when Shopify API is not configured or fails
 * Prices are in Indian Rupees for local market
 */
export const mockProducts = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Premium Wireless Headphones',
    handle: 'premium-wireless-headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation.',
    descriptionHtml: '<p>Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation.</p>',
    tags: ['electronics', 'headphones', 'wireless'],
    vendor: 'AudioTech',
    productType: 'Electronics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    images: {
      edges: [
        {
          node: {
            id: 'img1',
            url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
            altText: 'Premium Wireless Headphones'
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Black',
            price: { amount: '24999.99', currencyCode: 'INR' }, // ₹24,999.99
            compareAtPrice: { amount: '32999.99', currencyCode: 'INR' }, // ₹32,999.99
            availableForSale: true,
            selectedOptions: [{ name: 'Color', value: 'Black' }],
            image: {
              id: 'img1',
              url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
              altText: 'Premium Wireless Headphones - Black'
            }
          }
        }
      ]
    }
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Smart Fitness Watch',
    handle: 'smart-fitness-watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    descriptionHtml: '<p>Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.</p>',
    tags: ['fitness', 'smartwatch', 'wearable'],
    vendor: 'FitTech',
    productType: 'Wearables',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    images: {
      edges: [
        {
          node: {
            id: 'img2',
            url: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
            altText: 'Smart Fitness Watch'
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/2',
            title: 'Silver / 42mm',
            price: { amount: '16599.99', currencyCode: 'INR' }, // ₹16,599.99
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Silver' },
              { name: 'Size', value: '42mm' }
            ],
            image: {
              id: 'img2',
              url: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
              altText: 'Smart Fitness Watch - Silver'
            }
          }
        }
      ]
    }
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Minimalist Desk Lamp',
    handle: 'minimalist-desk-lamp',
    description: 'Illuminate your workspace with this sleek, adjustable LED desk lamp with touch controls.',
    descriptionHtml: '<p>Illuminate your workspace with this sleek, adjustable LED desk lamp with touch controls.</p>',
    tags: ['home', 'lighting', 'office'],
    vendor: 'ModernHome',
    productType: 'Home & Garden',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    images: {
      edges: [
        {
          node: {
            id: 'img3',
            url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
            altText: 'Minimalist Desk Lamp'
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/3',
            title: 'White',
            price: { amount: '7499.99', currencyCode: 'INR' }, // ₹7,499.99
            availableForSale: true,
            selectedOptions: [{ name: 'Color', value: 'White' }],
            image: {
              id: 'img3',
              url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
              altText: 'Minimalist Desk Lamp - White'
            }
          }
        }
      ]
    }
  }
];

/**
 * Mock reviews data for development
 * In production, this would come from a reviews API or Shopify metafields
 */
export const mockReviews = [
  {
    id: '1',
    author: 'Priya Sharma',
    rating: 5,
    title: 'Excellent quality and sound!',
    content: 'These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is amazing.',
    date: '2024-12-15',
    verified: true
  },
  {
    id: '2',
    author: 'Rahul Kumar',
    rating: 4,
    title: 'Great value for money',
    content: 'Really happy with this purchase. Comfortable to wear for long periods and great sound quality.',
    date: '2024-12-10',
    verified: true
  },
  {
    id: '3',
    author: 'Anita Patel',
    rating: 5,
    title: 'Perfect for work from home',
    content: 'The noise cancellation makes it perfect for video calls. Highly recommend!',
    date: '2024-12-08',
    verified: false
  }
];
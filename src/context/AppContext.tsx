import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { CartLineItem, ShopifyProduct } from '../types/shopify';

const SHOPIFY_DOMAIN = 'storecartly1.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'b6f576526210f9f249e94c2789eba903';
const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2025-04/graphql.json`;

// -------------------------------- Analytics -------------------------------- //
export const analytics = {
  productViewed: (product: ShopifyProduct) => {
    console.log('📊 Analytics: Product Viewed', {
      productId: product.id,
      title: product.title,
      timestamp: new Date().toISOString(),
    });
  },
  addToCart: (product: ShopifyProduct, variantId: string, quantity: number) => {
    console.log('📊 Analytics: Add to Cart', {
      productId: product.id,
      variantId,
      quantity,
      title: product.title,
      timestamp: new Date().toISOString(),
    });
  },
  checkoutInitiated: (cartTotal: number, itemCount: number) => {
    console.log('📊 Analytics: Checkout Initiated', {
      cartTotal,
      itemCount,
      timestamp: new Date().toISOString(),
    });
  },
};

// ------------------------------- State Types ------------------------------- //
interface AppState {
  isDarkMode: boolean;
  products: ShopifyProduct[];
  isLoadingProducts: boolean;
  searchQuery: string;
  selectedTags: string[];
  cartItems: CartLineItem[];
  isCartOpen: boolean;
  cartId: string | null;
  isOnline: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
  }>;
}

type AppAction =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_PRODUCTS'; payload: ShopifyProduct[] }
  | { type: 'SET_LOADING_PRODUCTS'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'ADD_TO_CART'; payload: CartLineItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { variantId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'TOGGLE_SAVE_FOR_LATER'; payload: string }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_ID'; payload: string }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info'; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'LOAD_CART_FROM_STORAGE'; payload: CartLineItem[] };

const initialState: AppState = {
  isDarkMode: false,
  products: [],
  isLoadingProducts: false,
  searchQuery: '',
  selectedTags: [],
  cartItems: [],
  isCartOpen: false,
  cartId: null,
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  notifications: [],
};

// ------------------------------- Reducer Logic ----------------------------- //
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_LOADING_PRODUCTS':
      return { ...state, isLoadingProducts: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(
        (item) => item.variantId === action.payload.variantId && !item.savedForLater
      );
      const newCartItems = existingItem
        ? state.cartItems.map((item) =>
            item.variantId === action.payload.variantId && !item.savedForLater
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        : [...state.cartItems, action.payload];
      return { ...state, cartItems: newCartItems };
    }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.variantId !== action.payload),
      };
    case 'TOGGLE_SAVE_FOR_LATER':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.variantId === action.payload
            ? { ...item, savedForLater: !item.savedForLater }
            : item
        ),
      };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'SET_CART_ID':
      return { ...state, cartId: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'ADD_NOTIFICATION': {
      const id = Date.now().toString();
      const timestamp = Date.now();
      const newNotification = { id, timestamp, ...action.payload };
      
      // Limit to maximum 3 notifications to prevent overwhelming the user
      const updatedNotifications = [...state.notifications, newNotification];
      const limitedNotifications = updatedNotifications.slice(-3);
      
      return {
        ...state,
        notifications: limitedNotifications,
      };
    }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notif) => notif.id !== action.payload
        ),
      };
    case 'LOAD_CART_FROM_STORAGE':
      return { ...state, cartItems: action.payload };
    default:
      return state;
  }
}

// ------------------------------- Context Setup ----------------------------- //
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartly-cart');
    const savedDarkMode = localStorage.getItem('cartly-darkMode');

    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART_FROM_STORAGE', payload: JSON.parse(savedCart) });
      } catch (err) {
        console.error('Cart load error', err);
      }
    }
    if (savedDarkMode === 'true') {
      dispatch({ type: 'TOGGLE_DARK_MODE' });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartly-cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  useEffect(() => {
    localStorage.setItem('cartly-darkMode', state.isDarkMode.toString());
    document.documentElement.classList.toggle('dark', state.isDarkMode);
  }, [state.isDarkMode]);

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Improved notification timeout management with staggered timeouts
  useEffect(() => {
    if (state.notifications.length === 0) return;

    const timeouts: NodeJS.Timeout[] = [];

    state.notifications.forEach((notification, index) => {
      // Calculate timeout based on position and age
      const age = Date.now() - notification.timestamp;
      const baseTimeout = 3000; // 3 seconds base timeout
      const stackDelay = index * 500; // 500ms delay for each position in stack
      const adjustedTimeout = Math.max(baseTimeout - age + stackDelay, 1000); // Minimum 1 second

      const timeout = setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, adjustedTimeout);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// ------------------------------ Cart Helper Hook ------------------------------ //
export function useCart() {
  const { state, dispatch } = useApp();

  const activeCartItems = state.cartItems.filter((item) => !item.savedForLater);
  const savedItems = state.cartItems.filter((item) => item.savedForLater);

  const cartTotal = activeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = activeCartItems.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product: ShopifyProduct, variantId: string, quantity = 1) => {
    const variant = product.variants.edges.find((v) => v.node.id === variantId)?.node;
    if (!variant) return;

    const cartItem: CartLineItem = {
      variantId,
      productId: product.id,
      title: product.title,
      variant: variant.title,
      price: parseFloat(variant.price.amount),
      compareAtPrice: variant.compareAtPrice
        ? parseFloat(variant.compareAtPrice.amount)
        : undefined,
      quantity,
      image: variant.image?.url || product.images.edges[0]?.node.url || '',
      availableForSale: variant.availableForSale,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    analytics.addToCart(product, variantId, quantity);

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'success', message: `${product.title} added to cart!` },
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { variantId, quantity } });
  };

  const removeFromCart = (variantId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: variantId });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'info', message: 'Item removed from cart' },
    });
  };

  const toggleSaveForLater = (variantId: string) => {
    dispatch({ type: 'TOGGLE_SAVE_FOR_LATER', payload: variantId });
  };

  const initiateCheckout = async () => {
  analytics.checkoutInitiated(cartTotal, itemCount);

  try {
    const lineItems = activeCartItems.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables: { input: { lines: lineItems } } }),
    });

    const result = await response.json();
    const url = result?.data?.cartCreate?.cart?.checkoutUrl;
    const errors = result?.data?.cartCreate?.userErrors;

    if (errors?.length) throw new Error(errors[0].message);
    if (!url) throw new Error('Checkout URL not found');

    return url;
  } catch (error: any) {
    console.error('Checkout error:', error);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'error', message: 'Checkout failed: ' + error.message },
    });
  }
};


  return {
    cartItems: activeCartItems,
    savedItems,
    cartTotal,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleSaveForLater,
    initiateCheckout,
  };
}
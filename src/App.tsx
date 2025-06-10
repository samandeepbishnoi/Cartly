import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { NotificationContainer } from './components/layout/NotificationContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductFilters } from './components/products/ProductFilters';
import { ProductGrid } from './components/products/ProductGrid';
import { ProductDetail } from './components/products/ProductDetail';
import { Footer } from './components/layout/Footer'; // ✅ imported Footer
import { ShopifyProduct } from './types/shopify';
import { getProducts, mockProducts } from './services/shopify';

function AppContent() {
  const { state, dispatch } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'SET_LOADING_PRODUCTS', payload: true });
      try {
        const data = await getProducts(20);
        const products = data.products.edges.map(edge => edge.node);
        if (products.length > 0) {
          dispatch({ type: 'SET_PRODUCTS', payload: products });
        } else {
          dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
          dispatch({
            type: 'NOTIFICATION',
            payload: { type: 'info', message: 'No products found in store. Using demo products.' }
          });
        }
      } catch (error) {
        console.error('Failed to load products from Shopify:', error);
        dispatch({
          type: 'NOTIFICATION',
          payload: { type: 'error', message: 'Failed to connect to Shopify. Using demo products.' }
        });
        dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
      } finally {
        dispatch({ type: 'SET_LOADING_PRODUCTS', payload: false });
      }
    };

    loadProducts();
  }, [dispatch]);

  const handleProductClick = (product: ShopifyProduct) => setSelectedProduct(product);
  const handleBackToProducts = () => setSelectedProduct(null);
  const handleLogoClick = () => {
    setSelectedProduct(null);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_SELECTED_TAGS', payload: [] });
  };

  // Handle clicks on the main app container to close cart if open
  const handleAppClick = (e: React.MouseEvent) => {
    // Only close cart if clicking on the main app area and cart is open
    // Don't close if clicking on header, cart, or other interactive elements
    if (state.isCartOpen && e.target === e.currentTarget) {
      dispatch({ type: 'TOGGLE_CART' });
    }
  };

  return (
    <div 
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${
        state.isDarkMode ? 'dark' : ''
      }`}
      onClick={handleAppClick}
    >
      <Header onLogoClick={handleLogoClick} />
      <NotificationContainer />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={handleBackToProducts} />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Cartly Premium Products
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover our curated collection of high-quality products designed to enhance your lifestyle.
              </p>
            </motion.div>

            <ProductFilters />
            <ProductGrid onProductClick={handleProductClick} />
          </>
        )}
      </main>

      <Footer /> {/* ✅ used Footer */}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
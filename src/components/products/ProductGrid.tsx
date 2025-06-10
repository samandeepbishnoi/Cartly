import React from 'react';
import { motion } from 'framer-motion';
import { ShopifyProduct } from '../../types/shopify';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/LoadingSkeleton';

interface ProductGridProps {
  onProductClick: (product: ShopifyProduct) => void;
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const { state } = useApp();

  // Filter products based on search query and selected tags
  const filteredProducts = state.products.filter((product) => {
    const matchesSearch = state.searchQuery === '' || 
      product.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()));

    const matchesTags = state.selectedTags.length === 0 ||
      state.selectedTags.some(selectedTag => product.tags.includes(selectedTag));

    return matchesSearch && matchesTags;
  });

  if (state.isLoadingProducts) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {state.searchQuery || state.selectedTags.length > 0
              ? "Try adjusting your search or filters to find what you're looking for."
              : "No products are currently available."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard product={product} onProductClick={onProductClick} />
        </motion.div>
      ))}
    </motion.div>
  );
}
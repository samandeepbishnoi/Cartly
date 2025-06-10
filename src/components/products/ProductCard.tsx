import React , {useState} from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { ShopifyProduct } from '../../types/shopify';
import { useCart, analytics } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: ShopifyProduct;
  onProductClick: (product: ShopifyProduct) => void;
}

/**
 * ProductCard Component
 * 
 * Displays individual product information in a card format.
 * Features:
 * - Product image with hover effects
 * - Price display with sale indicators
 * - Quick add to cart functionality
 * - Product ratings and reviews
 * - Responsive design with animations
 */
export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();

  // Get the first variant and image for display
  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;
  
  // Calculate pricing information
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const compareAtPrice = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isOnSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Handle adding product to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering product click
    e.preventDefault();
    if (firstVariant) {
      addToCart(product, firstVariant.id);
    }
  };

  // Handle product click for detailed view
  const handleProductClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    analytics.productViewed(product);
    onProductClick(product);
  };

  // Handle wishlist click
  const [isLiked, setIsLiked] = useState(false);
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked((prev) => !prev);
    // Wishlist functionality would go here
  };

  // Static rating for consistency (in real app, this would come from API)
  const rating = 4.5;
  const reviewCount = 47;


  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={handleProductClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Fallback when no image is available
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <Badge variant="error" className="absolute top-3 left-3">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Wishlist Button - Appears on hover */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleWishlistClick}
        >
          <Heart
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          color={isLiked ? "red" : "currentColor"}
                          fill={isLiked ? "red" : "none"}
                        />
          
        </motion.button>

        {/* Quick Add Button - Appears on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {firstVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </motion.div>
      </div>

      {/* Product Information */}
      <div className="p-4">
        {/* Brand/Vendor */}
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.vendor}
        </p>

        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : i < rating
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(price)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
          {firstVariant && !firstVariant.availableForSale && (
            <Badge variant="error" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Product Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Check,
  Truck,
} from "lucide-react";
import { ShopifyProduct, ShopifyVariant } from "../../types/shopify";
import { useCart } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface ProductDetailProps {
  product: ShopifyProduct;
  onBack: () => void;
}

/**
 * Static reviews data - Prevents changes on re-renders
 * In a real application, this would come from an API
 */
const staticReviews = [
  {
    id: "1",
    author: "Priya Sharma",
    rating: 5,
    title: "Excellent quality and sound!",
    content:
      "These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is amazing.",
    date: "2024-12-15",
    verified: true,
  },
  {
    id: "2",
    author: "Rahul Kumar",
    rating: 4,
    title: "Great value for money",
    content:
      "Really happy with this purchase. Comfortable to wear for long periods and great sound quality.",
    date: "2024-12-10",
    verified: true,
  },
  {
    id: "3",
    author: "Anita Patel",
    rating: 5,
    title: "Perfect for work from home",
    content:
      "The noise cancellation makes it perfect for video calls. Highly recommend!",
    date: "2024-12-08",
    verified: false,
  },
  {
    id: "4",
    author: "Vikram Singh",
    rating: 4,
    title: "Solid build quality",
    content:
      "Well-constructed and durable. The sound quality is crisp and clear.",
    date: "2024-12-05",
    verified: true,
  },
  {
    id: "5",
    author: "Meera Reddy",
    rating: 5,
    title: "Amazing product!",
    content:
      "Exceeded all my expectations. Would definitely recommend to others.",
    date: "2024-12-01",
    verified: true,
  },
];

/**
 * ProductDetail Component
 *
 * Displays comprehensive product information including:
 * - Product images with thumbnail navigation
 * - Variant selection (size, color, etc.)
 * - Pricing and availability
 * - Add to cart functionality
 * - Customer reviews and ratings
 * - Product features and specifications
 */
export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();

  // Component state
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant>(
    product.variants.edges[0]?.node
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Memoize the average rating calculation to prevent changes on re-renders
  const averageRating = useMemo(() => {
    return (
      staticReviews.reduce((sum, review) => sum + review.rating, 0) /
      staticReviews.length
    );
  }, []);

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Calculate pricing information
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant.id, quantity);
    }
  };

  // Get unique option names and values for variant selection
  const options = product.variants.edges.reduce((acc, { node }) => {
    node.selectedOptions.forEach((option) => {
      if (!acc[option.name]) {
        acc[option.name] = new Set();
      }
      acc[option.name].add(option.value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  // Handle variant option changes
  const handleOptionChange = (optionName: string, optionValue: string) => {
    const newVariant = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === optionValue
      )
    )?.node;

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Back Navigation Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Product Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {product.images.edges.length > 0 ? (
              <img
                src={product.images.edges[selectedImageIndex]?.node.url}
                alt={
                  product.images.edges[selectedImageIndex]?.node.altText ||
                  product.title
                }
                className="w-full h-full object-cover"
              />
            ) : (
              // Fallback when no images available
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.edges.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.edges.slice(0, 4).map((image, index) => (
                <button
                  key={image.node.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={image.node.url}
                    alt={image.node.altText || `${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {product.vendor}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>

            {/* Rating and Reviews Summary */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : i < averageRating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {averageRating.toFixed(1)} ({staticReviews.length} reviews)
              </span>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(price)}
            </span>
            {isOnSale && compareAtPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
                <Badge variant="error">Save {discountPercentage}%</Badge>
              </>
            )}
          </div>

          {/* Product Options (Size, Color, etc.) */}
          {Object.entries(options).map(([optionName, values]) => (
            <div key={optionName}>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {optionName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(values).map((value) => {
                  const isSelected = selectedVariant?.selectedOptions.some(
                    (opt) => opt.name === optionName && opt.value === value
                  );
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionName, value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Quantity
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                -
              </button>
              <span className="text-lg font-medium w-12 text-center text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {selectedVariant?.availableForSale
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>

            {/* Like Button */}
            <Button
              variant="outline"
              size="lg"
              className="px-6"
              onClick={handleLikeToggle}
            >
              <Heart
                className="w-5 h-5"
                color={isLiked ? "red" : "currentColor"}
                fill={isLiked ? "red" : "none"}
              />
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              size="lg"
              className="px-6"
              onClick={() => {
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl);
                alert("Product link copied to clipboard!");
              }}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Features */}
          <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Free shipping on orders over ₹2,000
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Fast 2-3 day delivery across India
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                30-day return policy
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 [&_*]:text-inherit [&_h1,h2,h3]:text-gray-900 dark:[&_h1,h2,h3]:text-white"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml || product.description,
              }}
            />
          </div>

          {/* Product Tags */}
          {product.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Customer Reviews
          </h2>

          {/* Review Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? "text-yellow-400 fill-current"
                            : i < averageRating
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Based on {staticReviews.length} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-8">
            {staticReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.author}
                      </h4>
                      {review.verified && (
                        <Badge variant="success" size="sm">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h5>
                <p className="text-gray-600 dark:text-gray-400">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

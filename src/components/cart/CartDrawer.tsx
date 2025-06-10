import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Heart, Trash2 } from "lucide-react";
import { useApp, useCart } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

/**
 * CartDrawer Component
 *
 * A sliding cart drawer that displays cart items, saved items, and checkout functionality.
 * Features:
 * - Add/remove items from cart
 * - Update item quantities
 * - Save items for later
 * - Checkout integration with Shopify
 * - Responsive design with animations
 */
export function CartDrawer() {
  const { state, dispatch } = useApp();
  const {
    cartItems,
    savedItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    toggleSaveForLater,
    initiateCheckout,
  } = useCart();

  // Close the cart drawer
  const closeCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  // Handle backdrop click - only close if clicking the backdrop itself
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click target is the backdrop itself
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Handle checkout process - creates Shopify cart and redirects to checkout
  const handleCheckout = async () => {
    try {
      const checkoutUrl = await initiateCheckout();
      if (checkoutUrl) {
        // Open checkout in new tab/window
        window.open(checkoutUrl, "_blank");

        // Show success notification
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: { type: "success", message: "Redirecting to checkout..." },
        });

        // Close cart drawer
        closeCart();
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          type: "error",
          message: "Failed to initiate checkout. Please try again.",
        },
      });
    }
  };

  // Handle save for later with proper event handling
  const handleSaveForLater = (e: React.MouseEvent, variantId: string) => {
    e.stopPropagation();
    e.preventDefault();
    toggleSaveForLater(variantId);
  };

  // Handle remove from cart with proper event handling
  const handleRemoveFromCart = (e: React.MouseEvent, variantId: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(variantId);
  };

  // Handle quantity update with proper event handling
  const handleQuantityUpdate = (
    e: React.MouseEvent,
    variantId: string,
    newQuantity: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    updateQuantity(variantId, newQuantity);
  };

  // Don't render anything if cart is not open
  if (!state.isCartOpen) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {/* Backdrop - Click to close cart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        style={{ pointerEvents: "auto" }}
      />

      {/* Cart Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-[101] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside drawer from bubbling to backdrop
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Shopping Cart ({cartItems.length + savedItems.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={closeCart} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Empty Cart State */}
          {cartItems.length === 0 && savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Cart Items Section */}
              {cartItems.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Cart Items
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.variantId}
                        layout
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.variant}
                          </p>

                          {/* Quantity Controls and Price */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls - Fixed styling for better visibility */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) =>
                                  handleQuantityUpdate(
                                    e,
                                    item.variantId,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 w-9 h-9 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-5 h-5" />
                              </Button>

                              <span className="text-sm font-medium min-w-[2rem] text-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {item.quantity}
                              </span>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) =>
                                  handleQuantityUpdate(
                                    e,
                                    item.variantId,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1 w-9 h-9 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                              >
                                <Plus className="w-5 h-5" />
                              </Button>
                            </div>

                            {/* Price Display */}
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              {item.compareAtPrice && (
                                <p className="text-xs text-gray-500 line-through">
                                  {formatPrice(
                                    item.compareAtPrice * item.quantity
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleSaveForLater(e, item.variantId)
                              }
                              className="text-xs p-1 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              Save for later
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleRemoveFromCart(e, item.variantId)
                              }
                              className="text-xs p-1 h-auto text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Items Section */}
              {savedItems.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Saved for Later ({savedItems.length})
                  </h3>
                  <div className="space-y-3">
                    {savedItems.map((item) => (
                      <motion.div
                        key={`saved-${item.variantId}`}
                        layout
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-75"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.variant}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleSaveForLater(e, item.variantId)
                              }
                              className="text-xs p-1 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Move to cart
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleRemoveFromCart(e, item.variantId)
                              }
                              className="text-xs p-1 h-auto text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart Footer - Checkout Section */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Total and Item Count */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total: {formatPrice(cartTotal)}
              </span>
              <Badge variant="info" size="md">
                {cartItems.reduce((count, item) => count + item.quantity, 0)}{" "}
                items
              </Badge>
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleCheckout}
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
              Store is secured by Shopify. Use password <strong className="font-semibold text-gray-700 dark:text-gray-300">"rotsee"</strong>.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              You'll be redirected to Shopify's secure checkout.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

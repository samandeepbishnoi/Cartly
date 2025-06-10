# Cartly – Shopify Product Page Web App

Cartly is a modern, production-ready Shopify Product Page Web App built with React, TypeScript, and Tailwind CSS, fully integrated with Shopify's Storefront API. It delivers advanced e-commerce features, an exceptional user experience, and optimized performance for real-world deployment.

## 🌟 Features

### Core Functionality
- ✅ **Product Browsing**: Browse products from Shopify development store
- ✅ **Product Details**: View comprehensive product information with images, variants, and descriptions
- ✅ **Cart Management**: Add, update, and remove items from cart
- ✅ **Checkout Integration**: Seamless integration with Shopify-hosted checkout
- ✅ **Shopify Storefront API**: Real-time product data and cart management

### Advanced Features
- 🛍️ **Variant Selection**: Choose product options like size, color, etc.
- 🔍 **Search & Filter**: Advanced product filtering by title, tags, and categories
- ⭐ **Product Reviews**: Simulated review system with ratings and feedback
- 💾 **Persistent Cart**: Cart data persists using localStorage
- 🎨 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⚡ **Performance**: Skeleton loaders and optimized rendering
- 🔔 **Notifications**: Real-time user feedback system
- 🛡️ **Error Handling**: Graceful error handling and offline status detection

### User Experience
- **Sticky Navigation**: Fixed header with cart badge and search
- **Sliding Cart Drawer**: Smooth cart interactions with animations
- **Save for Later**: Move items between cart and saved items
- **Quantity Controls**: Increment/decrement item quantities
- **Product Quick Actions**: Quick add to cart from product grid
- **Micro-interactions**: Hover effects and smooth transitions

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React Context API with useReducer
- **API Integration**: Shopify Storefront API with GraphQL
- **Build Tool**: Vite for fast development and building
- **Icons**: Lucide React for consistent iconography

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- A Shopify development store
- Shopify Storefront API access token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cartly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Shopify API**
   
   Edit `src/services/shopify.ts` and update:
   ```typescript
   const SHOPIFY_DOMAIN = 'your-shop-name.myshopify.com';
   const STOREFRONT_ACCESS_TOKEN = 'your-storefront-access-token';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   └── NotificationContainer.tsx
|   |   └── Footer.tsx
│   ├── cart/            # Cart-related components
│   │   └── CartDrawer.tsx
│   └── products/        # Product components
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── ProductDetail.tsx
│       └── ProductFilters.tsx
├── context/             # React Context providers
│   └── AppContext.tsx
├── services/            # API services
│   └── shopify.ts
├── types/               # TypeScript type definitions
│   └── shopify.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main actions and branding
- **Secondary**: Emerald (#10B981) - Success states and highlights
- **Accent**: Orange (#F97316) - Call-to-action elements
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success, warning, and error colors

### Typography
- **Font Family**: System fonts for optimal performance
- **Line Height**: 150% for body text, 120% for headings
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- **8px Grid System**: All spacing uses multiples of 8px
- **Consistent Padding**: 16px, 24px, 32px for different container sizes
- **Responsive Margins**: Adaptive spacing for different screen sizes

## 🔧 Configuration

### Shopify Setup

1. **Create Storefront API Access Token**
   - Go to your Shopify admin panel
   - Navigate to Apps > Manage private apps
   - Create a new private app
   - Enable Storefront API access
   - Copy the Storefront access token

2. **Configure API Endpoints**
   ```typescript
   // In src/services/shopify.ts
   const SHOPIFY_DOMAIN = 'your-shop-name.myshopify.com';
   const STOREFRONT_ACCESS_TOKEN = 'your-token-here';
   ```


## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px - Single column layout, touch-optimized
- **Tablet**: 768px - 1024px - Two-column grid, adapted spacing
- **Desktop**: > 1024px - Multi-column grid, full feature set

## 🎯 Analytics & Tracking

The app includes simulated analytics logging:
- **Product Views**: Tracked when users view product details
- **Add to Cart**: Logged with product and variant information
- **Checkout Initiation**: Tracked with cart total and item count

## 🛡️ Error Handling

Comprehensive error handling includes:
- **API Failures**: Graceful fallback to mock data
- **Network Issues**: Offline status detection
- **User Feedback**: Clear error messages and notifications
- **Loading States**: Skeleton loaders during data fetching

## 🚀 Performance Optimizations

- **Code Splitting**: Dynamic imports for better loading performance
- **Image Optimization**: Responsive images with proper sizing
- **Memoization**: React.memo and useMemo for expensive operations

## 🔮 Future Enhancements

- **Real User Authentication**: Shopify customer accounts
- **Wishlist Functionality**: Save products across sessions
- **Product Recommendations**: AI-powered suggestions
- **Advanced Filtering**: Price ranges, availability, ratings
- **Multi-language Support**: Internationalization
- **PWA Features**: Offline functionality and push notifications


import React, { useState, useMemo } from 'react';
import { ProductItem, MarketplaceCategory, VendorProfile, MasterOrder } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { VendorRegistrationModal } from './VendorRegistrationModal';
import { VendorStorefront } from './VendorStorefront';
import { 
  Store, 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Flame, 
  CheckCircle, 
  Layers,
  Filter,
  X,
  Package,
  ShoppingBag
} from 'lucide-react';

interface MarketplacePageProps {
  onNavigate?: (path: string) => void;
  onOpenDirectChat?: (recipientId: string, recipientName: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onNavigate,
  onOpenDirectChat
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest-user';

  // Vendor check
  const currentVendor = currentUser ? MarketplaceStore.getVendorByStudentId(currentUser.id) : null;

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'popular' | 'newest'>('featured');
  const [showOnlyVerifiedVendors, setShowOnlyVerifiedVendors] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [vendorRegModalOpen, setVendorRegModalOpen] = useState(false);
  const [selectedVendorIdForStorefront, setSelectedVendorIdForStorefront] = useState<string | null>(null);
  const [storefrontOpen, setStorefrontOpen] = useState(false);

  // Live Data
  const categories: MarketplaceCategory[] = MarketplaceStore.getCategories();
  const allProducts: ProductItem[] = MarketplaceStore.getAllProducts();
  const cart = MarketplaceStore.getCart(userId);
  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Must be published
      if (product.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesStore = product.vendorStoreName.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesStore && !matchesCategory) {
          return false;
        }
      }

      // Location Filter
      if (selectedLocation !== 'All' && !product.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Fulfillment Filter
      if (fulfillmentFilter === 'pickup' && !product.pickupAvailable) return false;
      if (fulfillmentFilter === 'delivery' && !product.deliveryAvailable) return false;

      // Verified Vendor Only
      if (showOnlyVerifiedVendors && !product.isVendorVerified) return false;

      // Price Range Filter
      const effectivePrice = product.discountPrice || product.price;
      if (priceRange === 'under_2k' && effectivePrice > 2000) return false;
      if (priceRange === '2k_to_5k' && (effectivePrice < 2000 || effectivePrice > 5000)) return false;
      if (priceRange === '5k_to_15k' && (effectivePrice < 5000 || effectivePrice > 15000)) return false;
      if (priceRange === 'above_15k' && effectivePrice < 15000) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'featured') {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return (b.ordersCount || 0) - (a.ordersCount || 0);
      }
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'popular') return (b.ordersCount || 0) - (a.ordersCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [allProducts, selectedCategory, searchQuery, selectedLocation, fulfillmentFilter, showOnlyVerifiedVendors, priceRange, sortBy]);

  // Promoted products list for the spotlight section
  const promotedProducts = useMemo(() => {
    return allProducts.filter(p => p.isPromoted && p.status === 'published');
  }, [allProducts]);

  // Handlers
  const handleViewProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  };

  const handleAddToCart = (product: ProductItem, quantity = 1, deliveryMethod: 'pickup' | 'delivery' = 'pickup') => {
    MarketplaceStore.addToCart(userId, product, quantity, deliveryMethod);
  };

  const handleBuyNow = (product: ProductItem, quantity = 1, deliveryMethod: 'pickup' | 'delivery' = 'pickup') => {
    MarketplaceStore.addToCart(userId, product, quantity, deliveryMethod);
    setProductDetailOpen(false);
    setCheckoutModalOpen(true);
  };

  const handleOpenStorefront = (vendorId: string) => {
    setSelectedVendorIdForStorefront(vendorId);
    setStorefrontOpen(true);
  };

  return (
    <div id="marketplace-page" className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Hero Banner with Search & Call-to-Action */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-blue-900 text-white shadow-2xl p-6 sm:p-10 lg:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/10 text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Official OOU Student Physical Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Buy & Sell Directly with Fellow <span className="text-[#F5B400]">OOU Students</span>
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl">
            Authentic student-crafted clothing, gadgets, textbooks, snacks, and hostel essentials with transparent campus pickup and secured escrow.
          </p>

          {/* Search Bar within Banner */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search hoodies, scientific calculators, past questions, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F5B400] shadow-md font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Vendor Action Button */}
            {currentVendor ? (
              <button
                onClick={() => onNavigate?.('/vendor/dashboard')}
                className="px-6 py-3.5 bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Store className="w-4 h-4" />
                <span>My Vendor Hub</span>
              </button>
            ) : (
              <button
                onClick={() => setVendorRegModalOpen(true)}
                className="px-6 py-3.5 bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Start Selling</span>
              </button>
            )}
          </div>

          {/* Quick Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Campus Escrow Protection
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              Ago-Iwoye • Sagamu • Ayetoro • Ibogun
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-300" />
              Hostel / Faculty Delivery Available
            </span>
          </div>

        </div>

        {/* Decorative Watermark Logo */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none hidden lg:block">
          <Store className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Top Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
            selectedCategory === 'All'
              ? 'bg-[#061A4F] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Categories</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              selectedCategory === cat.name
                ? 'bg-[#061A4F] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Promoted / Featured Spotlight Section */}
      {promotedProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-900 rounded-xl">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Featured Campus Listings</h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Student Favorites
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {promotedProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Filter & Sort Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Active Count & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </span>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Campus Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All OOU Campuses</option>
            <option value="Ago-Iwoye">Ago-Iwoye Main & Mini</option>
            <option value="Sagamu">Sagamu (CHS)</option>
            <option value="Ayetoro">Ayetoro (Agric)</option>
            <option value="Ibogun">Ibogun (Engineering)</option>
          </select>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fulfillment</option>
            <option value="pickup">Campus Pickup (Free)</option>
            <option value="delivery">Hostel Delivery</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="under_2k">Under ₦2,000</option>
            <option value="2k_to_5k">₦2,000 - ₦5,000</option>
            <option value="5k_to_15k">₦5,000 - ₦15,000</option>
            <option value="above_15k">Above ₦15,000</option>
          </select>
        </div>

        {/* Right: Sort By */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>

      </div>

      {/* Main Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Campus Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any products matching your active filters. Try clearing your search query or selecting "All Categories".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLocation('All');
              setFulfillmentFilter('all');
              setPriceRange('all');
            }}
            className="px-5 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition shadow"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Cart & Hub Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* View Customer Orders Button */}
        <button
          id="btn-floating-orders"
          onClick={() => onNavigate?.('/orders')}
          title="Track My Orders"
          className="p-3.5 bg-white text-slate-800 rounded-full shadow-2xl border border-slate-200 hover:bg-slate-50 transition active:scale-95 flex items-center justify-center"
        >
          <ShoppingBag className="w-5 h-5 text-blue-600" />
        </button>

        {/* Cart Drawer Trigger */}
        <button
          id="btn-floating-cart"
          onClick={() => setCartDrawerOpen(true)}
          className="px-5 py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-full shadow-2xl transition active:scale-95 flex items-center gap-2.5 font-black text-xs sm:text-sm border-2 border-[#F5B400]"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-[#F5B400]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Cart ({cartItemCount})</span>
        </button>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={productDetailOpen}
          onClose={() => setProductDetailOpen(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onViewVendorStorefront={handleOpenStorefront}
          onOpenDirectChat={onOpenDirectChat}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        userId={userId}
        onProceedToCheckout={() => setCheckoutModalOpen(true)}
      />

      {/* Multi-Vendor Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        userId={userId}
        onOrderPlaced={(order) => {
          // Trigger customer order navigation
          onNavigate?.('/orders');
        }}
      />

      {/* Vendor Registration Modal */}
      <VendorRegistrationModal
        isOpen={vendorRegModalOpen}
        onClose={() => setVendorRegModalOpen(false)}
        onSuccess={(vendor) => {
          onNavigate?.('/vendor/dashboard');
        }}
      />

      {/* Public Vendor Storefront Preview */}
      {selectedVendorIdForStorefront && (
        <VendorStorefront
          vendorId={selectedVendorIdForStorefront}
          isOpen={storefrontOpen}
          onClose={() => setStorefrontOpen(false)}
          onViewProduct={handleViewProduct}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />
      )}

    </div>
  );
};

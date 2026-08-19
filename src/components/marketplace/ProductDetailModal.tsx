import React, { useState } from 'react';
import { ProductItem, ProductReview, VendorProfile } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { ReviewModal } from './ReviewModal';
import { ReportProductModal } from './ReportProductModal';
import { SwipeableGallery } from '../common/SwipeableGallery';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Store, 
  Phone, 
  MessageSquare, 
  Share2, 
  Flag, 
  CheckCircle, 
  AlertCircle,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Send,
  Zap
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number, deliveryMethod: 'pickup' | 'delivery') => void;
  onBuyNow?: (product: ProductItem, quantity: number, deliveryMethod: 'pickup' | 'delivery') => void;
  onViewVendorStorefront?: (vendorId: string) => void;
  onOpenDirectChat?: (recipientId: string, recipientName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  onViewVendorStorefront,
  onOpenDirectChat
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest-user';

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'seller'>('description');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync wishlist status when product opens
  React.useEffect(() => {
    if (product) {
      setIsWishlisted(MarketplaceStore.isInWishlist(userId, product.id));
      setSelectedQuantity(1);
      setSelectedImageIndex(0);
      setDeliveryMethod(product.pickupAvailable ? 'pickup' : 'delivery');
    }
  }, [product, userId]);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  const reviews = MarketplaceStore.getProductReviews(product.id);
  const vendor = MarketplaceStore.getVendorById(product.vendorId);
  const reviewEligibility = MarketplaceStore.canUserReviewProduct(userId, product.id);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = product.discountPrice || product.price;
  const isOutOfStock = product.quantity <= 0 || product.status === 'out_of_stock';

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      MarketplaceStore.removeFromWishlist(userId, product.id);
      setIsWishlisted(false);
    } else {
      MarketplaceStore.addToWishlist(userId, product);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedQuantity, deliveryMethod);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (onBuyNow) {
      onBuyNow(product, selectedQuantity, deliveryMethod);
      onClose();
    } else {
      onAddToCart(product, selectedQuantity, deliveryMethod);
      setIsAddedToCart(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsApp = () => {
    const phone = vendor?.whatsappNumber || '08051780169';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    const msg = encodeURIComponent(`Hello ${product.vendorStoreName}! I am interested in purchasing "${product.title}" listed on OOU StudentCircle Marketplace (₦${currentPrice.toLocaleString()}). Is it currently available for pickup/delivery?`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'brand_new': return 'Brand New';
      case 'handmade': return 'Handmade / Crafted';
      case 'like_new': return 'Like New';
      case 'refurbished': return 'Refurbished';
      case 'used_good': return 'Gently Used';
      default: return condition;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        id="product-detail-modal-container"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share listing"
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition flex items-center gap-1 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={handleWishlistToggle}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative">
                <SwipeableGallery
                  images={images}
                  alt={product.title}
                  aspectRatio="square"
                />

                {/* Promoted Tag */}
                {product.isPromoted && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#F5B400] text-[#061A4F] rounded-lg shadow border border-amber-300 pointer-events-none">
                    ★ Featured Listing
                  </span>
                )}
              </div>

              {/* Verified Student Seller Card */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={vendor?.profileImage || product.vendorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                      alt={product.vendorStoreName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#F5B400] shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{product.vendorStoreName}</h4>
                        {product.isVendorVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Campus Vendor" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Student: {product.vendorName} {vendor?.studentDepartment ? `• ${vendor.studentDepartment}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{vendor?.rating ? vendor.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{vendor?.totalSales || 12} Orders Completed</span>
                  </div>
                </div>

                {vendor?.businessDescription && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    "{vendor.businessDescription}"
                  </p>
                )}

                {/* Direct Vendor Contact Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenDirectChat && vendor) {
                        onClose();
                        onOpenDirectChat(vendor.id, vendor.storeName);
                      }
                    }}
                    className="px-3 py-2 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>In-App Chat</span>
                  </button>

                  {onViewVendorStorefront && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewVendorStorefront(product.vendorId);
                      }}
                      className="col-span-2 sm:col-span-1 px-3 py-2 text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Store className="w-3.5 h-3.5 text-blue-600" />
                      <span>Storefront</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right: Product Details & Buying Actions (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Condition & SKU row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-900 rounded-lg">
                    {getConditionLabel(product.condition)}
                  </span>
                  {product.sku && (
                    <span className="text-xs text-slate-400 font-mono">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Price & Rating Display */}
                <div className="flex items-baseline justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-0.5">Price (NGN)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        ₦{currentPrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-base font-bold text-slate-400 line-through">
                          ₦{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-base">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      {reviews.length} Verified Reviews
                    </button>
                  </div>
                </div>

                {/* Stock Status Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Available Stock</span>
                    {isOutOfStock ? (
                      <span className="text-rose-600 font-black">Out of Stock</span>
                    ) : (
                      <span className="text-emerald-700">{product.quantity} items available</span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isOutOfStock ? 'bg-rose-500 w-0' : product.quantity <= 3 ? 'bg-amber-500 w-1/4' : 'bg-emerald-500 w-full'}`}
                    />
                  </div>
                </div>

                {/* Delivery Options Selector */}
                <div className="space-y-3 mb-6">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Choose Fulfillment Option *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Free Campus Pickup */}
                    {product.pickupAvailable && (
                      <label 
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                          deliveryMethod === 'pickup' 
                            ? 'border-blue-600 bg-blue-50/50 text-slate-900' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="fulfillment" 
                          checked={deliveryMethod === 'pickup'} 
                          onChange={() => setDeliveryMethod('pickup')}
                          className="mt-1 text-blue-600"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Campus Pickup</span>
                          </div>
                          <p className="text-xs text-emerald-700 font-bold mt-0.5">FREE (₦0)</p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                            {product.pickupLocationDescription || product.location || 'Ago-Iwoye Main Campus'}
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Campus Vendor Delivery */}
                    {product.deliveryAvailable && (
                      <label 
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                          deliveryMethod === 'delivery' 
                            ? 'border-blue-600 bg-blue-50/50 text-slate-900' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="fulfillment" 
                          checked={deliveryMethod === 'delivery'} 
                          onChange={() => setDeliveryMethod('delivery')}
                          className="mt-1 text-blue-600"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span>Hostel / Faculty Delivery</span>
                          </div>
                          <p className="text-xs text-slate-900 font-bold mt-0.5">
                            +₦{product.deliveryFee ? product.deliveryFee.toLocaleString() : '0'}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                            Estimated: {product.estimatedDeliveryTime || '24-48 Hours'}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Quantity Selector & Action Buttons */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                        disabled={selectedQuantity <= 1 || isOutOfStock}
                        className="px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-sm font-black text-slate-900 min-w-[36px] text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity(q => Math.min(product.quantity, q + 1))}
                        disabled={selectedQuantity >= product.quantity || isOutOfStock}
                        className="px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs text-slate-500">
                      Subtotal: <strong className="text-slate-900">₦{(currentPrice * selectedQuantity).toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        id="btn-modal-buy-now"
                        type="button"
                        disabled={isOutOfStock}
                        onClick={handleBuyNow}
                        className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] active:scale-95'
                        }`}
                      >
                        <Zap className="w-4 h-4 fill-[#061A4F]" />
                        <span>Buy Now</span>
                      </button>

                      <button
                        id="btn-modal-add-to-cart"
                        type="button"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                        className={`py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                          isOutOfStock 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : isAddedToCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#061A4F] hover:bg-[#0B2A6F] text-white active:scale-95'
                        }`}
                      >
                        {isAddedToCart ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-white" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 text-[#F5B400]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="btn-modal-contact-vendor"
                        type="button"
                        onClick={openWhatsApp}
                        className="py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Seller</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenDirectChat && vendor) {
                            onClose();
                            onOpenDirectChat(vendor.id, vendor.storeName);
                          }
                        }}
                        className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-blue-600" />
                        <span>In-App Message</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campus Safety Tips Accordion / Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Campus Safety & Buyer Protection Tips</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>Always meet in public campus spots (ICT Centre, Main Gate, Sub-Hall, Faculty Quad).</li>
                    <li>Inspect product quality and condition before acknowledging delivery.</li>
                    <li>Payments are safely protected by OOU StudentCircle Escrow.</li>
                  </ul>
                </div>

                {/* Tabs: Description / Reviews */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex border-b border-slate-200 gap-6">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${
                        activeTab === 'description'
                          ? 'border-[#061A4F] text-[#061A4F]'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Product Description
                    </button>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 ${
                        activeTab === 'reviews'
                          ? 'border-[#061A4F] text-[#061A4F]'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Verified Reviews ({reviews.length})
                    </button>
                  </div>

                  <div className="pt-4">
                    {activeTab === 'description' ? (
                      <div className="prose prose-sm text-slate-700 leading-relaxed max-w-none">
                        <p className="whitespace-pre-line">{product.description}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Reviews Header & CTA */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div>
                            <span className="font-bold text-xs text-slate-800">
                              Average: {product.rating?.toFixed(1) || '5.0'} / 5.0
                            </span>
                            <p className="text-[11px] text-slate-500">Only verified buyers who completed orders can review.</p>
                          </div>

                          {reviewEligibility.eligible && (
                            <button
                              onClick={() => setReviewModalOpen(true)}
                              className="px-3 py-1.5 text-xs font-bold bg-[#061A4F] text-white rounded-lg hover:bg-[#0B2A6F]"
                            >
                              Write Review
                            </button>
                          )}
                        </div>

                        {/* Reviews List */}
                        {reviews.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-4 text-center">
                            No reviews yet for this product. Be the first verified buyer to review!
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {reviews.map((rev) => (
                              <div key={rev.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center">
                                      {rev.customerName.charAt(0)}
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold text-slate-900 block">{rev.customerName}</span>
                                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                        <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>

                                {rev.reviewTitle && (
                                  <h5 className="text-xs font-bold text-slate-900">{rev.reviewTitle}</h5>
                                )}
                                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety & Report Listing Link */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Protected by StudentCircle Campus Escrow
                  </span>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report Listing</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Write Review Modal */}
      {reviewEligibility.orderId && (
        <ReviewModal
          product={product}
          orderId={reviewEligibility.orderId}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            // refresh
          }}
        />
      )}

      {/* Report Modal */}
      <ReportProductModal
        product={product}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

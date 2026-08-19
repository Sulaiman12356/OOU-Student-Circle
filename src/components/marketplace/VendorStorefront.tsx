import React, { useState } from 'react';
import { VendorProfile, ProductItem, ProductReview } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { ProductCard } from './ProductCard';
import { 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Search, 
  SlidersHorizontal,
  X,
  Phone,
  CheckCircle
} from 'lucide-react';

interface VendorStorefrontProps {
  vendorId: string;
  isOpen?: boolean;
  onClose?: () => void;
  onViewProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export const VendorStorefront: React.FC<VendorStorefrontProps> = ({
  vendorId,
  isOpen = true,
  onClose,
  onViewProduct,
  onAddToCart
}) => {
  const vendor = MarketplaceStore.getVendorById(vendorId);
  const products = MarketplaceStore.getProductsByVendor(vendorId);
  const reviews = MarketplaceStore.getAllProductReviews().filter(r => r.vendorId === vendorId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !vendor) return null;

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsApp = () => {
    const phone = vendor.whatsappNumber || '08051780169';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    const msg = encodeURIComponent(`Hello ${vendor.storeName}! I am viewing your store on OOU StudentCircle Marketplace.`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        id="vendor-storefront-modal"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Banner Area */}
        <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-blue-900 overflow-hidden">
          {vendor.bannerImage && (
            <img 
              src={vendor.bannerImage} 
              alt={vendor.storeName} 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Quick Share */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-16 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied' : 'Share Store'}</span>
          </button>
        </div>

        {/* Vendor Header Profile Info */}
        <div className="px-6 sm:px-8 pb-4 relative -mt-16 sm:-mt-20 border-b border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Avatar & Title */}
            <div className="flex items-end gap-4">
              <img 
                src={vendor.profileImage} 
                alt={vendor.storeName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-xl bg-white flex-shrink-0"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{vendor.storeName}</h1>
                  {vendor.verificationStatus === 'approved' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Student Owner: <strong>{vendor.studentName}</strong> {vendor.studentDepartment ? `• ${vendor.studentDepartment}` : ''}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {vendor.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {vendor.rating?.toFixed(1) || '5.0'} ({vendor.reviewsCount || reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={openWhatsApp}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition border-b-2 ${
                activeTab === 'products'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Store Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition border-b-2 ${
                activeTab === 'about'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              About Vendor
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search in this store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-[#061A4F] text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <p className="text-sm font-bold text-slate-700">No products match your criteria</p>
                  <p className="text-xs text-slate-400">Try changing your search query or category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={onViewProduct}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-base text-slate-900">About {vendor.storeName}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {vendor.businessDescription}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Student Entrepreneur Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Student Founder</span>
                    <strong className="text-slate-800">{vendor.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <strong className="text-slate-800">{vendor.studentDepartment || 'OOU Student'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Campus Base</span>
                    <strong className="text-slate-800">{vendor.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Verification</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Campus Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl space-y-4">
              <h3 className="font-bold text-base text-slate-900">Customer Feedback & Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-8 text-center">
                  No verified customer reviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                            {r.customerName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">{r.customerName}</span>
                            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" /> Verified Buyer for "{r.productTitle}"
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      {r.reviewTitle && <h5 className="text-xs font-bold text-slate-900">{r.reviewTitle}</h5>}
                      <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

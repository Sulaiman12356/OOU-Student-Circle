import React, { useState } from 'react';
import { ProductItem } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Store,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onViewDetails: (product: ProductItem) => void;
  onAddToCart?: (product: ProductItem) => void;
  onWishlistToggle?: (product: ProductItem, isWishlisted: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onWishlistToggle
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest-user';
  
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    return MarketplaceStore.isInWishlist(userId, product.id);
  });
  const [isAdded, setIsAdded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      MarketplaceStore.removeFromWishlist(userId, product.id);
      setIsWishlisted(false);
      onWishlistToggle?.(product, false);
    } else {
      MarketplaceStore.addToWishlist(userId, product);
      setIsWishlisted(true);
      onWishlistToggle?.(product, true);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.quantity <= 0) return;
    
    MarketplaceStore.addToCart(userId, product, 1, product.pickupAvailable ? 'pickup' : 'delivery');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
    onAddToCart?.(product);
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'brand_new': return 'Brand New';
      case 'handmade': return 'Handmade';
      case 'like_new': return 'Like New';
      case 'refurbished': return 'Refurbished';
      case 'used_good': return 'Gently Used';
      default: return condition;
    }
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  const isLowStock = product.quantity > 0 && product.quantity <= 3;
  const isOutOfStock = product.quantity <= 0 || product.status === 'out_of_stock';

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img 
          src={product.mainImage || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {/* Promoted / Featured Badge */}
            {product.isPromoted && (
              <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-[#061A4F] rounded-lg shadow-sm backdrop-blur-sm border border-amber-300 flex items-center gap-1">
                ★ Featured
              </span>
            )}

            {/* Condition Badge */}
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-white/95 text-slate-800 rounded-md shadow-sm border border-slate-200">
              {getConditionLabel(product.condition)}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            id={`btn-wishlist-${product.id}`}
            type="button"
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md transition transform active:scale-90"
          >
            <Heart 
              className={`w-4 h-4 transition ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} 
            />
          </button>
        </div>

        {/* Discount Percentage Pill */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Stock Status Badge Overlay if low or out */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-slate-900 text-white rounded-lg border border-slate-700">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
            Only {product.quantity} left!
          </div>
        ) : null}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor Details Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <Store className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-slate-700 truncate max-w-[140px]" title={product.vendorStoreName}>
                {product.vendorStoreName}
              </span>
              {product.isVendorVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" title="Verified Campus Student Vendor" />
              )}
            </div>

            {/* Category tag */}
            <span className="text-[11px] text-slate-400 truncate max-w-[90px]">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors mb-2"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating & Location Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-slate-800">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400">({product.reviewsCount || 0})</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[130px]" title={product.location}>
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{product.location || 'Ago-Iwoye'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pricing & Action Section */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ₦{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              {product.pickupAvailable ? (
                <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                  <CheckCircle className="w-2.5 h-2.5" /> Free Pickup
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-0.5">
                  <Truck className="w-2.5 h-2.5" /> ₦{product.deliveryFee?.toLocaleString() || '0'} Delivery
                </span>
              )}
            </div>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            id={`btn-add-cart-${product.id}`}
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCartClick}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#061A4F] hover:bg-[#0B2A6F] text-white active:scale-95 shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

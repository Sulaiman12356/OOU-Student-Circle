import React from 'react';
import { 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { CampusShop, calculateShopAvailability } from '../../types/campus';

interface ShopCardProps {
  shop: CampusShop;
  onViewShop: (shop: CampusShop) => void;
  onRequestService: (shop: CampusShop) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  onViewShop,
  onRequestService
}) => {
  const availability = calculateShopAvailability(shop);

  const getStatusBadge = () => {
    switch (availability.status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            OPEN NOW
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            BUSY (IN QUEUE)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3" />
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#061A4F]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Photos */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={shop.coverPhoto || shop.photos[0] || 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80'}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Live Availability Badge & Location Code */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge()}
          {shop.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F5B400] text-[#061A4F]">
              <Sparkles className="w-3 h-3" />
              FEATURED
            </span>
          )}
        </div>

        {/* Shop Code Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold">
          Shop {shop.shopCode}
        </div>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{shop.locationName}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/90">{shop.specificArea}</span>
          </div>
          <h3 className="text-lg font-extrabold text-white truncate group-hover:text-amber-300 transition-colors">
            {shop.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Rating & Orders */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 text-slate-800 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{shop.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({shop.reviewsCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{shop.totalOrdersCount}+ Orders Completed</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {shop.description}
        </p>

        {/* Services Offered Tags */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Available Services:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shop.servicesOffered.slice(0, 4).map((service, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200"
              >
                {service}
              </span>
            ))}
            {shop.servicesOffered.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[11px] font-bold">
                +{shop.servicesOffered.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Opening Hours & Pickup Guidance */}
        <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-600 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Working Hours:</span>
            <span className="font-bold text-slate-800">{shop.openingHours} - {shop.closingHours}</span>
          </div>
          <div className="text-slate-500 line-clamp-1">
            <span className="font-semibold text-slate-700">Pickup:</span> {shop.pickupInstructions}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewShop(shop)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-[#061A4F] text-[#061A4F] text-xs font-bold hover:bg-slate-50 transition text-center"
          >
            View Shop & Prices
          </button>
          <button
            onClick={() => onRequestService(shop)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#061A4F] hover:bg-[#0A2265] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 group-hover:bg-[#F5B400] group-hover:text-[#061A4F]"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

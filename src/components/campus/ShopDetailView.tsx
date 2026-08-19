import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Phone, 
  MessageCircle, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Info
} from 'lucide-react';
import { CampusShop, CampusService, CampusReview, calculateShopAvailability } from '../../types/campus';
import { CampusStore } from '../../services/campusStore';

interface ShopDetailViewProps {
  shop: CampusShop;
  onBack: () => void;
  onRequestService: (shop: CampusShop, service?: CampusService) => void;
}

export const ShopDetailView: React.FC<ShopDetailViewProps> = ({
  shop,
  onBack,
  onRequestService
}) => {
  const availability = calculateShopAvailability(shop);
  const services = CampusStore.getServicesByShop(shop.id);
  const reviews = CampusStore.getReviewsByShop(shop.id);

  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'location'>('services');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#061A4F] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campus Services Hub</span>
      </button>

      {/* Main Shop Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Cover & Badges */}
        <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
          <img
            src={shop.coverPhoto || shop.photos[0] || 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&auto=format&fit=crop&q=80'}
            alt={shop.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Status Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
              availability.status === 'open'
                ? 'bg-emerald-500 text-white'
                : (availability.status === 'busy' ? 'bg-amber-500 text-[#061A4F]' : 'bg-slate-700 text-white')
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {availability.label}
            </span>

            {shop.verificationStatus === 'verified' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#061A4F] text-amber-300 border border-amber-300/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Verified Campus Vendor
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold">
            Shop Code: {shop.shopCode}
          </div>

          {/* Bottom Shop Info */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{shop.locationName}</span>
                <span>•</span>
                <span>{shop.specificArea}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                {shop.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{shop.rating.toFixed(1)}</span>
                  <span className="text-slate-300 font-normal">({shop.reviewsCount} verified reviews)</span>
                </div>
                <span>•</span>
                <span>{shop.totalOrdersCount}+ Orders Completed</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRequestService(shop)}
                className="px-6 py-3 rounded-xl bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-extrabold text-xs shadow-lg transition flex items-center gap-2"
              >
                <span>Request Service / Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Details Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#061A4F] border border-slate-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Operating Schedule</div>
              <div className="text-slate-600">{shop.openingHours} - {shop.closingHours} ({shop.workingDays.join(', ')})</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#061A4F] border border-slate-200">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Contact & WhatsApp</div>
              <div className="text-slate-600">{shop.ownerPhone}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#061A4F] border border-slate-200">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Physical Location</div>
              <div className="text-slate-600">{shop.locationDescription}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-sm font-bold transition border-b-2 ${
            activeTab === 'services'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Services & Pricing ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-sm font-bold transition border-b-2 ${
            activeTab === 'reviews'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`pb-3 text-sm font-bold transition border-b-2 ${
            activeTab === 'location'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pickup & Directions
        </button>
      </div>

      {/* Tab 1: Services */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#061A4F]">Available Campus Services</h2>
            <span className="text-xs text-slate-500">Upload documents or request instant printouts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#061A4F]/30 hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#061A4F]/5 text-[#061A4F] border border-[#061A4F]/10">
                      {service.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.estimatedTurnaround}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Rate</div>
                    <div className="text-sm font-extrabold text-[#061A4F]">
                      {service.priceDescription || (service.unitPrice !== undefined ? `₦${(service.unitPrice || 0).toLocaleString()}` : 'Custom Pricing')}
                    </div>
                  </div>

                  <button
                    onClick={() => onRequestService(shop, service)}
                    className="px-4 py-2 rounded-xl bg-[#061A4F] hover:bg-[#0A2265] text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Order Service</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5B400]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#061A4F]">Verified Customer Reviews</h2>
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{shop.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{review.customerName}</div>
                    <div className="text-[11px] text-slate-500">{review.customerType} • Ref: <span className="font-mono">{review.referenceNumber}</span></div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${
                        s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{review.comment}"
                </p>
                <div className="text-[10px] text-slate-400">
                  Service ordered: {review.serviceName} • {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Location & Pickup */}
      {activeTab === 'location' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-extrabold text-[#061A4F]">Pickup Instructions & Directions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30">
                <div className="text-xs font-bold text-[#061A4F] mb-1">Pickup Desk Process:</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {shop.pickupInstructions}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div><strong>Campus:</strong> {shop.campusName}</div>
                <div><strong>Zone:</strong> {shop.locationName}</div>
                <div><strong>Shop / Kiosk:</strong> Shop {shop.shopCode} ({shop.specificArea})</div>
                <div><strong>Full Address:</strong> {shop.locationDescription}</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Operating Days & Time</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {shop.workingDays.map((day) => (
                  <li key={day} className="flex justify-between border-b border-slate-100 pb-1">
                    <span>{day}</span>
                    <span className="font-semibold text-slate-800">{shop.openingHours} - {shop.closingHours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

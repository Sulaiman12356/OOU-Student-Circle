import React, { useState, useMemo } from 'react';
import { 
  CampusHubHero 
} from '../../components/campus/CampusHubHero';
import { 
  ShopCard 
} from '../../components/campus/ShopCard';
import { 
  ShopDetailView 
} from '../../components/campus/ShopDetailView';
import { 
  ServiceOrderModal 
} from '../../components/campus/ServiceOrderModal';
import { 
  OrderTrackerModal 
} from '../../components/campus/OrderTrackerModal';
import { 
  CampusShop, 
  CampusService, 
  calculateShopAvailability 
} from '../../types/campus';
import { 
  CampusStore 
} from '../../services/campusStore';
import { 
  Store, 
  MapPin, 
  Filter, 
  CheckCircle2, 
  Search, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface CampusHubPageProps {
  onNavigate: (path: string) => void;
}

export const CampusHubPage: React.FC<CampusHubPageProps> = ({ onNavigate }) => {
  const locations = CampusStore.getLocations();
  const allShops = CampusStore.getShops();

  // Navigation & Filtering State
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);

  // Selected Shop Detail View
  const [viewingShop, setViewingShop] = useState<CampusShop | null>(null);

  // Modals
  const [orderingShop, setOrderingShop] = useState<CampusShop | null>(null);
  const [orderingService, setOrderingService] = useState<CampusService | undefined>(undefined);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackReference, setActiveTrackReference] = useState('');

  // Service Categories List
  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Project Printing', label: 'Project Printing' },
    { id: 'Hardcover & Spiral Binding', label: 'Hardcover Binding' },
    { id: 'Online Verification & Screening Docs', label: 'Screening & JAMB' },
    { id: 'Instant Passport Photographs', label: 'Passport Photos' },
    { id: 'Photocopying (B&W / Colour)', label: 'Photocopy' },
    { id: 'Document Lamination & Scanning', label: 'Lamination' },
    { id: 'Speed Typing & Thesis Formatting', label: 'Typing' },
    { id: 'Stationery & Project Files', label: 'Stationery' }
  ];

  // Filtered Shops
  const filteredShops = useMemo(() => {
    return allShops.filter((shop) => {
      // 1. Location filter
      if (selectedLocation !== 'all' && shop.locationId !== selectedLocation) {
        return false;
      }

      // 2. Verified filter
      if (onlyVerified && shop.verificationStatus !== 'verified') {
        return false;
      }

      // 3. Open now filter
      if (onlyOpenNow) {
        const avail = calculateShopAvailability(shop);
        if (!avail.isOpen) return false;
      }

      // 4. Category filter
      if (selectedCategory !== 'all') {
        const hasService = shop.servicesOffered.some(
          s => s.toLowerCase().includes(selectedCategory.toLowerCase())
        );
        if (!hasService) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = shop.name.toLowerCase().includes(q);
        const matchesCode = shop.shopCode.toLowerCase().includes(q);
        const matchesLocation = shop.locationName.toLowerCase().includes(q) || shop.specificArea.toLowerCase().includes(q);
        const matchesServices = shop.servicesOffered.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesLocation && !matchesServices) {
          return false;
        }
      }

      return true;
    });
  }, [allShops, selectedLocation, selectedCategory, searchQuery, onlyOpenNow, onlyVerified]);

  const handleOpenOrderModal = (shop: CampusShop, service?: CampusService) => {
    setOrderingShop(shop);
    setOrderingService(service);
  };

  const handleOrderSuccess = (ref: string) => {
    setOrderingShop(null);
    setOrderingService(undefined);
    setActiveTrackReference(ref);
    setIsTrackerOpen(true);
  };

  const handleAspirantQuickPackage = () => {
    // Select Alhaja Biz Venture Shop E6 at Motion Ground as flagship for aspirant docs
    const alhajaShop = allShops.find(s => s.shopCode === 'E6') || allShops[0];
    const verifyService = CampusStore.getServicesByShop(alhajaShop.id).find(
      s => s.category === 'Online Verification'
    );
    handleOpenOrderModal(alhajaShop, verifyService);
  };

  // If viewing a single shop detail
  if (viewingShop) {
    return (
      <div className="bg-[#F7F9FC] min-h-screen">
        <ShopDetailView
          shop={viewingShop}
          onBack={() => setViewingShop(null)}
          onRequestService={(s, srv) => handleOpenOrderModal(s, srv)}
        />

        {orderingShop && (
          <ServiceOrderModal
            shop={orderingShop}
            services={CampusStore.getServicesByShop(orderingShop.id)}
            preSelectedService={orderingService}
            onClose={() => setOrderingShop(null)}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {isTrackerOpen && (
          <OrderTrackerModal
            initialReference={activeTrackReference}
            onClose={() => setIsTrackerOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#F7F9FC] min-h-screen">
      
      {/* 1. Hero Section */}
      <CampusHubHero
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenRegisterShop={() => onNavigate('/campus/register-shop')}
        onOpenAspirantPackage={handleAspirantQuickPackage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#061A4F] text-white border-[#061A4F] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters and Count Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Store className="w-4 h-4 text-[#061A4F]" />
            <span>Showing {filteredShops.length} Verified Physical Shops</span>
            {selectedLocation !== 'all' && (
              <span className="text-slate-500 font-normal">
                at {locations.find(l => l.id === selectedLocation)?.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => setOnlyOpenNow(e.target.checked)}
                className="w-4 h-4 text-[#061A4F] rounded border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold">Open Now Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-[#061A4F] rounded border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold">Verified Shops</span>
            </label>
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onViewShop={(s) => setViewingShop(s)}
                onRequestService={(s) => handleOpenOrderModal(s)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No campus shops matched your criteria</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms, selecting "All Locations", or unchecking the "Open Now" filter.
            </p>
            <button
              onClick={() => {
                setSelectedLocation('all');
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyOpenNow(false);
              }}
              className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Vendor Partner Callout Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Campus Vendor Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Do you own a business centre or kiosk around OOU?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Register your shop at Motion Ground, Main Gate, SUB, or Mini Campus. Receive advance student and aspirant printing orders directly in your dashboard with guaranteed upfront payments.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/campus/register-shop')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-extrabold text-xs shadow-lg transition flex items-center gap-2"
          >
            <span>Register Your Campus Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Modals */}
      {orderingShop && (
        <ServiceOrderModal
          shop={orderingShop}
          services={CampusStore.getServicesByShop(orderingShop.id)}
          preSelectedService={orderingService}
          onClose={() => setOrderingShop(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackerModal
          initialReference={activeTrackReference}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

    </div>
  );
};

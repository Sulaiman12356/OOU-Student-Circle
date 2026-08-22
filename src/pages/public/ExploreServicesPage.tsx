import React, { useState, useMemo, useEffect } from 'react';
import { DataStore } from '../../services/dataStore';
import { ServiceItem, ServiceCategory, PricingType, ServiceAvailability, getServicePrice } from '../../types';
import { ServiceCard } from '../../components/services/ServiceCard';
import { ServiceDetailModal } from '../../components/services/ServiceDetailModal';
import { ServiceRequestModal } from '../../components/services/ServiceRequestModal';
import { 
  Search, 
  Filter, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Plus,
  ShieldCheck,
  Tag,
  Zap
} from 'lucide-react';

interface ExploreServicesPageProps {
  onNavigate: (path: string) => void;
  onSelectService?: (service: ServiceItem) => void;
}

export const ExploreServicesPage: React.FC<ExploreServicesPageProps> = ({ 
  onNavigate, 
  onSelectService 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedPricingType, setSelectedPricingType] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'views' | 'rating' | 'price-asc' | 'price-desc' | 'newest'>('views');
  
  // Modals state
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeRequestService, setActiveRequestService] = useState<ServiceItem | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isQuoteRequest, setIsQuoteRequest] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Saved bookmark items
  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_service_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories: string[] = [
    'All',
    'Graphic Design',
    'Web Development',
    'Digital Marketing',
    'Video Editing',
    'Photography',
    'Tutoring',
    'Writing',
    'Data Analysis',
    'Programming',
    'Social Media Management',
    'Printing assistance',
    'Other legitimate services'
  ];

  const campuses = [
    'All',
    'Main Campus (Ago-Iwoye)',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'Cross-Campus & Online Remote'
  ];

  const pricingTypes = [
    'All',
    'Fixed Price',
    'Starting From',
    'Per Unit',
    'Custom Quote'
  ];

  const availabilities = [
    'All',
    'Available Now',
    'Within 24 Hours',
    'Weekdays (8am - 6pm)',
    'Weekends Only',
    'By Appointment / Booking'
  ];

  const allServices = DataStore.getServices().filter(s => s.status === 'published' || s.status === 'active');

  const toggleSaveService = (serviceId: string) => {
    const updated = savedServiceIds.includes(serviceId)
      ? savedServiceIds.filter(id => id !== serviceId)
      : [...savedServiceIds, serviceId];
    setSavedServiceIds(updated);
    localStorage.setItem('saved_service_ids', JSON.stringify(updated));
  };

  const handleOpenDetail = (service: ServiceItem) => {
    setActiveDetailService(service);
    setIsDetailModalOpen(true);
    if (onSelectService) {
      onSelectService(service);
    }
  };

  const handleOpenRequest = (service: ServiceItem, isQuote = false) => {
    setActiveRequestService(service);
    setIsQuoteRequest(isQuote);
    setIsRequestModalOpen(true);
  };

  const handleMessageProvider = (providerId: string, providerName: string) => {
    setIsDetailModalOpen(false);
    onNavigate('/student/messages');
  };

  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const price = getServicePrice(service);

      // Search Query filter
      const matchesQuery = 
        searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.studentDepartment && service.studentDepartment.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.skills && service.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (service.tags && service.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      // Category filter
      const matchesCategory = 
        selectedCategory === 'All' || 
        service.category === selectedCategory;

      // Campus filter
      const matchesCampus = 
        selectedCampus === 'All' || 
        (service.campus && service.campus.toLowerCase().includes(selectedCampus.toLowerCase())) ||
        (service.location && service.location.toLowerCase().includes(selectedCampus.toLowerCase()));

      // Pricing type filter
      const matchesPricingType = 
        selectedPricingType === 'All' || 
        service.pricingType === selectedPricingType;

      // Availability filter
      const matchesAvailability = 
        selectedAvailability === 'All' || 
        service.availability === selectedAvailability;

      // Price range filter
      const matchesPrice = 
        service.pricingType === 'Custom Quote' ||
        (price >= minPrice && price <= maxPrice);

      // Rating filter
      const matchesRating = 
        minRating === 0 || 
        (service.rating || 5.0) >= minRating;

      // Verified Provider filter
      const matchesVerified = 
        !verifiedOnly || 
        service.isStudentVerified === true;

      return (
        matchesQuery && 
        matchesCategory && 
        matchesCampus && 
        matchesPricingType && 
        matchesAvailability && 
        matchesPrice && 
        matchesRating && 
        matchesVerified
      );
    }).sort((a, b) => {
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-asc') return getServicePrice(a) - getServicePrice(b);
      if (sortBy === 'price-desc') return getServicePrice(b) - getServicePrice(a);
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    });
  }, [
    allServices, 
    searchQuery, 
    selectedCategory, 
    selectedCampus, 
    selectedPricingType, 
    selectedAvailability, 
    minPrice, 
    maxPrice, 
    minRating, 
    verifiedOnly, 
    sortBy
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCampus('All');
    setSelectedPricingType('All');
    setSelectedAvailability('All');
    setMinPrice(0);
    setMaxPrice(100000);
    setMinRating(0);
    setVerifiedOnly(false);
    setSearchQuery('');
    setSortBy('views');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedCampus !== 'All',
    selectedPricingType !== 'All',
    selectedAvailability !== 'All',
    minPrice > 0 || maxPrice < 100000,
    minRating > 0,
    verifiedOnly
  ].filter(Boolean).length;

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#061A4F]" />
              OOU Student Services Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Hire Verified OOU Student Talent & Services
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Find skilled graphic designers, web developers, writers, tutors, and photographers right across all 4 OOU campuses.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => onNavigate('/services/create')}
              className="px-5 py-3 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Offer a Service</span>
            </button>
          </div>
        </div>

        {/* Search & Quick Category Carousel */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, skills, designers, tutors, or keywords..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 shadow-sm font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 flex items-center justify-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#061A4F]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-shrink-0 min-w-[190px]">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-8 py-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 shadow-sm appearance-none cursor-pointer"
              >
                <option value="views">Most Popular (Views)</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#061A4F] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body: Filter Sidebar + Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#061A4F]" />
                <h3 className="font-bold text-sm text-gray-900">Filter Market</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#061A4F] font-bold hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Verified Providers Toggle */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <label htmlFor="verified-toggle" className="text-xs font-bold text-blue-900 cursor-pointer">
                  OOU Verified Only
                </label>
              </div>
              <input
                id="verified-toggle"
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-[#061A4F] rounded border-gray-300 focus:ring-[#061A4F] cursor-pointer"
              />
            </div>

            {/* Campus Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Campus Location
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 bg-white"
              >
                {campuses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Pricing Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Pricing Type
              </label>
              <select
                value={selectedPricingType}
                onChange={(e) => setSelectedPricingType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 bg-white"
              >
                {pricingTypes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-500">Max Budget</span>
                <span className="font-bold text-[#061A4F]">₦{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={150000}
                step={2000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#061A4F] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>₦2k</span>
                <span>₦150k+</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 bg-white"
              >
                {availabilities.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 3.5, 4.0, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                      minRating === r
                        ? 'bg-[#061A4F] text-white border-[#061A4F]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Services Grid (3 Columns on desktop) */}
          <main className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Showing <strong className="text-gray-900">{filteredServices.length}</strong> service listing{filteredServices.length === 1 ? '' : 's'}
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-[#061A4F] font-semibold">
                  {activeFiltersCount} active filter{activeFiltersCount === 1 ? '' : 's'}
                </span>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
                <Zap className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">
                  {allServices.length === 0 ? 'No services have been listed yet' : 'No Services Match Your Filters'}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {allServices.length === 0 
                    ? 'Be the first student to publish a service profile and monetize your skills across OOU.'
                    : 'Try clearing some filters or searching for different keywords to find available student talent.'
                  }
                </p>
                {allServices.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('/auth/register')}
                    className="px-5 py-2.5 rounded-xl bg-[#061A4F] text-white text-xs font-bold hover:bg-[#0B2A6F] transition cursor-pointer"
                  >
                    List Your Service
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-[#061A4F] text-white text-xs font-bold hover:bg-[#0B2A6F] transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onViewDetails={handleOpenDetail}
                    onRequestService={(svc) => handleOpenRequest(svc, false)}
                    onMessageProvider={handleMessageProvider}
                    isSaved={savedServiceIds.includes(service.id)}
                    onToggleSave={toggleSaveService}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Modals */}
      <ServiceDetailModal
        service={activeDetailService}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRequestService={(svc, isQuote) => {
          setIsDetailModalOpen(false);
          handleOpenRequest(svc, isQuote);
        }}
        onMessageProvider={handleMessageProvider}
        isSaved={activeDetailService ? savedServiceIds.includes(activeDetailService.id) : false}
        onToggleSave={toggleSaveService}
      />

      <ServiceRequestModal
        service={activeRequestService}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        isQuoteRequest={isQuoteRequest}
        onSuccess={() => {
          // Toast or navigate to student dashboard requests
        }}
      />

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Filters</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Campus</label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Pricing Type</label>
                <select
                  value={selectedPricingType}
                  onChange={(e) => setSelectedPricingType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {pricingTypes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Availability</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {availabilities.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                <span className="text-xs font-bold text-blue-900">OOU Verified Only</span>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-[#061A4F] rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#061A4F] text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Store, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Phone,
  FileText,
  Building2,
  Compass,
  Layers,
  Check
} from 'lucide-react';
import { CampusStore } from '../../services/campusStore';
import { CampusLocation, CampusShop } from '../../types/campus';

interface CampusLocationZonesPageProps {
  onNavigate: (path: string) => void;
  selectedCampusZone?: string;
}

export const CampusLocationZonesPage: React.FC<CampusLocationZonesPageProps> = ({
  onNavigate,
  selectedCampusZone,
}) => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedServiceArea, setSelectedServiceArea] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const list = CampusStore.getPublicLocations();
    setLocations(list);
    if (selectedCampusZone) {
      const match = list.find(l => l.slug === selectedCampusZone || l.id === selectedCampusZone || l.location?.toLowerCase() === selectedCampusZone.toLowerCase());
      if (match) setSelectedLocationId(match.id);
    } else if (list.length > 0) {
      setSelectedLocationId(list[0].id);
    }
  }, [selectedCampusZone]);

  const activeLocation = useMemo(() => {
    return locations.find(l => l.id === selectedLocationId) || locations[0] || null;
  }, [locations, selectedLocationId]);

  const allShopsInLocation = useMemo(() => {
    if (!activeLocation) return [];
    return CampusStore.getShops().filter(s => 
      (s.locationId === activeLocation.id || 
       s.campusId === activeLocation.campusId || 
       s.campusName === activeLocation.name ||
       s.locationName?.toLowerCase().includes(activeLocation.location?.toLowerCase() || '') ||
       s.campusName?.toLowerCase().includes(activeLocation.name.toLowerCase())) &&
      s.verificationStatus === 'verified'
    );
  }, [activeLocation]);

  const filteredShops = useMemo(() => {
    if (selectedServiceArea === 'all') return allShopsInLocation;
    return allShopsInLocation.filter(s => 
      s.specificArea?.toLowerCase().includes(selectedServiceArea.toLowerCase()) ||
      s.locationName?.toLowerCase().includes(selectedServiceArea.toLowerCase())
    );
  }, [allShopsInLocation, selectedServiceArea]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.toLowerCase();
    return locations.filter(l => 
      l.name.toLowerCase().includes(q) || 
      (l.location && l.location.toLowerCase().includes(q)) ||
      l.campusType.toLowerCase().includes(q) || 
      l.description.toLowerCase().includes(q) ||
      (l.serviceAreas && l.serviceAreas.some(sa => sa.toLowerCase().includes(q)))
    );
  }, [locations, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-[#061A4F] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-blue-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F5B400]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5B400] text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>CAMPUS LOCATION ZONES</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Find Services Across OOU
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
            Whether you&apos;re at the Main Campus, Mini Campus, Ibogun, Ayetoro or Sagamu, discover participating student professionals, vendors and campus service providers around your location.
          </p>
        </div>
      </div>

      {/* Campus Hierarchy Explainer Pill Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5B400]/20 border border-[#F5B400]/40 flex items-center justify-center text-[#F5B400] flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#F5B400] block">
              Multi-Campus Structure
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Every shop and service provider is tagged by its exact physical hierarchy:
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">Campus</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">Location</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">Service Area</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">Shop</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-[#F5B400] text-[#061A4F] font-black">Shop Code (e.g. E6)</span>
        </div>
      </div>

      {/* 5 Official Campus Location Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#061A4F]">OOU Campus Zones ({locations.length})</h2>
            <p className="text-xs text-slate-500">Select any campus below to view verified local providers and service areas</p>
          </div>
          <button
            onClick={() => onNavigate('/campus/register-shop')}
            className="text-xs font-bold text-[#061A4F] hover:text-[#0B2A6F] flex items-center gap-1 hover:underline"
          >
            + Register a shop <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => {
            const isSelected = activeLocation?.id === loc.id;
            const providersCount = CampusStore.getActiveProvidersCount(loc.id);
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocationId(loc.id);
                  setSelectedServiceArea('all');
                }}
                className={`group rounded-3xl border bg-white overflow-hidden shadow-sm transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#061A4F] ring-2 ring-[#061A4F] shadow-lg scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Campus Image */}
                  <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={loc.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-[#061A4F]/80 backdrop-blur-md text-[#F5B400] text-[10px] font-black uppercase tracking-wider border border-[#F5B400]/30">
                          {loc.location || 'Ago-Iwoye'}
                        </span>
                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Selected Zone
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block">
                          {loc.subTitle || loc.campusType}
                        </span>
                        <h3 className="text-base font-black text-white leading-snug">
                          {loc.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3.5">
                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {loc.description}
                    </p>

                    {/* Active Providers Indicator */}
                    <div className="flex items-center gap-2">
                      {providersCount > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{providersCount} Active {providersCount === 1 ? 'Provider' : 'Providers'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                          <Store className="w-3.5 h-3.5 text-slate-400" />
                          <span>No service providers listed yet.</span>
                        </div>
                      )}
                    </div>

                    {/* Popular Services Tags */}
                    {loc.popularServices && loc.popularServices.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Popular Services
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {loc.popularServices.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                            >
                              {srv}
                            </span>
                          ))}
                          {loc.popularServices.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-medium">
                              +{loc.popularServices.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Explore Services Button */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocationId(loc.id);
                      setSelectedServiceArea('all');
                      const el = document.getElementById('location-detail-view');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                      isSelected
                        ? 'bg-[#061A4F] text-white hover:bg-[#0B2A6F] shadow-sm'
                        : 'bg-slate-100 text-slate-800 hover:bg-[#061A4F] hover:text-white'
                    }`}
                  >
                    <span>Explore Services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location Detailed Service Directory */}
      {activeLocation && (
        <div id="location-detail-view" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#061A4F] text-[#F5B400] text-[10px] font-black uppercase tracking-wider">
                  {activeLocation.location} • {activeLocation.subTitle || activeLocation.campusType}
                </span>
                <span className="text-xs text-slate-400 font-bold">Code: {activeLocation.code || 'OOU'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#061A4F] mt-1.5">
                {activeLocation.name} Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {activeLocation.description}
              </p>
            </div>

            <button
              onClick={() => onNavigate('/campus/register-shop')}
              className="px-4 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#0B2A6F] transition flex-shrink-0 flex items-center gap-2 self-start md:self-auto"
            >
              <Store className="w-4 h-4 text-[#F5B400]" />
              <span>Register Shop in {activeLocation.name}</span>
            </button>
          </div>

          {/* Service Areas Filter Tabs */}
          {activeLocation.serviceAreas && activeLocation.serviceAreas.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Filter by Service Area:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedServiceArea('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedServiceArea === 'all'
                      ? 'bg-[#061A4F] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Service Areas ({allShopsInLocation.length})
                </button>
                {activeLocation.serviceAreas.map((area, idx) => {
                  const areaShopCount = allShopsInLocation.filter(s => 
                    s.specificArea?.toLowerCase().includes(area.toLowerCase()) ||
                    s.locationName?.toLowerCase().includes(area.toLowerCase())
                  ).length;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedServiceArea(area)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        selectedServiceArea === area
                          ? 'bg-[#061A4F] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#F5B400]" />
                      <span>{area}</span>
                      {areaShopCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-white/20 text-white rounded text-[10px]">
                          {areaShopCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Shops & Providers Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span>
                Verified Service Providers ({filteredShops.length})
              </span>
            </h3>

            {filteredShops.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Store className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-800">
                  No service providers listed yet.
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first registered business center, typing hub, or student professional in {activeLocation.name}. Start taking pre-paid document orders directly from students online.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/campus/register-shop')}
                    className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2A6F] transition inline-flex items-center gap-1.5"
                  >
                    <span>Register Business in this Campus Zone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => onNavigate('/campus')}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#061A4F] hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900">{shop.name}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-[#061A4F] text-[#F5B400] text-[10px] font-black">
                              Shop {shop.shopCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{shop.specificArea} ({shop.locationName})</span>
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                          Verified
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {shop.description}
                      </p>

                      {/* Services Pills */}
                      <div className="flex flex-wrap gap-1">
                        {shop.servicesOffered.slice(0, 4).map((srv, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                            {srv}
                          </span>
                        ))}
                        {shop.servicesOffered.length > 4 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-semibold">
                            +{shop.servicesOffered.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-[#F5B400] text-[#F5B400]" />
                        <span>{shop.rating} ({shop.reviewsCount} reviews)</span>
                      </div>

                      <span className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1">
                        Order Documents <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


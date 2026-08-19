import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Store, 
  Briefcase, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { initialServices, initialJobs } from '../../services/dataStore';
import { initialProducts } from '../../services/marketplaceStore';
import { CampusStore } from '../../services/campusStore';
import { UserAvatar } from './UserAvatar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'marketplace' | 'shops' | 'jobs'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Shortcut Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const campusShops = useMemo(() => CampusStore.getShops().filter(s => s.verificationStatus === 'verified'), []);

  // Filtered Results
  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return {
        services: initialServices.slice(0, 3),
        products: initialProducts.slice(0, 3),
        shops: campusShops.slice(0, 3),
        jobs: initialJobs.slice(0, 3),
        total: 12,
      };
    }

    const filteredServices = initialServices.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        s.studentName.toLowerCase().includes(term)
    );

    const filteredProducts = initialProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.vendorName && p.vendorName.toLowerCase().includes(term)) ||
        (p.vendorStoreName && p.vendorStoreName.toLowerCase().includes(term))
    );

    const filteredShops = campusShops.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.locationName.toLowerCase().includes(term) ||
        s.shopCode.toLowerCase().includes(term) ||
        s.servicesOffered.some((so) => so.toLowerCase().includes(term))
    );

    const filteredJobs = initialJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        j.category.toLowerCase().includes(term)
    );

    return {
      services: filteredServices,
      products: filteredProducts,
      shops: filteredShops,
      jobs: filteredJobs,
      total: filteredServices.length + filteredProducts.length + filteredShops.length + filteredJobs.length,
    };
  }, [searchTerm, campusShops]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    onClose();
    onNavigate(path);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#061A4F]" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student freelance services, products, Motion Ground shops, jobs..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-slate-100 bg-white overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#061A4F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Results</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'}`}>
              {results.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-[#061A4F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#F5B400]" />
            <span>Student Services</span>
            <span className="text-[10px] text-slate-400">({results.services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'marketplace'
                ? 'bg-[#061A4F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3 h-3 text-[#F5B400]" />
            <span>Marketplace</span>
            <span className="text-[10px] text-slate-400">({results.products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shops')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'shops'
                ? 'bg-[#061A4F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-3 h-3 text-[#F5B400]" />
            <span>Campus Shops</span>
            <span className="text-[10px] text-slate-400">({results.shops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-[#061A4F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3 h-3 text-[#F5B400]" />
            <span>Jobs</span>
            <span className="text-[10px] text-slate-400">({results.jobs.length})</span>
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {results.total === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No results found for "{searchTerm}"</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for graphic design, Alhaja Biz Venture, photocopy, tutoring, project binding, or fashion.
              </p>
            </div>
          ) : (
            <>
              {/* 1. Student Services Results */}
              {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#061A4F]" />
                      Student Freelance Services ({results.services.length})
                    </span>
                    <button
                      onClick={() => handleSelect('/explore')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.services.slice(0, 4).map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => handleSelect('/explore')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-[#061A4F] hover:shadow-sm bg-white cursor-pointer transition flex items-center gap-3"
                      >
                        <UserAvatar name={srv.studentName} photoUrl={srv.studentPhoto} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{srv.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{srv.studentName} • {srv.category}</p>
                          <p className="text-xs font-black text-[#061A4F] mt-0.5">
                            ₦{(srv.startingPrice || srv.pricing?.basic?.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Marketplace Products Results */}
              {(activeTab === 'all' || activeTab === 'marketplace') && results.products.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                      Student Marketplace Products ({results.products.length})
                    </span>
                    <button
                      onClick={() => handleSelect('/marketplace')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                    >
                      Browse Marketplace <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.products.slice(0, 4).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelect('/marketplace')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-sm bg-white cursor-pointer transition flex items-center gap-3"
                      >
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80'}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{prod.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{prod.sellerName} • {prod.location || 'Ago-Iwoye'}</p>
                          <p className="text-xs font-black text-emerald-700 mt-0.5">
                            ₦{(prod.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Campus Shops Results */}
              {(activeTab === 'all' || activeTab === 'shops') && results.shops.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-blue-600" />
                      Verified Campus Shops ({results.shops.length})
                    </span>
                    <button
                      onClick={() => handleSelect('/campus')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                    >
                      Open Campus Hub <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.shops.slice(0, 4).map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => handleSelect('/campus')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-sm bg-white cursor-pointer transition flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#061A4F] text-[#F5B400] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                          {shop.shopCode}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 truncate">{shop.name}</p>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700">
                              Shop {shop.shopCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {shop.locationName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              {shop.rating}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600">Open Now</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Jobs & Opportunities Results */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      Client Job Opportunities ({results.jobs.length})
                    </span>
                    <button
                      onClick={() => handleSelect('/talent')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                    >
                      Explore Jobs <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.jobs.slice(0, 4).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleSelect('/talent')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:shadow-sm bg-white cursor-pointer transition"
                      >
                        <p className="text-xs font-bold text-slate-900 truncate">{job.title}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{job.category} • {job.scope || 'Medium'}</p>
                        <p className="text-xs font-black text-indigo-700 mt-1">
                          ₦{(job.budget?.min || 0).toLocaleString()} - ₦{(job.budget?.max || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>OOU StudentCircle Universal Search</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

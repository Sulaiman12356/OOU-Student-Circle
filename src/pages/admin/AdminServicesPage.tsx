import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { ServiceItem, getServicePrice } from '../../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  Star,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminServicesPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminServicesPage: React.FC<AdminServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>(DataStore.getServices());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (serviceId: string, status: ServiceItem['status']) => {
    DataStore.updateServiceStatus(serviceId, status);
    DataStore.logAdminAction(
      `SERVICE_STATUS_${status.toUpperCase()}`,
      'service',
      serviceId,
      `Updated service status to ${status.toUpperCase()}`
    );
    setServices(DataStore.getServices());
    showToast(`Service status updated to ${status}`);
    if (selectedService?.id === serviceId) {
      setSelectedService({ ...selectedService, status });
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service listing permanently?')) {
      DataStore.deleteService(serviceId);
      DataStore.logAdminAction('DELETE_SERVICE', 'service', serviceId, 'Permanently deleted service');
      setServices(DataStore.getServices());
      setSelectedService(null);
      showToast('Service listing deleted successfully.');
    }
  };

  const filteredServices = services.filter(s => {
    const matchSearch = 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchSearch && matchCat && matchStatus;
  });

  const categories = Array.from(new Set(services.map(s => s.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Service Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, flag, and moderate student freelance service offerings.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total Service Listings: <strong className="text-[#061A4F]">{services.length}</strong>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by title, student provider, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="under_review">Under Review</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Student Provider</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* Service Info */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.coverImage || service.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&auto=format&fit=crop&q=80'}
                          alt={service.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate" title={service.title}>
                            {service.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-[#F5B400] fill-[#F5B400]" />
                            <span className="font-bold text-slate-700">{service.rating || '5.0'}</span>
                            <span>({service.reviewsCount || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{service.studentName}</div>
                      <div className="text-[11px] text-slate-400">{service.studentDepartment || 'OOU Student'}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {service.category}
                      </span>
                    </td>

                    {/* Starting Price */}
                    <td className="py-3 px-4 font-bold text-[#061A4F]">
                      {service.pricingType === 'Custom Quote' 
                        ? 'Custom Quote' 
                        : `₦${getServicePrice(service).toLocaleString()}`}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        service.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : service.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : service.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {service.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="p-1.5 text-slate-500 hover:text-[#061A4F] hover:bg-slate-100 rounded-lg transition"
                          title="Preview Full Service"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {service.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(service.id, 'published')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Approve & Publish"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {service.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(service.id, 'rejected')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Reject Listing"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No services found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Preview Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-blue-50 text-[#061A4F] rounded font-bold text-[10px] uppercase">
                  {selectedService.category}
                </span>
                <h3 className="text-base font-bold text-[#061A4F]">
                  {selectedService.title}
                </h3>
                <div className="text-xs text-slate-500">
                  By {selectedService.studentName} ({selectedService.studentDepartment})
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Cover & Gallery */}
              {selectedService.coverImage && (
                <img
                  src={selectedService.coverImage}
                  alt={selectedService.title}
                  className="w-full h-52 object-cover rounded-2xl border border-slate-200"
                />
              )}

              {/* Description */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Service Description</span>
                <p className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-line">
                  {selectedService.description}
                </p>
              </div>

              {/* Pricing Tiers */}
              {selectedService.pricing?.tiers && (
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Configured Packages</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(selectedService.pricing.tiers).map(([tierKey, tier]) => {
                      const t = tier as { name: string; price: number; deliveryDays: number } | undefined;
                      return t ? (
                        <div key={tierKey} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="font-bold text-[#061A4F] capitalize">{t.name}</div>
                          <div className="text-sm font-extrabold text-emerald-700">₦{(t.price || 0).toLocaleString()}</div>
                          <div className="text-[11px] text-slate-500">{t.deliveryDays} Days Delivery</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Moderation Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedService.id, 'published')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedService.id, 'rejected')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Listing</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteService(selectedService.id)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                >
                  Delete
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

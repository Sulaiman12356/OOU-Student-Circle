import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { 
  ServiceItem, 
  ServiceRequest, 
  ServiceQuote, 
  ServiceOrder, 
  ServiceReview, 
  getServicePrice 
} from '../../types';
import { ServiceCreateModal } from '../../components/services/ServiceCreateModal';
import { ServiceQuoteModal } from '../../components/services/ServiceQuoteModal';
import { ServiceOrderModal } from '../../components/services/ServiceOrderModal';
import { ServiceReviewModal } from '../../components/services/ServiceReviewModal';
import { ServiceDetailModal } from '../../components/services/ServiceDetailModal';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Layers, 
  DollarSign, 
  Package, 
  FileText, 
  Send, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Award,
  Power,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

interface StudentServicesPageProps {
  initialCreateOpen?: boolean;
}

export const StudentServicesPage: React.FC<StudentServicesPageProps> = ({ 
  initialCreateOpen = false 
}) => {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id || 'student-1';

  // Active Tab: 'services' | 'requests' | 'quotes' | 'orders' | 'reviews'
  const [activeTab, setActiveTab] = useState<'services' | 'requests' | 'quotes' | 'orders' | 'reviews'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['services', 'requests', 'quotes', 'orders', 'reviews'].includes(tabParam)) {
      return tabParam as any;
    }
    return 'services';
  });

  // State lists
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [quotes, setQuotes] = useState<ServiceQuote[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [stats, setStats] = useState<any>({
    totalViews: 0,
    totalRequests: 0,
    totalQuotes: 0,
    activeOrders: 0,
    completedServices: 0,
    totalRevenue: 0,
    averageRating: 5.0,
    totalReviews: 0,
    publishedServicesCount: 0
  });

  // Modal Controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialCreateOpen);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [activeQuoteRequest, setActiveQuoteRequest] = useState<ServiceRequest | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeManageOrder, setActiveManageOrder] = useState<ServiceOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeReviewOrder, setActiveReviewOrder] = useState<ServiceOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Load provider data
  const refreshData = () => {
    const myServices = DataStore.getServicesByStudentId(studentId);
    const myRequests = DataStore.getServiceRequestsByProvider(studentId);
    const myQuotes = DataStore.getServiceQuotesByProvider(studentId);
    const myOrders = DataStore.getServiceOrdersByProvider(studentId);
    const myReviews = DataStore.getServiceReviewsByProvider(studentId);
    const myStats = DataStore.getProviderStats(studentId);

    setServices(myServices);
    setRequests(myRequests);
    setQuotes(myQuotes);
    setOrders(myOrders);
    setReviews(myReviews);
    setStats(myStats);
  };

  useEffect(() => {
    refreshData();
  }, [studentId]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setIsCreateModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to remove this service offering?')) {
      DataStore.deleteService(serviceId);
      refreshData();
    }
  };

  const handleToggleServiceStatus = (service: ServiceItem) => {
    const newStatus = service.status === 'published' ? 'paused' : 'published';
    const updated: ServiceItem = { ...service, status: newStatus, updatedAt: new Date().toISOString() };
    DataStore.saveService(updated);
    refreshData();
  };

  // Convert a request directly into an active Order
  const handleAcceptRequestDirectly = (req: ServiceRequest) => {
    const newOrder: ServiceOrder = {
      id: `ord-${Date.now()}`,
      requestId: req.id,
      serviceId: req.serviceId,
      serviceTitle: req.serviceTitle,
      providerId: req.providerId,
      providerName: req.providerName,
      customerId: req.customerId,
      customerName: req.customerName,
      customerDepartment: req.customerDepartment,
      amount: req.budget,
      deliveryDays: parseInt(req.deliveryTime, 10) || 3,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DataStore.saveServiceOrder(newOrder);
    DataStore.updateServiceRequestStatus(req.id, 'accepted', { orderId: newOrder.id });
    refreshData();
    setActiveTab('orders');
  };

  const handleDeclineRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to decline this request?')) {
      DataStore.updateServiceRequestStatus(requestId, 'declined');
      refreshData();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Studio Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#061A4F]" />
            Provider Hub & Service Studio
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Student Services Management
          </h1>
          <p className="text-xs text-gray-500">
            Manage your service offerings, quotes, client requests, orders, and verified customer reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Service</span>
          </button>
        </div>
      </div>

      {/* Real-Time Provider Statistics Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Views */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.totalViews}</div>
          <span className="text-[10px] text-gray-400">Market Impressions</span>
        </div>

        {/* Requests Received */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Requests</span>
            <Send className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-indigo-600">{stats.totalRequests}</div>
          <span className="text-[10px] text-gray-400">Client Inquiries</span>
        </div>

        {/* Quotes Sent */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Quotes Sent</span>
            <FileText className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600">{stats.totalQuotes}</div>
          <span className="text-[10px] text-gray-400">Custom Proposals</span>
        </div>

        {/* Active Orders */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Orders</span>
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          </div>
          <div className="text-xl font-black text-blue-700">{stats.activeOrders}</div>
          <span className="text-[10px] text-gray-400">In Fulfillment</span>
        </div>

        {/* Completed Services */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600">{stats.completedServices}</div>
          <span className="text-[10px] text-gray-400">Orders Delivered</span>
        </div>

        {/* Rating */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-600">
            {stats.averageRating.toFixed(1)}★
          </div>
          <span className="text-[10px] text-gray-400">({stats.totalReviews} Reviews)</span>
        </div>

        {/* Revenue */}
        <div className="p-4 rounded-xl bg-[#061A4F] text-white shadow-sm space-y-1 col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-white/70">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">
            ₦{stats.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-white/70">Paid & Released</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto scrollbar-none pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'services'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Published Services ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Incoming Requests ({requests.length})</span>
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations ({quotes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Service Orders ({orders.length})</span>
          {orders.filter(o => o.status === 'in_progress').length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {orders.filter(o => o.status === 'in_progress').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Verified Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: My Services */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#061A4F] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">No Services Listed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Start offering your skills in Graphic Design, Web Development, Tutoring, or Photography to other OOU students.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-5 py-2.5 rounded-xl bg-[#061A4F] text-white text-xs font-bold shadow-md hover:bg-[#082266] inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Service Listing</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc) => (
                <div 
                  key={svc.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <img 
                      src={svc.coverPhoto || svc.coverImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80'} 
                      alt={svc.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#061A4F]/90 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {svc.category}
                    </div>
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        svc.status === 'published' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-800 text-gray-200'
                      }`}>
                        {svc.status === 'published' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {svc.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {svc.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">VIEWS</span>
                        <span className="font-bold text-gray-900">{svc.viewsCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">ORDERS</span>
                        <span className="font-bold text-gray-900">{svc.completedOrders || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">RATE</span>
                        <span className="font-bold text-[#061A4F]">₦{getServicePrice(svc).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewService(svc);
                            setIsPreviewModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs"
                          title="Preview Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleServiceStatus(svc)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            svc.status === 'published' 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={svc.status === 'published' ? 'Pause Listing' : 'Publish Listing'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(svc)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
              <Send className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Incoming Requests</h3>
              <p className="text-xs text-gray-500">When clients request your services, their inquiries will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img 
                        src={req.customerPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'} 
                        alt={req.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{req.customerName}</h4>
                        <p className="text-xs text-gray-500">{req.customerDepartment} • Campus: {req.campus}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === 'pending' ? 'bg-indigo-50 text-indigo-700' :
                        req.status === 'quoted' ? 'bg-amber-50 text-amber-700' :
                        req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {req.status === 'pending' ? 'Pending Review' :
                         req.status === 'quoted' ? 'Quote Sent' :
                         req.status === 'accepted' ? 'Accepted & Active' : 'Declined'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h5 className="text-sm font-bold text-gray-900">
                        {req.title}
                      </h5>
                      <span className="text-xs font-bold text-[#061A4F]">
                        Budget: ₦{req.budget.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {req.requirements}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target: {req.deliveryTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveQuoteRequest(req);
                              setIsQuoteModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Send Custom Quote</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptRequestDirectly(req)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept at ₦{req.budget.toLocaleString()}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Quotes Sent */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
              <FileText className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Quotations Issued</h3>
              <p className="text-xs text-gray-500">Quotes you send in response to customer inquiries will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((qte) => (
                <div key={qte.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">{qte.customerName}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      qte.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      qte.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {qte.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-700 truncate">{qte.serviceTitle}</h5>
                    <div className="text-lg font-black text-[#061A4F]">₦{qte.price.toLocaleString()}</div>
                    <span className="text-[11px] text-gray-500">{qte.deliveryDays} Days Turnaround</span>
                  </div>

                  {qte.scopeBreakdown && qte.scopeBreakdown.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {qte.scopeBreakdown.map((s, i) => (
                        <div key={i} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {qte.message && (
                    <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-lg">
                      "{qte.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Service Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
              <Package className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Active Service Orders</h3>
              <p className="text-xs text-gray-500">Orders created from accepted requests and quotations will appear here for fulfillment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        #{ord.id.slice(-4)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{ord.serviceTitle}</h4>
                        <p className="text-xs text-gray-500">Client: {ord.customerName} ({ord.customerDepartment || 'Student'})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#061A4F] mr-2">
                        ₦{ord.amount.toLocaleString()}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ord.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                        ord.status === 'delivered' ? 'bg-amber-50 text-amber-700' :
                        ord.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {ord.status === 'in_progress' ? 'In Progress' :
                         ord.status === 'delivered' ? 'Delivered (Awaiting Approval)' :
                         ord.status === 'completed' ? 'Completed & Paid' : 'Cancelled'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Timeline: {ord.deliveryDays} Days</span>
                      {ord.completedAt && (
                        <span className="text-emerald-700 font-semibold">• Completed on {new Date(ord.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveManageOrder(ord);
                          setIsOrderModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        {ord.status === 'in_progress' ? 'Deliver Work' : 'View Order Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Verified Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
              <Award className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Reviews Received Yet</h3>
              <p className="text-xs text-gray-500">Clients leave verified reviews after completed orders.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={rev.customerPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'} 
                        alt={rev.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-gray-900">{rev.customerName}</h5>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified Transaction
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">On "{rev.serviceTitle}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && <h6 className="text-xs font-bold text-gray-900">"{rev.title}"</h6>}
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((t, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Service Creation / Edit Modal */}
      <ServiceCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingService(null);
        }}
        editingService={editingService}
        onSaved={() => {
          refreshData();
        }}
      />

      {/* Quote Submission Modal */}
      <ServiceQuoteModal
        isOpen={isQuoteModalOpen}
        request={activeQuoteRequest}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setActiveQuoteRequest(null);
        }}
        onSuccess={() => {
          refreshData();
          setActiveTab('quotes');
        }}
      />

      {/* Order Management Modal */}
      <ServiceOrderModal
        isOpen={isOrderModalOpen}
        order={activeManageOrder}
        onClose={() => {
          setIsOrderModalOpen(false);
          setActiveManageOrder(null);
        }}
        onOpenReview={(ord) => {
          setActiveReviewOrder(ord);
          setIsReviewModalOpen(true);
        }}
        onOrderUpdated={() => {
          refreshData();
        }}
      />

      {/* Verified Review Modal */}
      <ServiceReviewModal
        isOpen={isReviewModalOpen}
        order={activeReviewOrder}
        onClose={() => {
          setIsReviewModalOpen(false);
          setActiveReviewOrder(null);
        }}
        onSuccess={() => {
          refreshData();
          setActiveTab('reviews');
        }}
      />

      {/* Service Detail Preview Modal */}
      <ServiceDetailModal
        service={previewService}
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewService(null);
        }}
        onRequestService={() => {}}
        onMessageProvider={() => {}}
      />

    </div>
  );
};

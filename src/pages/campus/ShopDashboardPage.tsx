import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Users, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Send,
  Sparkles,
  Download,
  Settings,
  Eye
} from 'lucide-react';
import { CampusShop, CampusOrder, CampusService, CampusOrderStatus, calculateShopAvailability } from '../../types/campus';
import { CampusStore } from '../../services/campusStore';
import { useAuth } from '../../context/AuthContext';

interface ShopDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ShopDashboardPage: React.FC<ShopDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const shops = CampusStore.getShops();

  // Find owned shop or default to primary Alhaja Biz Venture Shop E6
  const activeShop = shops.find(s => s.ownerId === currentUser?.id) || shops[0];
  const [shop, setShop] = useState<CampusShop>(activeShop);

  const [orders, setOrders] = useState<CampusOrder[]>(() => CampusStore.getOrdersByShop(shop.id));
  const [services, setServices] = useState<CampusService[]>(() => CampusStore.getServicesByShop(shop.id));
  const [reviews, setReviews] = useState(() => CampusStore.getReviewsByShop(shop.id));

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'settings' | 'reviews'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'ready' | 'collected'>('all');

  // Verify Pickup Modal / Input
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [pickupVerifyResult, setPickupVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  // Quote Submission Modal State
  const [selectedOrderForQuote, setSelectedOrderForQuote] = useState<CampusOrder | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(2500);
  const [quoteNotes, setQuoteNotes] = useState('Standard printing and hardcover binding completed within 2 hours.');
  const [quoteReadyTime, setQuoteReadyTime] = useState('Today by 16:00');

  // New Service Modal State
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Project Printing');
  const [newServicePrice, setNewServicePrice] = useState(500);
  const [newServicePricingType, setNewServicePricingType] = useState<any>('fixed');
  const [newServiceTurnaround, setNewServiceTurnaround] = useState('30 minutes');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Status Switcher
  const handleSetOverride = (status: 'auto' | 'open' | 'busy' | 'closed') => {
    CampusStore.setShopManualOverride(shop.id, status);
    const updated = CampusStore.getShopById(shop.id);
    if (updated) setShop({ ...updated });
  };

  const handleUpdateOrderStatus = (orderId: string, status: CampusOrderStatus, note: string) => {
    const updated = CampusStore.updateOrderStatus(orderId, status, note, shop.name);
    if (updated) {
      setOrders(CampusStore.getOrdersByShop(shop.id));
    }
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForQuote) return;

    CampusStore.submitQuote(
      selectedOrderForQuote.id,
      quoteAmount,
      quoteNotes,
      quoteReadyTime
    );

    setOrders(CampusStore.getOrdersByShop(shop.id));
    setSelectedOrderForQuote(null);
  };

  const handleVerifyPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupCodeInput.trim()) return;

    const res = CampusStore.verifyAndCollectOrder(pickupCodeInput.trim(), shop.ownerName);
    setPickupVerifyResult(res);
    if (res.success) {
      setOrders(CampusStore.getOrdersByShop(shop.id));
      setPickupCodeInput('');
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle) return;

    CampusStore.saveService({
      id: `srv-${shop.shopCode.toLowerCase()}-${Date.now()}`,
      shopId: shop.id,
      shopName: shop.name,
      shopCode: shop.shopCode,
      locationName: shop.locationName,
      title: newServiceTitle.trim(),
      category: newServiceCategory,
      description: newServiceDesc.trim() || 'High quality campus service.',
      pricingType: newServicePricingType,
      unitPrice: newServicePrice,
      priceDescription: `₦${(newServicePrice || 0).toLocaleString()} ${newServicePricingType === 'per_page' ? 'per page' : ''}`,
      requiresDocumentUpload: true,
      status: 'active',
      estimatedTurnaround: newServiceTurnaround,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setServices(CampusStore.getServicesByShop(shop.id));
    setShowNewServiceModal(false);
    setNewServiceTitle('');
  };

  const availability = calculateShopAvailability(shop);

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'pending') return o.status === 'request_submitted' || o.status === 'price_confirmed' || o.status === 'awaiting_payment';
    if (orderFilter === 'processing') return o.status === 'payment_confirmed' || o.status === 'processing';
    if (orderFilter === 'ready') return o.status === 'ready_for_pickup';
    if (orderFilter === 'collected') return o.status === 'collected' || o.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Top Shop Banner & Live Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-[#061A4F] text-amber-300">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#061A4F]">
                {shop.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                Shop {shop.shopCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {shop.verificationStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#061A4F]" />
              <span>{shop.locationName} • {shop.specificArea}</span>
              <span>•</span>
              <span>Owner: {shop.ownerName}</span>
            </div>
          </div>
        </div>

        {/* Live Override Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="text-xs">
            <div className="font-bold text-slate-700">Live Availability:</div>
            <div className="text-[11px] font-semibold text-emerald-700">{availability.label}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleSetOverride('auto')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                shop.manualStatusOverride === 'auto' || !shop.manualStatusOverride
                  ? 'bg-[#061A4F] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Auto (Schedule)
            </button>
            <button
              onClick={() => handleSetOverride('busy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                shop.manualStatusOverride === 'busy'
                  ? 'bg-amber-500 text-[#061A4F] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Busy Queue
            </button>
            <button
              onClick={() => handleSetOverride('closed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                shop.manualStatusOverride === 'closed'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</div>
          <div className="text-xl sm:text-2xl font-black text-[#061A4F]">₦{(shop.totalRevenue || 0).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Direct Net Earnings
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders in Queue</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {orders.filter(o => o.status === 'processing' || o.status === 'payment_confirmed').length}
          </div>
          <div className="text-[11px] text-slate-500">Printing & binding now</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for Pickup</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {orders.filter(o => o.status === 'ready_for_pickup').length}
          </div>
          <div className="text-[11px] text-slate-500">Awaiting customer collection</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shop Rating</div>
          <div className="text-xl sm:text-2xl font-black text-[#061A4F] flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{shop.rating.toFixed(1)}</span>
          </div>
          <div className="text-[11px] text-slate-500">{shop.reviewsCount} verified reviews</div>
        </div>
      </div>

      {/* Pickup Quick Verification Box */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h3 className="text-sm font-bold text-white">Instant Physical Pickup Verification Desk</h3>
          </div>
          <span className="text-[11px] text-slate-400">Scan customer QR or enter 4-digit PIN / Reference</span>
        </div>

        <form onSubmit={handleVerifyPickup} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={pickupCodeInput}
            onChange={(e) => setPickupCodeInput(e.target.value)}
            placeholder="Enter Order Reference (e.g. SC-MG-E6-48291) or PIN (e.g. 4829)..."
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-300"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F5B400] text-[#061A4F] text-xs font-extrabold hover:bg-[#e0a400] transition"
          >
            Verify & Mark Collected
          </button>
        </form>

        {pickupVerifyResult && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            pickupVerifyResult.success
              ? 'bg-emerald-900/50 border border-emerald-500 text-emerald-200'
              : 'bg-rose-900/50 border border-rose-500 text-rose-200'
          }`}>
            {pickupVerifyResult.message}
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold transition border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders & Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-sm font-bold transition border-b-2 ${
            activeTab === 'services'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Services & Prices ({services.length})
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
      </div>

      {/* Tab 1: Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Order Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                orderFilter === 'all' ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('pending')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                orderFilter === 'pending' ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              New Requests & Quotes ({orders.filter(o => o.status === 'request_submitted' || o.status === 'price_confirmed').length})
            </button>
            <button
              onClick={() => setOrderFilter('processing')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                orderFilter === 'processing' ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              In Processing ({orders.filter(o => o.status === 'payment_confirmed' || o.status === 'processing').length})
            </button>
            <button
              onClick={() => setOrderFilter('ready')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                orderFilter === 'ready' ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ready for Pickup ({orders.filter(o => o.status === 'ready_for_pickup').length})
            </button>
            <button
              onClick={() => setOrderFilter('collected')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                orderFilter === 'collected' ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Collected & Done ({orders.filter(o => o.status === 'collected' || o.status === 'completed').length})
            </button>
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-[#061A4F]/30 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#061A4F]">
                      {order.referenceNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                      {order.customerType}
                    </span>
                    <span className="text-xs text-slate-500">
                      PIN: <strong className="font-mono text-slate-800">{order.pickupVerification.pickupCode}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-800 uppercase">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ₦{(order.pricing?.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Customer & Service Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Customer</div>
                    <div className="font-semibold text-slate-800">{order.customerName}</div>
                    <div className="text-slate-500">{order.customerPhone}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Service & Specs</div>
                    <div className="font-semibold text-slate-800">{order.serviceName}</div>
                    <div className="text-slate-500">
                      {order.specifications.copies} copies • {order.specifications.colorMode || 'Standard'} • {order.specifications.bindingType || 'None'}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Target Pickup</div>
                    <div className="font-semibold text-slate-800">{order.specifications.preferredPickupDate || 'Today'}</div>
                    <div className="text-slate-500">{order.specifications.preferredPickupTime || 'ASAP'}</div>
                  </div>
                </div>

                {/* Attached Files & Notes */}
                {order.uploadedFiles && order.uploadedFiles.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#061A4F]" />
                      <span>Uploaded Files for Printing ({order.uploadedFiles.length}):</span>
                    </div>
                    {order.uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="truncate font-mono">{file.name}</span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-[#061A4F] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#0A2265]"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download / Print</span>
                        </a>
                      </div>
                    ))}
                    {order.specifications.customNotes && (
                      <div className="text-slate-600 pt-1">
                        <strong>Customer Note:</strong> {order.specifications.customNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {order.status === 'request_submitted' && (
                    <button
                      onClick={() => setSelectedOrderForQuote(order)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-[#061A4F] text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Send Custom Quote</span>
                    </button>
                  )}

                  {order.status === 'payment_confirmed' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'processing', 'Printing & binding started at shop.')}
                      className="px-4 py-2 rounded-xl bg-[#061A4F] text-white text-xs font-bold hover:bg-[#0A2265] transition"
                    >
                      Start Printing / Processing
                    </button>
                  )}

                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'ready_for_pickup', 'Order is sealed and ready for collection.')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'collected', 'Customer collected package physically at counter.')}
                      className="px-4 py-2 rounded-xl bg-[#061A4F] text-amber-300 text-xs font-bold hover:bg-[#0A2265] transition"
                    >
                      Mark Collected
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 2: Services Management */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#061A4F]">Shop Services & Rates</h2>
              <p className="text-xs text-slate-500">Configure what students and aspirants can order from your shop</p>
            </div>
            <button
              onClick={() => setShowNewServiceModal(true)}
              className="px-4 py-2 rounded-xl bg-[#061A4F] text-white text-xs font-bold hover:bg-[#0A2265] transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#F5B400]" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#061A4F]/5 text-[#061A4F]">
                    {service.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {service.priceDescription || `₦${service.unitPrice}`}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
                <p className="text-xs text-slate-600">{service.description}</p>
                <div className="text-[11px] text-slate-400">
                  Turnaround: <strong>{service.estimatedTurnaround}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-[#061A4F]">Customer Reviews ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.customerName} ({rev.customerType})</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 italic">"{rev.comment}"</p>
                <div className="text-[10px] text-slate-400">{rev.serviceName} • {new Date(rev.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Submission Modal */}
      {selectedOrderForQuote && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-slate-800">
            <h3 className="text-base font-bold text-[#061A4F]">Submit Quote for {selectedOrderForQuote.referenceNumber}</h3>
            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Quote Price (₦) *</label>
                <input
                  type="number"
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border text-sm font-bold text-[#061A4F]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Estimated Ready Time *</label>
                <input
                  type="text"
                  required
                  value={quoteReadyTime}
                  onChange={(e) => setQuoteReadyTime(e.target.value)}
                  placeholder="e.g. In 45 minutes, Tomorrow 10am"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Quote Notes for Customer</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#061A4F] text-white font-bold rounded-xl"
                >
                  Send Quote
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForQuote(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Service Modal */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-slate-800">
            <h3 className="text-base font-bold text-[#061A4F]">Add New Shop Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="e.g. Passport Photos (8 copies)"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Category</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border"
                >
                  <option value="Project Printing">Project Printing</option>
                  <option value="Project Binding">Project Binding</option>
                  <option value="Photocopy">Photocopy</option>
                  <option value="Passport Photograph">Passport Photograph</option>
                  <option value="Online Verification">Online Verification</option>
                  <option value="Stationery">Stationery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Pricing Model</label>
                  <select
                    value={newServicePricingType}
                    onChange={(e: any) => setNewServicePricingType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="per_page">Per Page</option>
                    <option value="quote_required">Quote Required</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={newServiceTurnaround}
                  onChange={(e) => setNewServiceTurnaround(e.target.value)}
                  placeholder="e.g. 15 minutes, Same Day"
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#061A4F] text-white font-bold rounded-xl"
                >
                  Publish Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

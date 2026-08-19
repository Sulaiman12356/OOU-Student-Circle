import React, { useState } from 'react';
import { 
  VendorProfile, 
  ProductItem, 
  VendorOrder, 
  PayoutRequest, 
  OrderStatus 
} from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { ProductFormModal } from './ProductFormModal';
import { PromoteProductModal } from './PromoteProductModal';
import { VendorStorefront } from './VendorStorefront';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Wallet, 
  Sparkles, 
  Settings, 
  Plus, 
  Edit, 
  Pause, 
  Play, 
  Trash2, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap,
  ChevronRight,
  Truck,
  X
} from 'lucide-react';

interface VendorDashboardProps {
  onNavigate?: (path: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id || 'student-1';
  
  const vendor = MarketplaceStore.getVendorByStudentId(studentId);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'wallet' | 'promotions' | 'settings'>('overview');

  // Modals
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedProductToPromote, setSelectedProductToPromote] = useState<ProductItem | null>(null);
  const [storefrontOpen, setStorefrontOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(2000);
  const [payoutError, setPayoutError] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState('');

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<VendorOrder | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Settings Form
  const [storeName, setStoreName] = useState(vendor?.storeName || '');
  const [bio, setBio] = useState(vendor?.businessDescription || '');
  const [whatsapp, setWhatsapp] = useState(vendor?.whatsappNumber || '');
  const [location, setLocation] = useState(vendor?.location || '');
  const [bankName, setBankName] = useState(vendor?.bankInfo?.bankName || 'Kuda Bank');
  const [accountNumber, setAccountNumber] = useState(vendor?.bankInfo?.accountNumber || '');
  const [accountName, setAccountName] = useState(vendor?.bankInfo?.accountName || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!vendor) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Store className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Vendor Profile Found</h3>
        <p className="text-xs text-slate-500">
          You haven't activated a student vendor profile yet. Create a profile to start listing and selling products to fellow OOU students!
        </p>
        <button
          onClick={() => onNavigate?.('/marketplace')}
          className="px-6 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F]"
        >
          Go to Marketplace to Register
        </button>
      </div>
    );
  }

  // Live calculations
  const products = MarketplaceStore.getProductsByVendor(vendor.id);
  const orders = MarketplaceStore.getVendorOrdersForVendor(vendor.id);
  const metrics = MarketplaceStore.getVendorMetrics(vendor.id);
  const promotions = MarketplaceStore.getVendorPromotions(vendor.id);
  const payoutHistory = MarketplaceStore.getVendorPayouts(vendor.id);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'pending') return o.status === 'confirmed';
    if (orderFilter === 'in_progress') return o.status === 'processing' || o.status === 'ready_for_pickup' || o.status === 'out_for_delivery';
    if (orderFilter === 'completed') return o.status === 'delivered' || o.status === 'completed';
    return true;
  });

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProductFormOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleToggleProductStatus = (p: ProductItem) => {
    const newStatus = p.status === 'published' ? 'paused' : 'published';
    MarketplaceStore.updateProductStatus(p.id, newStatus);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      MarketplaceStore.deleteProduct(productId);
    }
  };

  const handleOpenPromote = (p: ProductItem) => {
    setSelectedProductToPromote(p);
    setPromoteModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    MarketplaceStore.updateVendorOrderStatus(orderId, newStatus, statusUpdateNote || undefined);
    setSelectedOrderForStatus(null);
    setStatusUpdateNote('');
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');
    setPayoutSuccess('');

    const res = MarketplaceStore.requestPayout(vendor.id, vendor.storeName, payoutAmount, {
      bankName: vendor.bankInfo?.bankName || 'Kuda Bank',
      accountNumber: vendor.bankInfo?.accountNumber || '2001928374',
      accountName: vendor.bankInfo?.accountName || vendor.studentName
    });

    if (res.success) {
      setPayoutSuccess('Payout request submitted successfully. Funds will transfer within 12-24 hours.');
      setTimeout(() => {
        setPayoutModalOpen(false);
        setPayoutSuccess('');
      }, 2000);
    } else {
      setPayoutError(res.message);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    MarketplaceStore.saveVendor({
      ...vendor,
      storeName: storeName.trim(),
      businessDescription: bio.trim(),
      whatsappNumber: whatsapp.trim(),
      location: location.trim(),
      bankInfo: {
        bankName,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim()
      }
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const openWhatsAppBuyer = (order: VendorOrder) => {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? `234${phone.slice(1)}` : phone;
    const msg = encodeURIComponent(`Hello ${order.customerName}! I am ${vendor.storeName} regarding your order #${order.id} for "${order.items.map(i => i.title).join(', ')}".`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="vendor-dashboard-container" className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={vendor.profileImage} 
            alt={vendor.storeName} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#F5B400] shadow-lg flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{vendor.storeName}</h1>
              {vendor.verificationStatus === 'approved' && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Student Vendor
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Owner: {vendor.studentName} ({vendor.studentDepartment || 'Undergraduate'}) • {vendor.location}
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-300 font-bold mt-1.5">
              <span>★ {vendor.rating?.toFixed(1) || '5.0'} Rating</span>
              <span>•</span>
              <span>{orders.length} Orders Processed</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setStorefrontOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="px-5 py-2.5 bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] rounded-xl text-xs font-black shadow-lg transition active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Store Overview', icon: Store },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: metrics.pendingOrders },
          { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
          { id: 'promotions', label: 'Promote & Ads', icon: Sparkles },
          { id: 'settings', label: 'Store Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? 'bg-[#061A4F] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B400]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Gross Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₦{metrics.grossEarnings.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Net Earned: <strong className="text-slate-700">₦{metrics.netEarnings.toLocaleString()}</strong> (10% fee deducted)
              </p>
            </div>

            {/* Available Wallet Balance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Available for Payout</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-700">
                ₦{metrics.availableBalance.toLocaleString()}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Min ₦2,000</span>
                <button
                  onClick={() => {
                    setPayoutModalOpen(true);
                    setPayoutAmount(Math.min(metrics.availableBalance, 5000));
                  }}
                  disabled={metrics.availableBalance < 2000}
                  className="text-[11px] font-bold text-blue-600 hover:underline disabled:opacity-40"
                >
                  Withdraw Funds →
                </button>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Pending Orders</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600">
                {metrics.pendingOrders}
              </div>
              <p className="text-[11px] text-slate-400">
                {metrics.completedOrders} orders completed & delivered
              </p>
            </div>

            {/* Catalog Stock Health */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Active Products</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {products.length}
              </div>
              <p className="text-[11px] text-slate-400">
                {metrics.outOfStockProducts > 0 ? (
                  <span className="text-rose-600 font-bold">{metrics.outOfStockProducts} out of stock</span>
                ) : (
                  <span className="text-emerald-700 font-bold">All items in stock</span>
                )}
              </p>
            </div>

          </div>

          {/* Quick Actions & Recent Orders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 cols: Recent Orders needing fulfillment */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-500">Student orders requiring preparation and delivery</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="text-xs text-slate-400">No orders received yet.</p>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
                  >
                    List More Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 4).map((vo) => (
                    <div key={vo.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{vo.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            vo.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                            vo.status === 'delivered' || vo.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {vo.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Buyer: <strong>{vo.customerName}</strong> ({vo.customerPhone})
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm">
                          {vo.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => openWhatsAppBuyer(vo)}
                          title="Chat on WhatsApp"
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrderForStatus(vo);
                            setActiveTab('orders');
                          }}
                          className="px-3 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F]"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4 cols: Store Promotion & Tools */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Boost Card */}
              <div className="p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-[#061A4F] text-white rounded-3xl shadow-md space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-200" />
                </div>
                <h4 className="font-black text-base">Promote on Marketplace</h4>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Put your bestselling products at the top of the campus homepage and get 5x more direct orders.
                </p>
                <button
                  onClick={() => setActiveTab('promotions')}
                  className="w-full py-2.5 bg-white text-[#061A4F] font-black text-xs rounded-xl hover:bg-amber-50 transition shadow"
                >
                  View Promo Packages
                </button>
              </div>

              {/* Vendor Tips Card */}
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Campus Vendor Best Practices
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Always keep your phone and WhatsApp reachable for instant buyers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Update stock counts immediately when you sell items in person.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Fulfill orders within 24 hours to earn 5-star student reviews.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 2. PRODUCTS CATALOG TAB */}
      {/* ========================================== */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Your Product Listings ({products.length})</h3>
              <p className="text-xs text-slate-500">Manage physical items, inventory, prices, and status</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4 text-[#F5B400]" />
              <span>Add New Product</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">No products listed yet</h4>
              <p className="text-xs text-slate-400">Click "Add New Product" to list your first campus product.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {products.map((p) => {
                const isOutOfStock = p.quantity <= 0 || p.status === 'out_of_stock';
                const isPaused = p.status === 'paused';

                return (
                  <div 
                    key={p.id} 
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={p.mainImage || p.images[0]} 
                        alt={p.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                          {p.isPromoted && (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-[#061A4F] rounded">
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isOutOfStock ? 'bg-rose-100 text-rose-800' :
                            isPaused ? 'bg-slate-200 text-slate-700' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="font-black text-slate-900">₦{p.price.toLocaleString()}</span>
                          {p.discountPrice && (
                            <span className="text-slate-400 line-through">₦{p.discountPrice.toLocaleString()}</span>
                          )}
                          <span>•</span>
                          <span>Category: {p.category}</span>
                          <span>•</span>
                          <span>Stock: <strong className={p.quantity <= 3 ? 'text-amber-600' : 'text-slate-800'}>{p.quantity} left</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleOpenPromote(p)}
                        className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#061A4F] rounded-xl transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Promote</span>
                      </button>

                      <button
                        onClick={() => handleToggleProductStatus(p)}
                        className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                        title={isPaused ? 'Publish Listing' : 'Pause Listing'}
                      >
                        {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-2 text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 hover:bg-rose-50 rounded-xl transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 3. ORDERS FULFILLMENT TAB */}
      {/* ========================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Student Orders & Fulfillment</h3>
              <p className="text-xs text-slate-500">Track and dispatch items ordered by student buyers</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending Action' },
                { id: 'in_progress', label: 'In Progress / Dispatched' },
                { id: 'completed', label: 'Delivered / Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    orderFilter === f.id ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm font-bold text-slate-700">No orders in this category</p>
              <p className="text-xs text-slate-400">All student orders for your store will show here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((vo) => (
                <div key={vo.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">Suborder #{vo.id}</span>
                        <span className="text-xs text-slate-400 font-mono">Parent: {vo.parentOrderId}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Placed on {new Date(vo.createdAt).toLocaleDateString()} at {new Date(vo.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg ${
                        vo.status === 'confirmed' ? 'bg-amber-100 text-amber-900' :
                        vo.status === 'delivered' || vo.status === 'completed' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-blue-100 text-blue-900'
                      }`}>
                        {vo.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Products & Buyer Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Items List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Items Ordered:</span>
                      {vo.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                            <p className="text-[11px] text-slate-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                          </div>
                          <span className="text-xs font-black text-slate-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Buyer Delivery Details */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Buyer Details</span>
                        <button
                          onClick={() => openWhatsAppBuyer(vo)}
                          className="px-2 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp Buyer</span>
                        </button>
                      </div>
                      <p className="font-bold text-slate-900">{vo.customerName}</p>
                      <p className="text-slate-600">Phone: {vo.customerPhone} • {vo.customerEmail}</p>
                      <p className="text-slate-600">
                        Fulfillment: <strong className="text-blue-700">{vo.deliveryMethod.toUpperCase()}</strong> ({vo.deliveryAddress})
                      </p>
                      {vo.customerNotes && (
                        <p className="text-amber-800 bg-amber-50 p-2 rounded-lg italic">
                          Note: "{vo.customerNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial & Status Action Row */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 space-x-2">
                      <span>Subtotal: <strong>₦{vo.subtotal.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Delivery: <strong>₦{vo.deliveryFee.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        Net Earnings: ₦{(vo.netVendorEarnings + vo.deliveryFee).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {vo.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(vo.id, 'processing')}
                          className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                        >
                          Mark Processing
                        </button>
                      )}

                      {vo.status === 'processing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(vo.id, vo.deliveryMethod === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery')}
                          className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                        >
                          {vo.deliveryMethod === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'}
                        </button>
                      )}

                      {(vo.status === 'ready_for_pickup' || vo.status === 'out_for_delivery') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(vo.id, 'delivered')}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                        >
                          Mark Delivered
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrderForStatus(vo)}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl"
                      >
                        Change Status...
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 4. WALLET & PAYOUTS TAB */}
      {/* ========================================== */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Available Balance */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500">Available For Withdrawal</span>
              <div className="text-3xl font-black text-emerald-700">
                ₦{metrics.availableBalance.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Ready to transfer to {vendor.bankInfo?.bankName}</p>
              <button
                onClick={() => setPayoutModalOpen(true)}
                disabled={metrics.availableBalance < 2000}
                className="w-full mt-2 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl transition disabled:opacity-40"
              >
                Request Payout Withdrawal
              </button>
            </div>

            {/* Pending Balance */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500">Pending Escrow Balance</span>
              <div className="text-3xl font-black text-amber-600">
                ₦{metrics.pendingBalance.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Will release automatically upon order delivery</p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500">Total Withdrawn To Date</span>
              <div className="text-3xl font-black text-slate-900">
                ₦{metrics.withdrawnAmount.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Transferred safely to your bank account</p>
            </div>

          </div>

          {/* Bank Account Info Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Payout Bank Account</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Bank Name</span>
                <strong className="text-slate-800">{vendor.bankInfo?.bankName || 'Not Set'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Account Number</span>
                <strong className="text-slate-800 font-mono">{vendor.bankInfo?.accountNumber || 'Not Set'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Account Name</span>
                <strong className="text-slate-800">{vendor.bankInfo?.accountName || vendor.studentName}</strong>
              </div>
            </div>
          </div>

          {/* Payout History Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-base text-slate-900">Payout Withdrawal Requests</h4>
            {payoutHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No payout withdrawals requested yet.</p>
            ) : (
              <div className="space-y-2.5">
                {payoutHistory.map((req) => (
                  <div key={req.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{req.id}</span>
                      <p className="text-[11px] text-slate-500">
                        {new Date(req.requestedAt).toLocaleDateString()} to {req.bankName} ({req.accountNumber})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900 block">₦{req.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                        req.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 5. PROMOTIONS TAB */}
      {/* ========================================== */}
      {activeTab === 'promotions' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Advertising & Product Promotions</h3>
              <p className="text-xs text-slate-500">Supercharge your store impressions across the student community</p>
            </div>
            <button
              onClick={() => {
                if (products.length > 0) {
                  handleOpenPromote(products[0]);
                } else {
                  alert('Please list a product first before advertising.');
                }
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#061A4F] rounded-xl text-xs font-black shadow transition flex items-center gap-1.5 self-start sm:self-center"
            >
              <Zap className="w-4 h-4" />
              <span>Launch New Ad Campaign</span>
            </button>
          </div>

          {/* Active Campaigns */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Active & Past Campaigns</h4>
            {promotions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs text-slate-500">No active promotions running.</p>
                <p className="text-[11px] text-slate-400">Featured items receive on average 5x higher customer orders.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {promotions.map((pr) => (
                  <div key={pr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={pr.productImage} alt={pr.productTitle} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-slate-900">{pr.productTitle}</h5>
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-[#061A4F] rounded">
                            {pr.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{pr.packageName} • ₦{pr.cost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {pr.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Duration: {pr.durationDays} days</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. SETTINGS TAB */}
      {/* ========================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 className="font-black text-lg text-slate-900">Store Profile & Payout Settings</h3>
            <p className="text-xs text-slate-500">Update your public brand identity and financial details</p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Store profile updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Store / Brand Name *
              </label>
              <input 
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Store Bio & Description *
              </label>
              <textarea 
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  WhatsApp Contact Number *
                </label>
                <input 
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Campus Base Location *
                </label>
                <input 
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Bank Payout Account
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Bank</label>
                  <input 
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Account Number</label>
                  <input 
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Account Name</label>
                  <input 
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl shadow transition"
            >
              Save Store Changes
            </button>
          </div>
        </form>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        product={editingProduct}
        vendorId={vendor.id}
        isOpen={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        onSuccess={() => {
          // refresh triggers automatically via local state update
        }}
      />

      {/* Promote Product Modal */}
      {selectedProductToPromote && (
        <PromoteProductModal
          product={selectedProductToPromote}
          isOpen={promoteModalOpen}
          onClose={() => setPromoteModalOpen(false)}
        />
      )}

      {/* Public Storefront Modal Preview */}
      <VendorStorefront
        vendorId={vendor.id}
        isOpen={storefrontOpen}
        onClose={() => setStorefrontOpen(false)}
        onViewProduct={(p) => {}}
        onAddToCart={(p) => {}}
      />

      {/* Order Status Update Modal */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Update Order #{selectedOrderForStatus.id}</h3>
              <button onClick={() => setSelectedOrderForStatus(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select New Order Status
                </label>
                <select
                  defaultValue={selectedOrderForStatus.status}
                  id="select-order-status"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">In Preparation (Processing)</option>
                  <option value="ready_for_pickup">Ready for Campus Pickup</option>
                  <option value="out_for_delivery">Out for Delivery (Rider Dispatched)</option>
                  <option value="delivered">Delivered / Handed Over</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="disputed">Flagged / Under Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tracking Note / Message to Buyer (Optional)
                </label>
                <textarea
                  rows={3}
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  placeholder="e.g. Package is ready at the ICT center pickup counter, please meet with rider."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selectEl = document.getElementById('select-order-status') as HTMLSelectElement;
                    if (selectEl) {
                      handleUpdateOrderStatus(selectedOrderForStatus.id, selectEl.value as OrderStatus);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow"
                >
                  Apply Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Withdrawal Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Request Payout Withdrawal</h3>
              <button onClick={() => setPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Withdrawal Amount (₦ NGN) *
                </label>
                <input 
                  type="number"
                  min={2000}
                  max={metrics.availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Available: ₦{metrics.availableBalance.toLocaleString()} (Min ₦2,000)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p>Transfer destination:</p>
                <p className="font-bold text-slate-900">
                  {vendor.bankInfo?.bankName} • {vendor.bankInfo?.accountNumber} ({vendor.bankInfo?.accountName})
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  MessageSquare,
  Star,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  ShoppingBag,
  Briefcase,
  Store,
  Layers,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PartyInfo, TransactionType, UnifiedOrder, TransactionRequest, TransactionQuote, OrderDispute } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency } from '../../config/paymentConfig';
import { OrderDetailModal } from '../../components/transaction/OrderDetailModal';
import { UnifiedRequestModal } from '../../components/transaction/UnifiedRequestModal';
import { UnifiedQuoteModal } from '../../components/transaction/UnifiedQuoteModal';
import { SecurePaymentGatewayModal } from '../../components/transaction/SecurePaymentGatewayModal';
import { VerifiedReviewModal } from '../../components/transaction/VerifiedReviewModal';
import { DisputeModal } from '../../components/transaction/DisputeModal';
import { AdminDisputeResolutionModal } from '../../components/transaction/AdminDisputeResolutionModal';
import { TransactionEngineTestHarness } from '../../components/transaction/TransactionEngineTestHarness';

interface TransactionsHubPageProps {
  onNavigate?: (path: string) => void;
  onOpenDirectChat?: (recipientId: string, recipientName: string) => void;
}

type TabType = 'orders' | 'requests' | 'quotes' | 'disputes';
type StatusFilter = 'all' | 'unpaid' | 'active' | 'delivered' | 'completed' | 'disputed' | 'cancelled';

export const TransactionsHubPage: React.FC<TransactionsHubPageProps> = ({
  onNavigate,
  onOpenDirectChat
}) => {
  const { currentUser, role } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [requests, setRequests] = useState<TransactionRequest[]>([]);
  const [quotes, setQuotes] = useState<TransactionQuote[]>([]);
  const [disputes, setDisputes] = useState<OrderDispute[]>([]);
  
  // Modals
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedQuoteForOrder, setSelectedQuoteForOrder] = useState<TransactionQuote | null>(null);
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState<TransactionRequest | null>(null);
  const [disputeToResolve, setDisputeToResolve] = useState<OrderDispute | null>(null);

  const partyUser: PartyInfo = currentUser ? {
    id: currentUser.id,
    name: currentUser.name || currentUser.fullName || 'User',
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    photo: currentUser.avatar || currentUser.profilePhoto,
    role: currentUser.role as any,
    departmentOrCompany: currentUser.department || currentUser.companyName,
    faculty: currentUser.faculty,
    level: currentUser.level,
    location: currentUser.campusLocation || currentUser.location
  } : {
    id: '',
    name: 'Guest User',
    role: 'student'
  };

  const refreshData = () => {
    if (!currentUser) return;
    setOrders(TransactionEngineStore.getOrdersForUser(currentUser.id, role));
    setRequests(TransactionEngineStore.getRequestsForUser(currentUser.id, role));
    setQuotes(TransactionEngineStore.getQuotesForUser(currentUser.id, role));
    setDisputes(TransactionEngineStore.getDisputesForUser(currentUser.id, role));
  };

  useEffect(() => {
    refreshData();
  }, [currentUser, role]);

  // Filtering Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.targetItemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.seller.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || o.type === typeFilter;

    let matchesStatus = true;
    if (statusFilter === 'unpaid') matchesStatus = o.paymentStatus === 'unpaid';
    else if (statusFilter === 'active') matchesStatus = ['Paid', 'Confirmed', 'Processing', 'Ready'].includes(o.status);
    else if (statusFilter === 'delivered') matchesStatus = o.status === 'Delivered';
    else if (statusFilter === 'completed') matchesStatus = o.status === 'Completed';
    else if (statusFilter === 'disputed') matchesStatus = o.status === 'Disputed';
    else if (statusFilter === 'cancelled') matchesStatus = ['Cancelled', 'Refunded'].includes(o.status);

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch = 
      q.quoteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || q.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAcceptQuote = (quote: TransactionQuote) => {
    const newOrder = TransactionEngineStore.acceptQuoteAndCreateOrder(quote.id);
    if (newOrder) {
      refreshData();
      setSelectedOrderId(newOrder.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-[#061A4F] text-[#F5B400]">
              Unified Engine
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Escrow Secured
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Transaction & Orders Hub</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover, Request, Quote, Pay, Track, Deliver, Settle, and Review across Services, Products, Campus Hub, and Jobs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Interactive Test Harness */}
      <TransactionEngineTestHarness
        currentUser={partyUser}
        onRefreshOrders={refreshData}
      />

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-6">
          <div className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'quotes'
                  ? 'border-[#061A4F] text-[#061A4F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              Quotes ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'disputes'
                  ? 'border-rose-600 text-rose-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Scale className="w-4 h-4 text-rose-600" />
              Disputes ({disputes.length})
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, item, buyer, seller..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="service">Services</option>
              <option value="product">Marketplace Products</option>
              <option value="campus_service">Campus Hub</option>
              <option value="job">Jobs & Milestones</option>
            </select>

            {/* Status selector (for orders) */}
            {activeTab === 'orders' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="unpaid">Awaiting Payment</option>
                <option value="active">Active in Progress</option>
                <option value="delivered">Delivered / Awaiting Review</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
                <option value="cancelled">Cancelled / Refunded</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: ORDERS TABLE / CARDS */}
        {activeTab === 'orders' && (
          <div className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No transactions found</p>
                <p>Use the test harness above or request a service to start your first escrow transaction.</p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isBuyer = ord.buyerId === currentUser?.id || ord.buyer.id === currentUser?.id;
                const isSeller = ord.sellerId === currentUser?.id || ord.seller.id === currentUser?.id;

                return (
                  <div
                    key={ord.id}
                    className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${
                        ord.type === 'service' ? 'bg-blue-100 text-blue-800' :
                        ord.type === 'product' ? 'bg-emerald-100 text-emerald-800' :
                        ord.type === 'campus_service' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {ord.type === 'service' ? <Briefcase className="w-5 h-5" /> :
                         ord.type === 'product' ? <ShoppingBag className="w-5 h-5" /> :
                         ord.type === 'campus_service' ? <Store className="w-5 h-5" /> :
                         <Layers className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {ord.orderId}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                            {ord.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            ord.status === 'Delivered' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            ord.status === 'Paid' || ord.status === 'Processing' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                            ord.status === 'Disputed' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            ord.status === 'Cancelled' || ord.status === 'Refunded' ? 'bg-slate-200 text-slate-700' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {ord.status}
                          </span>
                          {ord.paymentStatus === 'paid' && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Escrow Paid
                            </span>
                          )}
                          {ord.hasReview && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400" /> Reviewed
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900">{ord.targetItemTitle}</h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>Buyer: <strong className="text-slate-700">{ord.buyer.name}</strong></span>
                          <span>•</span>
                          <span>Provider: <strong className="text-slate-700">{ord.seller.name}</strong></span>
                          <span>•</span>
                          <span>Created: {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                        <span className="text-base font-extrabold text-[#061A4F]">{formatCurrency(ord.amount)}</span>
                        {isSeller && (
                          <span className="text-[10px] text-emerald-700 block font-semibold">
                            Net: {formatCurrency(ord.netSellerAmount)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedOrderId(ord.id)}
                        className="px-4 py-2 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage Order
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: REQUESTS TABLE */}
        {activeTab === 'requests' && (
          <div className="divide-y divide-slate-100">
            {filteredRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No requests found</p>
                <p>Submit custom requests to students and sellers to receive competitive quotes.</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {req.requestId}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                        {req.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{req.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{req.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>From: <strong>{req.buyer.name}</strong></span>
                      <span>To: <strong>{req.seller.name}</strong></span>
                      {req.budget && <span>Budget: <strong className="text-emerald-700">{formatCurrency(req.budget)}</strong></span>}
                      {req.expectedDeliveryDays && <span>Desired: <strong>{req.expectedDeliveryDays} Days</strong></span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* If current user is seller and status is pending, allow sending quote */}
                    {req.sellerId === currentUser?.id && req.status === 'pending' && (
                      <button
                        onClick={() => setSelectedRequestForQuote(req)}
                        className="px-4 py-2 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#F5B400]" />
                        Send Quote
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: QUOTES TABLE */}
        {activeTab === 'quotes' && (
          <div className="divide-y divide-slate-100">
            {filteredQuotes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No quotes found</p>
                <p>Quotes sent by student providers will appear here for customer review and acceptance.</p>
              </div>
            ) : (
              filteredQuotes.map((quo) => {
                const isBuyer = quo.buyerId === currentUser?.id;
                const isSeller = quo.sellerId === currentUser?.id;

                return (
                  <div key={quo.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {quo.quoteId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          quo.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          quo.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {quo.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Turnaround: <strong>{quo.deliveryTime}</strong></span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{quo.requestTitle}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{quo.message}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span>Provider: <strong className="text-slate-700">{quo.seller.name}</strong></span>
                        <span>Customer: <strong className="text-slate-700">{quo.buyer.name}</strong></span>
                        <span>Valid until: {new Date(quo.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Quote Price</span>
                        <span className="text-lg font-black text-[#061A4F]">{formatCurrency(quo.amount)}</span>
                      </div>

                      {isBuyer && quo.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => TransactionEngineStore.declineQuote(quo.id, 'Customer declined terms.') && refreshData()}
                            className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAcceptQuote(quo)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Accept Quote
                          </button>
                        </div>
                      )}

                      {quo.status === 'accepted' && quo.orderId && (
                        <button
                          onClick={() => setSelectedOrderId(quo.orderId!)}
                          className="px-4 py-2 bg-[#061A4F] text-white rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          View Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: DISPUTES TABLE */}
        {activeTab === 'disputes' && (
          <div className="divide-y divide-slate-100">
            {disputes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Scale className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No dispute cases</p>
                <p>All campus transactions are operating with zero active grievances.</p>
              </div>
            ) : (
              disputes.map((disp) => (
                <div key={disp.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {disp.disputeId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        disp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        disp.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {disp.status}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">{disp.reasonLabel}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{disp.orderTitle}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{disp.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Opened by: <strong>{disp.openedBy.name}</strong></span>
                      <span>Against: <strong>{disp.against.name}</strong></span>
                      <span>Date: {new Date(disp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Frozen Escrow</span>
                      <span className="text-base font-extrabold text-rose-900">{formatCurrency(disp.orderAmount)}</span>
                    </div>

                    {role === 'admin' && disp.status !== 'Resolved' && (
                      <button
                        onClick={() => setDisputeToResolve(disp)}
                        className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5 text-[#F5B400]" />
                        Arbitrate Case
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Sub Modals */}
      {selectedOrderId && (
        <OrderDetailModal
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          orderId={selectedOrderId}
          currentUser={partyUser}
          onOrderUpdated={refreshData}
          onOpenDirectChat={onOpenDirectChat}
        />
      )}

      {selectedRequestForQuote && (
        <UnifiedQuoteModal
          isOpen={!!selectedRequestForQuote}
          onClose={() => setSelectedRequestForQuote(null)}
          request={selectedRequestForQuote}
          onQuoteSent={() => {
            refreshData();
            setActiveTab('quotes');
          }}
        />
      )}

      {disputeToResolve && (
        <AdminDisputeResolutionModal
          isOpen={!!disputeToResolve}
          onClose={() => setDisputeToResolve(null)}
          dispute={disputeToResolve}
          adminUser={partyUser}
          onDisputeResolved={refreshData}
        />
      )}
    </div>
  );
};

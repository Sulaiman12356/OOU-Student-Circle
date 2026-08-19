import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Paperclip,
  Send,
  Lock,
  User,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Truck,
  Sparkles,
  Star,
  Check,
  RotateCcw
} from 'lucide-react';
import { UnifiedOrder, PartyInfo, UnifiedOrderStatus } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency } from '../../config/paymentConfig';
import { SecurePaymentGatewayModal } from './SecurePaymentGatewayModal';
import { VerifiedReviewModal } from './VerifiedReviewModal';
import { DisputeModal } from './DisputeModal';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentUser: PartyInfo;
  onOrderUpdated?: (order: UnifiedOrder) => void;
  onOpenDirectChat?: (recipientId: string, recipientName: string) => void;
}

const LIFECYCLE_STEPS: { key: string; label: string; desc: string }[] = [
  { key: 'discover', label: '1. Discover', desc: 'Item or service selected' },
  { key: 'request', label: '2. Request', desc: 'Custom inquiry submitted' },
  { key: 'quote', label: '3. Quote', desc: 'Formal pricing sent' },
  { key: 'accept', label: '4. Accept', desc: 'Terms agreed & order created' },
  { key: 'pay', label: '5. Escrow Pay', desc: 'Funds secured in campus vault' },
  { key: 'process', label: '6. Process', desc: 'Active execution & production' },
  { key: 'complete', label: '7. Complete', desc: 'Deliverables verified & funds released' },
  { key: 'review', label: '8. Review', desc: 'Post-completion verified rating' }
];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentUser,
  onOrderUpdated,
  onOpenDirectChat
}) => {
  const [order, setOrder] = useState<UnifiedOrder | null>(() => TransactionEngineStore.getOrderById(orderId));
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'deliverables'>('timeline');

  // Sub-modal states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);

  // Delivery Submission State (for seller)
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryFileUrl, setDeliveryFileUrl] = useState('');
  const [deliveryFiles, setDeliveryFiles] = useState<string[]>([]);
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  // Cancel State
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen) return null;

  // Real-time lookup
  const currentOrder = TransactionEngineStore.getOrderById(orderId) || order;

  // SECURITY AUTHORIZATION CHECK (URL Manipulation Guard)
  const isAuthorized = TransactionEngineStore.isUserAuthorizedForOrder(
    currentUser.id,
    currentUser.role,
    orderId
  );

  if (!isAuthorized || !currentOrder) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
            <p className="text-xs text-slate-600 mt-1">
              You are not authorized to view transaction #{orderId}. Transactions are strictly confidential to the buyer, seller, and platform administrators.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  const isBuyer = currentUser.id === currentOrder.buyerId || currentUser.id === currentOrder.buyer.id;
  const isSeller = currentUser.id === currentOrder.sellerId || currentUser.id === currentOrder.seller.id;
  const isAdmin = currentUser.role === 'admin';

  const handlePaymentSuccess = (updatedOrder: UnifiedOrder) => {
    setOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  const handleStatusTransition = (newStatus: UnifiedOrderStatus, note: string) => {
    const res = TransactionEngineStore.updateOrderStatus(currentOrder.id, newStatus, note, {
      name: currentUser.name,
      role: currentUser.role
    });
    if (res.success && res.order) {
      setOrder(res.order);
      if (onOrderUpdated) onOrderUpdated(res.order);
    }
  };

  const handleDeliverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNotes.trim()) return;

    setIsSubmittingDelivery(true);
    const res = TransactionEngineStore.deliverOrder(
      currentOrder.id,
      deliveryNotes.trim(),
      deliveryFiles,
      currentUser
    );

    setIsSubmittingDelivery(false);
    if (res.success && res.order) {
      setOrder(res.order);
      if (onOrderUpdated) onOrderUpdated(res.order);
      setDeliveryNotes('');
      setDeliveryFiles([]);
    }
  };

  const handleCompleteOrder = () => {
    const res = TransactionEngineStore.completeOrder(currentOrder.id, currentUser);
    if (res.success && res.order) {
      setOrder(res.order);
      if (onOrderUpdated) onOrderUpdated(res.order);
    }
  };

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) return;
    const res = TransactionEngineStore.cancelOrder(currentOrder.id, currentUser, cancelReason.trim());
    if (res.success) {
      const updated = TransactionEngineStore.getOrderById(currentOrder.id);
      setOrder(updated);
      setIsCancelConfirmOpen(false);
      if (onOrderUpdated && updated) onOrderUpdated(updated);
    }
  };

  const handleAddDeliveryFile = () => {
    if (deliveryFileUrl.trim()) {
      setDeliveryFiles(prev => [...prev, deliveryFileUrl.trim()]);
      setDeliveryFileUrl('');
    }
  };

  // Determine active step index for the lifecycle stepper
  const getStepProgressIndex = (status: UnifiedOrderStatus, paymentStatus: string, hasReview: boolean) => {
    if (hasReview) return 7;
    if (status === 'Completed') return 6;
    if (status === 'Delivered') return 5;
    if (['Processing', 'Ready'].includes(status)) return 5;
    if (status === 'Confirmed') return 4;
    if (status === 'Paid' || paymentStatus === 'paid') return 4;
    if (status === 'Pending') return 3;
    return 2;
  };

  const currentStepIdx = getStepProgressIndex(currentOrder.status, currentOrder.paymentStatus, currentOrder.hasReview);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#061A4F] to-[#0A267A] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5B400] text-[#061A4F]">
                Order #{currentOrder.orderId}
              </span>
              <span className="text-xs text-blue-200 font-medium capitalize">
                {currentOrder.type.replace('_', ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentOrder.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                currentOrder.status === 'Paid' ? 'bg-blue-500/20 text-blue-300' :
                currentOrder.status === 'Disputed' ? 'bg-rose-500/20 text-rose-300' :
                currentOrder.status === 'Cancelled' ? 'bg-slate-500/20 text-slate-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {currentOrder.status}
              </span>
            </div>
            <h2 className="text-lg font-bold line-clamp-1">{currentOrder.targetItemTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Lifecycle Stepper */}
        <div className="bg-slate-900 px-4 py-3 shrink-0 overflow-x-auto text-white">
          <div className="flex items-center justify-between min-w-[620px] px-2">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-col items-center relative flex-1">
                  {/* Connector line */}
                  {idx < LIFECYCLE_STEPS.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-1/2 w-full h-0.5 z-0 ${
                        idx < currentStepIdx ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#F5B400] text-[#061A4F] ring-4 ring-[#F5B400]/30 shadow-lg'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-bold truncate max-w-[70px] text-center ${
                    isCurrent ? 'text-[#F5B400]' : isPast ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {step.label.split('. ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-[#061A4F] text-[#061A4F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Order Lifecycle & Timeline
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[#061A4F] text-[#061A4F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Financials & Parties
          </button>
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'deliverables'
                ? 'border-[#061A4F] text-[#061A4F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deliverables & Files {currentOrder.deliveryFiles && `(${currentOrder.deliveryFiles.length})`}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Active Status Alert Banner */}
          {currentOrder.status === 'Pending' && currentOrder.paymentStatus === 'unpaid' && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Awaiting Escrow Payment</p>
                  <p className="text-[11px] text-amber-700">Payment must be secured in the campus vault before the provider starts work.</p>
                </div>
              </div>
              {isBuyer && (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="px-4 py-2 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F5B400]" />
                  Pay {formatCurrency(currentOrder.amount)}
                </button>
              )}
            </div>
          )}

          {currentOrder.status === 'Delivered' && (
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Work Submitted for Approval</p>
                  <p className="text-[11px] text-blue-700">Review the deliverables. Approving releases funds directly from escrow to the provider.</p>
                </div>
              </div>
              {isBuyer && (
                <button
                  onClick={handleCompleteOrder}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Release Funds
                </button>
              )}
            </div>
          )}

          {currentOrder.status === 'Completed' && !currentOrder.hasReview && isBuyer && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Transaction Completed!</p>
                  <p className="text-[11px] text-emerald-700">You are eligible to leave a verified 5-star review for {currentOrder.seller.name}.</p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#061A4F] rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-[#061A4F]" />
                Write Verified Review
              </button>
            </div>
          )}

          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tracking Updates</h3>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentOrder.trackingUpdates.map((update, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#061A4F] border-2 border-white ring-2 ring-blue-100" />
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-white text-slate-700 rounded text-[10px] font-mono border">
                            {update.status}
                          </span>
                          {update.actorName && (
                            <span className="text-slate-500 font-normal">by {update.actorName} ({update.actorRole})</span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{update.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Provider Active Management Bar */}
              {isSeller && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Provider Lifecycle Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentOrder.status === 'Paid' && (
                      <button
                        onClick={() => handleStatusTransition('Confirmed', 'Seller accepted order and locked production slot.')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                      >
                        Confirm & Accept Order
                      </button>
                    )}
                    {['Paid', 'Confirmed'].includes(currentOrder.status) && (
                      <button
                        onClick={() => handleStatusTransition('Processing', 'Production / work commenced by provider.')}
                        className="px-3.5 py-1.5 bg-[#061A4F] hover:bg-[#082269] text-white rounded-lg text-xs font-bold"
                      >
                        Start Processing
                      </button>
                    )}
                    {currentOrder.status === 'Processing' && (
                      <button
                        onClick={() => handleStatusTransition('Ready', 'Order is finalized and ready for dispatch/delivery.')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                      >
                        Mark Ready for Delivery
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FINANCIALS & PARTIES */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Financial Breakdown Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Escrow Ledger Breakdown</h3>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(currentOrder.subtotal)}</span>
                </div>
                {currentOrder.deliveryFee !== undefined && currentOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">{formatCurrency(currentOrder.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Platform Commission:</span>
                  <span className="font-semibold">{formatCurrency(currentOrder.platformFee)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Gross Total (Held in Escrow):</span>
                  <span className="text-[#061A4F] text-base">{formatCurrency(currentOrder.amount)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-emerald-700 pt-1">
                  <span>Net Payout to Provider:</span>
                  <span>{formatCurrency(currentOrder.netSellerAmount)}</span>
                </div>
              </div>

              {/* Payment Details */}
              {currentOrder.paymentDetails && (
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Escrow Vault Payment Confirmation
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                    <span>Reference: <strong className="font-mono text-slate-800">{currentOrder.paymentDetails.reference}</strong></span>
                    <span>Channel: <strong className="capitalize text-slate-800">{currentOrder.paymentDetails.channel.replace('_', ' ')}</strong></span>
                    <span>Paid At: <strong className="text-slate-800">{currentOrder.paymentDetails.paidAt ? new Date(currentOrder.paymentDetails.paidAt).toLocaleString() : 'Confirmed'}</strong></span>
                    <span>Status: <strong className="text-emerald-700">Secured in Vault</strong></span>
                  </div>
                </div>
              )}

              {/* Counterparties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer / Buyer</span>
                  <p className="font-bold text-slate-800">{currentOrder.buyer.name}</p>
                  <p className="text-slate-500">{currentOrder.buyer.departmentOrCompany || currentOrder.buyer.role}</p>
                  {onOpenDirectChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDirectChat(currentOrder.buyerId, currentOrder.buyer.name);
                      }}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Chat with Customer
                    </button>
                  )}
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Provider / Seller</span>
                  <p className="font-bold text-slate-800">{currentOrder.seller.name}</p>
                  <p className="text-slate-500">{currentOrder.seller.departmentOrCompany || currentOrder.seller.role}</p>
                  {onOpenDirectChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDirectChat(currentOrder.sellerId, currentOrder.seller.name);
                      }}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Chat with Provider
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERABLES & FILES */}
          {activeTab === 'deliverables' && (
            <div className="space-y-4">
              {currentOrder.deliveryNotes && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Provider Submission Notes</span>
                  <p className="text-xs text-slate-800 leading-relaxed">{currentOrder.deliveryNotes}</p>
                </div>
              )}

              {currentOrder.deliveryFiles && currentOrder.deliveryFiles.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deliverable Files</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentOrder.deliveryFiles.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between text-xs text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                          <span className="truncate">{url}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">No deliverable files uploaded yet.</p>
              )}

              {/* Upload Form for Provider */}
              {isSeller && ['Processing', 'Ready', 'Confirmed'].includes(currentOrder.status) && (
                <form onSubmit={handleDeliverSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Submit Final Deliverables</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Deliverable Notes & Download Instructions *
                    </label>
                    <textarea
                      rows={3}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Explain the deliverables, download links, credentials, or pickup instructions..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Attachment / Cloud Drive Links
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={deliveryFileUrl}
                        onChange={(e) => setDeliveryFileUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or live preview URL"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddDeliveryFile}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>

                  {deliveryFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {deliveryFiles.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                          <span className="max-w-[200px] truncate">{f}</span>
                          <button type="button" onClick={() => setDeliveryFiles(prev => prev.filter((_, idx) => idx !== i))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingDelivery}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingDelivery ? 'Submitting...' : 'Submit Deliverables for Customer Approval'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Disputer & Cancel actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Cancel Button */}
            {!['Completed', 'Cancelled', 'Disputed'].includes(currentOrder.status) && (
              <button
                type="button"
                onClick={() => setIsCancelConfirmOpen(true)}
                className="px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            )}

            {/* Dispute Button */}
            {['Paid', 'Confirmed', 'Processing', 'Delivered'].includes(currentOrder.status) && (
              <button
                type="button"
                onClick={() => setIsDisputeOpen(true)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Raise Dispute
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Close Window
          </button>
        </div>

        {/* Cancellation Confirmation Sub-prompt */}
        {isCancelConfirmOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Confirm Order Cancellation</h4>
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel this order? {currentOrder.paymentStatus === 'paid' ? 'Your escrow payment will be instantly refunded.' : ''}
              </p>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Cancellation Reason *</label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict or requirements changed"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub Modals */}
        {isPaymentOpen && (
          <SecurePaymentGatewayModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            order={currentOrder}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {isReviewOpen && (
          <VerifiedReviewModal
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            order={currentOrder}
            currentUser={currentUser}
            onReviewSubmitted={() => {
              const updated = TransactionEngineStore.getOrderById(currentOrder.id);
              if (updated) setOrder(updated);
            }}
          />
        )}

        {isDisputeOpen && (
          <DisputeModal
            isOpen={isDisputeOpen}
            onClose={() => setIsDisputeOpen(false)}
            order={currentOrder}
            currentUser={currentUser}
            onDisputeOpened={() => {
              const updated = TransactionEngineStore.getOrderById(currentOrder.id);
              if (updated) setOrder(updated);
            }}
          />
        )}
      </div>
    </div>
  );
};

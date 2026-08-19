import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Store, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { CampusOrder, CampusOrderStatus } from '../../types/campus';
import { CampusStore } from '../../services/campusStore';
import { useAuth } from '../../context/AuthContext';

interface OrderTrackerModalProps {
  initialReference?: string;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  initialReference = '',
  onClose
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialReference);
  const [activeOrder, setActiveOrder] = useState<CampusOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Review state
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (initialReference) {
      handleSearch(initialReference);
    }
  }, [initialReference]);

  const handleSearch = (ref?: string) => {
    const query = (ref || searchQuery).trim();
    if (!query) {
      setErrorMsg('Please enter an order reference (e.g. SC-MG-E6-48291).');
      return;
    }
    setErrorMsg('');

    const order = CampusStore.getOrderByReference(query);
    if (order) {
      setActiveOrder(order);
    } else {
      setErrorMsg(`No order found matching "${query}". Please check the reference code.`);
      setActiveOrder(null);
    }
  };

  const handleRespondToQuote = (accept: boolean) => {
    if (!activeOrder) return;
    const updated = CampusStore.respondToQuote(
      activeOrder.id, 
      accept, 
      currentUser?.fullName || activeOrder.customerName
    );
    if (updated) {
      setActiveOrder({ ...updated });
    }
  };

  const handlePayBalance = () => {
    if (!activeOrder) return;
    const updated = CampusStore.confirmPayment(
      activeOrder.id,
      'paystack',
      `PSTK_CAMPUS_${Math.floor(100000 + Math.random() * 900000)}`
    );
    if (updated) {
      setActiveOrder({ ...updated });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    CampusStore.addReview({
      shopId: activeOrder.shopId,
      orderId: activeOrder.id,
      referenceNumber: activeOrder.referenceNumber,
      customerId: currentUser?.id || activeOrder.customerId,
      customerName: currentUser?.fullName || activeOrder.customerName,
      customerType: activeOrder.customerType === 'aspirant' ? 'Aspirant' : 'Student',
      rating: reviewRating,
      comment: reviewComment.trim(),
      serviceName: activeOrder.serviceName
    });

    setReviewSubmitted(true);
  };

  const getStepStatus = (stepIndex: number, currentStatus: CampusOrderStatus) => {
    const statusOrder: CampusOrderStatus[] = [
      'request_submitted',
      'payment_confirmed',
      'processing',
      'ready_for_pickup',
      'collected'
    ];

    const currentIdx = statusOrder.indexOf(currentStatus);
    if (currentIdx > stepIndex) return 'completed';
    if (currentIdx === stepIndex) return 'current';
    return 'upcoming';
  };

  const steps = [
    { label: 'Submitted', desc: 'Request received' },
    { label: 'Confirmed', desc: 'Payment verified' },
    { label: 'Processing', desc: 'Printing & binding' },
    { label: 'Ready for Pickup', desc: 'Available at shop' },
    { label: 'Collected', desc: 'Handed over' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#061A4F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Track Campus Hub Order
              </h2>
              <p className="text-xs text-amber-300">
                Check print status, quotes, and pickup readiness
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Reference (e.g. SC-MG-E6-48291)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-5 py-2.5 rounded-xl bg-[#061A4F] text-white text-xs font-bold hover:bg-[#0A2265] transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Active Order Details */}
          {activeOrder && (
            <div className="space-y-6">
              
              {/* Reference Card Header */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Order Reference</div>
                  <div className="text-lg font-black font-mono text-[#061A4F]">{activeOrder.referenceNumber}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{activeOrder.customerName}</span> ({activeOrder.customerType})
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#061A4F] text-amber-300">
                    {activeOrder.status.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Pickup PIN: <span className="font-mono font-bold text-slate-700">{activeOrder.pickupVerification.pickupCode}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Lifecycle Status:
                </div>
                <div className="grid grid-cols-5 gap-1 relative">
                  {steps.map((step, idx) => {
                    const status = getStepStatus(idx, activeOrder.status);
                    return (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : status === 'current'
                            ? 'bg-[#061A4F] text-amber-300 ring-4 ring-amber-300/30'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className={`text-[11px] font-bold ${
                          status === 'current' ? 'text-[#061A4F]' : (status === 'completed' ? 'text-emerald-800' : 'text-slate-400')
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-[9px] text-slate-400 hidden sm:block">
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shop & Location Pickup Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#061A4F]">
                  <Store className="w-4 h-4 text-[#F5B400]" />
                  <span>Pickup Location: {activeOrder.shopName} (Shop {activeOrder.shopCode})</span>
                </div>
                <div className="text-xs text-slate-700 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeOrder.locationName} • Block {activeOrder.shopCode}</span>
                </div>
                <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-amber-200/50">
                  <strong>How to collect:</strong> Present order reference <span className="font-mono font-bold text-[#061A4F]">{activeOrder.referenceNumber}</span> or 4-digit PIN <span className="font-mono font-bold">{activeOrder.pickupVerification.pickupCode}</span> to the shop attendant.
                </p>
              </div>

              {/* Order Items & Files */}
              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 text-sm">{activeOrder.serviceName}</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Copies: <span className="font-semibold text-slate-800">{activeOrder.specifications.copies}</span></div>
                  <div>Color: <span className="font-semibold text-slate-800">{activeOrder.specifications.colorMode || 'Standard'}</span></div>
                  <div>Binding: <span className="font-semibold text-slate-800">{activeOrder.specifications.bindingType || 'None'}</span></div>
                  <div>Total Amount: <span className="font-semibold text-emerald-700">₦{(activeOrder.pricing?.totalAmount || 0).toLocaleString()}</span></div>
                </div>

                {activeOrder.uploadedFiles && activeOrder.uploadedFiles.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <div className="font-semibold text-slate-600 mb-1">Attached Files:</div>
                    {activeOrder.uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-2 text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-[#061A4F]" />
                        <span className="truncate font-mono">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quote Acceptance Panel (if awaiting quote response) */}
              {activeOrder.status === 'price_confirmed' && activeOrder.quote && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                  <div className="text-xs font-bold text-amber-900">Custom Quote from {activeOrder.shopName}:</div>
                  <div className="text-lg font-black text-amber-900">₦{(activeOrder.quote.amount || 0).toLocaleString()}</div>
                  <div className="text-xs text-amber-800">
                    Notes: {activeOrder.quote.notes}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespondToQuote(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      Accept Quote & Proceed
                    </button>
                    <button
                      onClick={() => handleRespondToQuote(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Action if awaiting payment */}
              {activeOrder.status === 'awaiting_payment' && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-900">Awaiting Payment</div>
                    <div className="text-sm font-black text-blue-900">₦{(activeOrder.pricing?.totalAmount || 0).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={handlePayBalance}
                    className="px-4 py-2 bg-[#061A4F] text-white rounded-lg text-xs font-bold hover:bg-[#0A2265]"
                  >
                    Pay with Paystack
                  </button>
                </div>
              )}

              {/* Review Section if Collected */}
              {activeOrder.status === 'collected' && !reviewSubmitted && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Order Completed & Collected</span>
                    <button
                      onClick={() => setShowReviewBox(!showReviewBox)}
                      className="text-xs font-bold text-[#061A4F] hover:underline"
                    >
                      {showReviewBox ? 'Cancel' : 'Rate & Review This Shop'}
                    </button>
                  </div>

                  {showReviewBox && (
                    <form onSubmit={handleSubmitReview} className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Your Rating:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1"
                            >
                              <Star className={`w-5 h-5 ${
                                star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="How was the printing quality, binding speed, and shop experience?"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-lg hover:bg-[#0A2265]"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  )}
                </div>
              )}

              {reviewSubmitted && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                  Thank you! Your verified review has been submitted to {activeOrder.shopName}.
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

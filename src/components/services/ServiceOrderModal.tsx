import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { ServiceOrder } from '../../types';
import { 
  X, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Upload, 
  FileText, 
  ExternalLink,
  Star,
  Download,
  Check
} from 'lucide-react';

interface ServiceOrderModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReview?: (order: ServiceOrder) => void;
  onOrderUpdated?: () => void;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenReview,
  onOrderUpdated
}) => {
  const { currentUser } = useAuth();
  
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [deliveryFiles, setDeliveryFiles] = useState<string[]>([]);
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const isProvider = currentUser?.id === order.providerId;
  const isCustomer = currentUser?.id === order.customerId;

  const handleAddFileUrl = () => {
    if (!fileUrlInput.trim()) return;
    setDeliveryFiles((prev) => [...prev, fileUrlInput.trim()]);
    setFileUrlInput('');
  };

  const handleDeliverWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNotes.trim()) {
      setActionError('Please provide delivery notes explaining what was completed.');
      return;
    }

    DataStore.updateServiceOrderStatus(
      order.id, 
      'delivered', 
      deliveryNotes.trim(), 
      deliveryFiles.length > 0 ? deliveryFiles : ['https://drive.google.com/oou-deliverable-package.zip']
    );

    setIsSubmittingDelivery(false);
    if (onOrderUpdated) onOrderUpdated();
    onClose();
  };

  const handleApproveAndComplete = () => {
    DataStore.updateServiceOrderStatus(order.id, 'completed');
    if (onOrderUpdated) onOrderUpdated();
    if (onOpenReview) {
      onOpenReview({ ...order, status: 'completed' });
    }
    onClose();
  };

  const getStatusBadge = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Delivered (Reviewing)
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      id="service-order-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#061A4F]/10 text-[#061A4F] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  Order #{order.id}
                </h2>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-gray-500 truncate max-w-[280px]">
                {order.serviceTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {actionError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Order Snapshot Card */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Amount</span>
              <span className="text-sm font-black text-[#061A4F]">₦{order.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Client</span>
              <span className="font-bold text-gray-900 truncate block">{order.customerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Provider</span>
              <span className="font-bold text-gray-900 truncate block">{order.providerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Timeline</span>
              <span className="font-bold text-gray-900">{order.deliveryDays} Days</span>
            </div>
          </div>

          {/* Work Delivery Section */}
          {order.status === 'delivered' || order.status === 'completed' ? (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Work Delivered by Provider</span>
              </div>
              {order.deliveryNotes && (
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
                  {order.deliveryNotes}
                </p>
              )}
              {order.deliveryFiles && order.deliveryFiles.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Deliverable Downloads:
                  </span>
                  {order.deliveryFiles.map((f, idx) => (
                    <a
                      key={idx}
                      href={f}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Deliverable Package ({idx + 1})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Provider Delivery Form */}
          {isSubmittingDelivery ? (
            <form onSubmit={handleDeliverWork} className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
              <h4 className="text-xs font-bold text-[#061A4F] uppercase tracking-wider">
                Submit Your Final Deliverables
              </h4>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Delivery Notes & Summary *
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={3}
                  placeholder="Explain what has been completed, attach Google Drive or download links, and describe the deliverables..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Deliverable URL (Google Drive / Dropbox / Figma)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={fileUrlInput}
                    onChange={(e) => setFileUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddFileUrl}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    Add URL
                  </button>
                </div>
                {deliveryFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {deliveryFiles.map((f, i) => (
                      <div key={i} className="text-[11px] text-gray-600 bg-white p-1.5 rounded truncate">
                        🔗 {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmittingDelivery(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#082266]"
                >
                  Confirm & Deliver Work
                </button>
              </div>
            </form>
          ) : null}

          {/* Action Triggers */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2">
            {/* Provider Deliver Action */}
            {isProvider && order.status === 'in_progress' && !isSubmittingDelivery && (
              <button
                type="button"
                onClick={() => setIsSubmittingDelivery(true)}
                className="px-4 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Deliver Work</span>
              </button>
            )}

            {/* Customer Approval Action */}
            {isCustomer && order.status === 'delivered' && (
              <button
                type="button"
                onClick={handleApproveAndComplete}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Mark Completed</span>
              </button>
            )}

            {/* Customer Review Trigger on Completed Order */}
            {isCustomer && order.status === 'completed' && !order.hasReview && onOpenReview && (
              <button
                type="button"
                onClick={() => {
                  onOpenReview(order);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Leave Verified Review</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

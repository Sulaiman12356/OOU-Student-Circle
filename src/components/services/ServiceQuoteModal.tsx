import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { ServiceRequest, ServiceQuote } from '../../types';
import { 
  X, 
  Send, 
  Sparkles, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface ServiceQuoteModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ServiceQuoteModal: React.FC<ServiceQuoteModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  
  const [price, setPrice] = useState<number>(request?.budget || 10000);
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [message, setMessage] = useState('');
  const [scopeItems, setScopeItems] = useState<string[]>([
    'High-resolution final source files',
    'Up to 3 rounds of modifications/revisions',
    'Fast priority delivery on campus'
  ]);
  const [newScopeItem, setNewScopeItem] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const handleAddScopeItem = () => {
    if (!newScopeItem.trim()) return;
    setScopeItems((prev) => [...prev, newScopeItem.trim()]);
    setNewScopeItem('');
  };

  const handleRemoveScopeItem = (index: number) => {
    setScopeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!price || price <= 0) {
      setError('Please specify a valid price for your quotation.');
      return;
    }

    const newQuote: ServiceQuote = {
      id: `qte-${Date.now()}`,
      requestId: request.id,
      serviceId: request.serviceId,
      serviceTitle: request.serviceTitle,
      providerId: currentUser.id,
      providerName: currentUser.fullName,
      providerPhoto: currentUser.profilePhoto,
      providerDepartment: currentUser.department || 'Student Freelancer',
      customerId: request.customerId,
      customerName: request.customerName,
      price: Number(price),
      deliveryDays: Number(deliveryDays),
      deliveryTime: `${deliveryDays} days`,
      scopeBreakdown: scopeItems,
      message: message.trim() || `I would love to help you with ${request.title}. Here is my custom quote tailored to your requirements.`,
      status: 'pending',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DataStore.saveServiceQuote(newQuote);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div 
      id="service-quote-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              💼
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Send Custom Quotation
              </h2>
              <p className="text-xs text-gray-500">
                Replying to {request.customerName} for "{request.title}"
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Request Requirements Recap */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Client Request Brief:
            </span>
            <p className="text-xs text-gray-800 line-clamp-3 leading-relaxed">
              {request.requirements}
            </p>
          </div>

          {/* Price & Turnaround */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Your Quoted Price (₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₦</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={500}
                  step={500}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs font-bold text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Delivery Time (Days) *
              </label>
              <input
                type="number"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                min={1}
                max={30}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs font-bold text-gray-900"
                required
              />
            </div>
          </div>

          {/* Scope Breakdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              Deliverables & Scope Breakdown
            </label>
            
            <div className="space-y-1.5">
              {scopeItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs border border-gray-200">
                  <span className="text-gray-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveScopeItem(idx)}
                    className="text-gray-400 hover:text-red-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newScopeItem}
                onChange={(e) => setNewScopeItem(e.target.value)}
                placeholder="Add deliverable point (e.g. 2 Final Mockups)"
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900"
              />
              <button
                type="button"
                onClick={handleAddScopeItem}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Message / Cover Note */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Message to Client
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Hi! I have reviewed your project requirements and can deliver high quality results quickly..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Quotation (₦{price.toLocaleString()})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, Paperclip, AlertCircle, Sparkles, Clock, MapPin, Tag } from 'lucide-react';
import { PartyInfo, TransactionType, TransactionRequest } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency } from '../../config/paymentConfig';

interface UnifiedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: {
    id: string;
    title: string;
    type: TransactionType;
    category?: string;
    image?: string;
    seller: PartyInfo;
    suggestedPrice?: number;
  };
  currentUser: PartyInfo;
  onRequestCreated: (request: TransactionRequest) => void;
}

export const UnifiedRequestModal: React.FC<UnifiedRequestModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  currentUser,
  onRequestCreated
}) => {
  const [title, setTitle] = useState(targetItem.title ? `Request: ${targetItem.title}` : '');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<string>(targetItem.suggestedPrice ? targetItem.suggestedPrice.toString() : '');
  const [expectedDays, setExpectedDays] = useState<string>('3');
  const [location, setLocation] = useState(currentUser.location || 'Ago-Iwoye Main Campus');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddAttachment = () => {
    if (attachmentUrl.trim()) {
      setAttachments(prev => [...prev, attachmentUrl.trim()]);
      setAttachmentUrl('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a detailed description of your request.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const budgetNum = budget ? parseInt(budget, 10) : undefined;
      const daysNum = expectedDays ? parseInt(expectedDays, 10) : undefined;

      const newRequest = TransactionEngineStore.createRequest({
        buyer: currentUser,
        seller: targetItem.seller,
        type: targetItem.type,
        targetItemId: targetItem.id,
        targetItemTitle: targetItem.title,
        targetItemCategory: targetItem.category,
        targetItemImage: targetItem.image,
        title: title.trim() || `Request for ${targetItem.title}`,
        description: description.trim(),
        budget: budgetNum,
        expectedDeliveryDays: daysNum,
        deliveryLocation: location.trim(),
        attachments
      });

      onRequestCreated(newRequest);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit transaction request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#061A4F] to-[#0A267A] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5B400] text-[#061A4F]">
                Step 1: Request
              </span>
              <span className="text-xs text-blue-200 font-medium capitalize">{targetItem.type.replace('_', ' ')} Inquiry</span>
            </div>
            <h2 className="text-xl font-bold">Request Service or Custom Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item summary card */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {targetItem.image ? (
              <img src={targetItem.image} alt={targetItem.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                OOU
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-800 text-sm line-clamp-1">{targetItem.title}</p>
              <p className="text-xs text-slate-500">
                Provider: <span className="font-medium text-slate-700">{targetItem.seller.name}</span>
                {targetItem.seller.departmentOrCompany && ` (${targetItem.seller.departmentOrCompany})`}
              </p>
            </div>
          </div>
          {targetItem.suggestedPrice && (
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Base Price</span>
              <span className="font-bold text-[#061A4F] text-sm">{formatCurrency(targetItem.suggestedPrice)}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Request Title / Summary
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design 3D Logo with Full Brand Identity Package"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Scope & Deliverable Requirements *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exactly what you need, specific dimensions, colors, deadlines, software formats, or special instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Budget (₦)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Timeline (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={expectedDays}
                  onChange={(e) => setExpectedDays(e.target.value)}
                  placeholder="e.g. 3"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus / Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Campus Ago-Iwoye"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reference Links & Attachments
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Paste reference image, Google Drive, or sample link URL"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                    <span className="max-w-[200px] truncate">{att}</span>
                    <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-blue-500 hover:text-blue-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Zero-Risk OOU StudentCircle Escrow Protection</p>
              <p className="text-amber-800 text-xs">
                Submitting a request does not charge your account. The provider will review your requirements and send a customized quote. Once accepted, your payment will be held safely in campus escrow until you inspect and approve the completed deliverable.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-sm font-bold shadow-md shadow-blue-950/10 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#F5B400]" />
              {isSubmitting ? 'Submitting...' : 'Send Request to Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

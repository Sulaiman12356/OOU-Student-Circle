import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Paperclip, Send, AlertCircle, Sparkles } from 'lucide-react';
import { UnifiedOrder, PartyInfo, DisputeReason, OrderDispute } from '../../types/transaction';
import { PAYMENT_CONFIG, formatCurrency } from '../../config/paymentConfig';
import { TransactionEngineStore } from '../../services/transactionEngineStore';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: UnifiedOrder;
  currentUser: PartyInfo;
  onDisputeOpened: (dispute: OrderDispute) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  order,
  currentUser,
  onDisputeOpened
}) => {
  const [reason, setReason] = useState<DisputeReason>('scope_mismatch');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceAttachments, setEvidenceAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddEvidence = () => {
    if (evidenceUrl.trim()) {
      setEvidenceAttachments(prev => [...prev, evidenceUrl.trim()]);
      setEvidenceUrl('');
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a detailed explanation (at least 20 characters) describing the issue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = TransactionEngineStore.openDispute({
        orderId: order.id,
        openedBy: currentUser,
        reason,
        description: description.trim(),
        evidenceAttachments
      });

      if (result.success && result.dispute) {
        onDisputeOpened(result.dispute);
        onClose();
      } else {
        setError(result.message || 'Failed to file dispute.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error creating dispute record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">StudentCircle Arbitration</span>
              <h2 className="text-lg font-bold">Open Transaction Dispute</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Disputing Order #{order.orderId}</span>
            <span className="font-bold text-slate-800 line-clamp-1">{order.targetItemTitle}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Escrow Amount</span>
            <span className="font-extrabold text-[#061A4F]">{formatCurrency(order.amount)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reason Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Reason for Dispute *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DisputeReason)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 text-xs font-semibold bg-white"
            >
              {PAYMENT_CONFIG.disputePolicy.allowedReasons.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Statement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Grievance & Facts *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State what went wrong, what was promised in the quote vs delivered, timelines breached, or damages..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 text-xs"
              required
            />
          </div>

          {/* Evidence Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Evidence Links & Screenshots
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="Paste screenshot URL or file link"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddEvidence}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Paperclip className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            {evidenceAttachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {evidenceAttachments.map((url, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-100">
                    <span className="max-w-[180px] truncate">{url}</span>
                    <button type="button" onClick={() => handleRemoveEvidence(i)} className="text-rose-500 hover:text-rose-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arbitration Info */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Escrow Lock:</strong> Filing this dispute immediately freezes all escrow funds for this transaction. A StudentCircle administrative arbitrator will review the terms, chat logs, and deliverables to issue a fair binding resolution.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/10 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Filing Dispute...' : 'Submit Dispute to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

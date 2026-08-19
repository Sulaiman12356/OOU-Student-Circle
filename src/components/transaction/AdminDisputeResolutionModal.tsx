import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  AlertCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { OrderDispute, DisputeResolutionAction, PartyInfo } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency } from '../../config/paymentConfig';

interface AdminDisputeResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: OrderDispute;
  adminUser: PartyInfo;
  onDisputeResolved: () => void;
}

export const AdminDisputeResolutionModal: React.FC<AdminDisputeResolutionModalProps> = ({
  isOpen,
  onClose,
  dispute,
  adminUser,
  onDisputeResolved
}) => {
  const [action, setAction] = useState<DisputeResolutionAction>('refund_buyer');
  const [adminNotes, setAdminNotes] = useState('');
  const [customRefund, setCustomRefund] = useState<string>(Math.round(dispute.orderAmount / 2).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMarkUnderReview = () => {
    TransactionEngineStore.updateDisputeStatus(dispute.id, 'Under Review', 'Admin arbitrator reviewing evidence and chat transcripts.');
    onDisputeResolved();
  };

  const handleExecuteResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNotes.trim()) {
      setError('Please provide administrative arbitration notes explaining the ruling.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const refundNum = action === 'split_settlement' ? parseInt(customRefund, 10) : undefined;

      const result = TransactionEngineStore.resolveDispute({
        disputeId: dispute.id,
        action,
        adminNotes: adminNotes.trim(),
        refundAmount: refundNum,
        resolvedByAdmin: {
          id: adminUser.id,
          name: adminUser.name
        }
      });

      if (result.success) {
        onDisputeResolved();
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to resolve dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-[#F5B400]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400] block">Arbitration Tribunal</span>
              <h2 className="text-lg font-bold">Resolve Transaction Dispute #{dispute.disputeId}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispute Overview */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 font-medium">Order Title</span>
              <p className="font-bold text-slate-800 text-sm">{dispute.orderTitle}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Held in Escrow</span>
              <p className="text-base font-extrabold text-[#061A4F]">{formatCurrency(dispute.orderAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Complainant (Opened By)</span>
              <p className="font-bold text-slate-800">{dispute.openedBy.name} ({dispute.openedBy.role})</p>
              <p className="text-slate-500">{dispute.openedBy.email || dispute.openedBy.phoneNumber}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Respondent (Against)</span>
              <p className="font-bold text-slate-800">{dispute.against.name} ({dispute.against.role})</p>
              <p className="text-slate-500">{dispute.against.email || dispute.against.phoneNumber}</p>
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
            <p className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Reason: {dispute.reasonLabel}
            </p>
            <p className="text-rose-800 leading-relaxed">{dispute.description}</p>
          </div>

          {dispute.evidenceAttachments && dispute.evidenceAttachments.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1.5">Evidence Attachments</span>
              <div className="flex flex-wrap gap-2">
                {dispute.evidenceAttachments.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Evidence #{i + 1}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {dispute.status === 'Open' && (
            <button
              type="button"
              onClick={handleMarkUnderReview}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
            >
              Move Status to "Under Review"
            </button>
          )}
        </div>

        {/* Resolution Form */}
        <form onSubmit={handleExecuteResolution} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Binding Resolution Ruling *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAction('refund_buyer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  action === 'refund_buyer'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  {action === 'refund_buyer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">Full Refund to Buyer</p>
                <p className="text-[10px] text-slate-500">Return 100% of escrow payment to customer</p>
              </button>

              <button
                type="button"
                onClick={() => setAction('release_to_seller')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  action === 'release_to_seller'
                    ? 'border-[#061A4F] bg-blue-50/70 ring-2 ring-[#061A4F]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#061A4F]" />
                  {action === 'release_to_seller' && <CheckCircle2 className="w-4 h-4 text-[#061A4F]" />}
                </div>
                <p className="text-xs font-bold text-slate-900">Release Funds to Seller</p>
                <p className="text-[10px] text-slate-500">Ruling in favor of provider, release net payout</p>
              </button>

              <button
                type="button"
                onClick={() => setAction('split_settlement')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  action === 'split_settlement'
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  {action === 'split_settlement' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">Split Settlement</p>
                <p className="text-[10px] text-slate-500">Partial refund to buyer & partial seller release</p>
              </button>

              <button
                type="button"
                onClick={() => setAction('dismissed')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  action === 'dismissed'
                    ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <X className="w-4 h-4 text-slate-600" />
                  {action === 'dismissed' && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
                </div>
                <p className="text-xs font-bold text-slate-900">Dismiss Dispute</p>
                <p className="text-[10px] text-slate-500">Invalid grievance, maintain standard delivery</p>
              </button>
            </div>
          </div>

          {action === 'split_settlement' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Refund Amount to Buyer (₦)
              </label>
              <input
                type="number"
                value={customRefund}
                onChange={(e) => setCustomRefund(e.target.value)}
                max={dispute.orderAmount}
                min={0}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs font-semibold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Arbitrator Findings & Ruling Justification *
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="State the rationale for this decision based on evidence, campus policy, and deliverable compliance..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-xs"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Scale className="w-4 h-4 text-[#F5B400]" />
              {isSubmitting ? 'Executing Settlement...' : 'Enforce Binding Ruling & Settle Escrow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

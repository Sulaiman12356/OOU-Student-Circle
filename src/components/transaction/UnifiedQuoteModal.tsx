import React, { useState } from 'react';
import { X, Send, Plus, Trash2, Clock, Calendar, CheckCircle2, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';
import { TransactionRequest, TransactionQuote } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency, calculateTransactionFee } from '../../config/paymentConfig';

interface UnifiedQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TransactionRequest;
  onQuoteSent: (quote: TransactionQuote) => void;
}

export const UnifiedQuoteModal: React.FC<UnifiedQuoteModalProps> = ({
  isOpen,
  onClose,
  request,
  onQuoteSent
}) => {
  const [amount, setAmount] = useState<string>(request.budget ? request.budget.toString() : '5000');
  const [deliveryTime, setDeliveryTime] = useState('3 Days');
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [message, setMessage] = useState('');
  const [scopeItem, setScopeItem] = useState('');
  const [scopeBreakdown, setScopeBreakdown] = useState<string[]>([
    'Initial draft & concept review',
    'Full implementation / production based on requirements',
    'Revisions & final high-resolution deliverable packaging'
  ]);
  const [validDays, setValidDays] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseInt(amount, 10) || 0;
  const feeInfo = calculateTransactionFee(numAmount, request.type);

  const handleAddScope = () => {
    if (scopeItem.trim()) {
      setScopeBreakdown(prev => [...prev, scopeItem.trim()]);
      setScopeItem('');
    }
  };

  const handleRemoveScope = (index: number) => {
    setScopeBreakdown(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      setError('Please enter a valid quote amount.');
      return;
    }
    if (!message.trim()) {
      setError('Please provide a message explaining your proposal and approach.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString();

      const newQuote = TransactionEngineStore.sendQuote({
        requestId: request.id,
        amount: numAmount,
        deliveryTime: deliveryTime.trim() || `${deliveryDays} Days`,
        deliveryDays,
        message: message.trim(),
        scopeBreakdown,
        validUntil
      });

      if (newQuote) {
        onQuoteSent(newQuote);
        onClose();
      } else {
        setError('Failed to send quote. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit quote.');
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
                Step 2: Send Quote
              </span>
              <span className="text-xs text-blue-200 font-medium">Request #{request.requestId}</span>
            </div>
            <h2 className="text-xl font-bold">Prepare & Dispatch Formal Quote</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Brief */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Customer Request:</p>
          <p className="text-sm font-bold text-slate-800 line-clamp-1">{request.title}</p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{request.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span>Customer: <strong className="text-slate-700">{request.buyer.name}</strong></span>
            {request.budget && <span>Budget: <strong className="text-emerald-700">{formatCurrency(request.budget)}</strong></span>}
            {request.expectedDeliveryDays && <span>Desired: <strong>{request.expectedDeliveryDays} Days</strong></span>}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Quote Price (₦) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 12000"
                  min="300"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm font-semibold"
                  required
                />
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₦</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Turnaround / Delivery Time *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="e.g. 2 Days, Within 24 Hours"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
                  required
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Fee Breakdown Display */}
          <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 block">Gross Quote: <strong>{formatCurrency(feeInfo.grossAmount)}</strong></span>
              <span className="text-slate-500 block">Platform Commission ({feeInfo.commissionPercent}%): <strong>{formatCurrency(feeInfo.platformFee)}</strong></span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Net Payout to You (Escrow):</span>
              <span className="text-base font-extrabold text-[#061A4F]">{formatCurrency(feeInfo.netSellerAmount)}</span>
            </div>
          </div>

          {/* Message / Cover Pitch */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Message to Customer *
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detail your work methodology, tools you'll use, why you are qualified, and how you will meet their timeline..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-sm"
              required
            />
          </div>

          {/* Deliverables / Scope Breakdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deliverables & Scope Milestones
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={scopeItem}
                onChange={(e) => setScopeItem(e.target.value)}
                placeholder="Add milestone (e.g. 3 Custom Logo Concepts, Vector AI file)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddScope}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {scopeBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {item}
                  </span>
                  <button type="button" onClick={() => handleRemoveScope(i)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Expiry */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Quote Validity:
            </span>
            <select
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
            >
              <option value={3}>3 Days</option>
              <option value={7}>7 Days (Recommended)</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              {isSubmitting ? 'Sending Quote...' : 'Dispatch Quote to Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

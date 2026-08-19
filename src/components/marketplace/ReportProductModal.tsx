import React, { useState } from 'react';
import { ProductItem, ProductReport, ReportReason } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, X, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

interface ReportProductModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportProductModal: React.FC<ReportProductModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState<ReportReason>('misleading');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState(currentUser?.fullName || '');
  const [reporterEmail, setReporterEmail] = useState(currentUser?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please describe the reason for your report.');
      return;
    }
    if (!reporterEmail.trim()) {
      setErrorMessage('Please provide an email for correspondence.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const report: ProductReport = {
        id: `rep-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        vendorId: product.vendorId,
        vendorStoreName: product.vendorStoreName,
        reporterId: currentUser?.id || 'guest-reporter',
        reporterName: reporterName || 'Anonymous Student',
        reporterEmail: reporterEmail,
        reason,
        description: description.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      MarketplaceStore.submitProductReport(report);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMessage('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-200" />
            <h3 className="font-black text-lg">Report Listing</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-rose-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
            <p className="text-sm text-slate-600">
              Our safety and campus moderation team will review this listing within 24 hours against OOU community standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 mb-1">Product flagged:</p>
              <p className="text-sm font-bold text-slate-900 truncate">{product.title}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Violation Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="prohibited">Prohibited Item (Drugs, alcohol, weapons, exam leaks)</option>
                <option value="fraud">Suspected Fraud or Scam</option>
                <option value="counterfeit">Counterfeit / Fake Goods</option>
                <option value="misleading">Misleading Description or Photos</option>
                <option value="pricing">Extortionate or Price Gouging</option>
                <option value="inappropriate">Inappropriate / Offensive Media</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Details & Evidence *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is wrong with this listing or your experience with the seller..."
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Your Email (for updates) *
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

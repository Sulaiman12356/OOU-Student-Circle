import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  UploadCloud, 
  HelpCircle, 
  User, 
  Package, 
  Briefcase, 
  Sparkles, 
  Store, 
  Star, 
  MessageSquare 
} from 'lucide-react';
import { ReportTargetType, ReportReasonCode, REPORT_REASONS } from '../../types/trustSafety';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { useAuth } from '../../context/AuthContext';

interface UniversalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  targetOwnerId?: string;
  targetOwnerName?: string;
  onSuccess?: () => void;
}

export const UniversalReportModal: React.FC<UniversalReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  targetOwnerId,
  targetOwnerName,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [selectedReason, setSelectedReason] = useState<ReportReasonCode>('fraud');
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('You must be signed in to file an official report.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setErrorMessage('Please provide a detailed explanation (at least 15 characters) of the issue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      TrustSafetyStore.submitReport({
        reporterId: currentUser.id,
        reporterName: currentUser.fullName,
        reporterEmail: currentUser.email,
        reporterPhoto: currentUser.profilePhoto,
        targetType,
        targetId,
        targetTitle,
        targetOwnerId,
        targetOwnerName,
        reason: selectedReason,
        description: description.trim(),
        evidenceAttachments: evidenceName ? [
          { name: evidenceName, url: '#doc-evidence-upload', type: 'image' }
        ] : []
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    }
  };

  const getTargetIcon = () => {
    switch (targetType) {
      case 'profile': return <User className="w-4 h-4 text-blue-600" />;
      case 'product': return <Package className="w-4 h-4 text-amber-600" />;
      case 'service': return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'job': return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'shop': return <Store className="w-4 h-4 text-purple-600" />;
      case 'review': return <Star className="w-4 h-4 text-amber-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-rose-600" />;
      default: return <ShieldAlert className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-rose-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Report Content or Behavior</h2>
              <p className="text-xs text-rose-100">OOU StudentCircle Trust & Safety Moderation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#061A4F]">Report Submitted</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Our campus moderation desk has received your report regarding <strong className="text-slate-900">"{targetTitle}"</strong>. We investigate all fraud, harassment, and policy violations within 24 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Target Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                {getTargetIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Reporting {targetType}
                </div>
                <h4 className="text-xs font-black text-slate-900 truncate">
                  {targetTitle}
                </h4>
                {targetOwnerName && (
                  <p className="text-[11px] text-slate-500">By {targetOwnerName}</p>
                )}
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Report <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(Object.keys(REPORT_REASONS) as ReportReasonCode[]).map((code) => {
                  const option = REPORT_REASONS[code];
                  const isSelected = selectedReason === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedReason(code)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">{option.label}</div>
                        <div className="text-[11px] text-slate-500 leading-snug">{option.description}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Details & Explanation <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened or why this content violates safety rules (e.g. user asked for direct OPay transfer, abusive message, fake product)..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <span className="text-[10px] text-slate-400">Min. 15 characters</span>
            </div>

            {/* Evidence Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supporting Screenshot or Evidence (Optional)
              </label>
              {evidenceName ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 truncate max-w-[200px]">{evidenceName}</span>
                  <button
                    type="button"
                    onClick={() => setEvidenceName(null)}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEvidenceName(`evidence-screenshot-${Date.now()}.png`)}
                  className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                  <span>Attach Screenshot / Chat Log</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isSubmitting ? 'Filing Report...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  UserX, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { useAuth } from '../../context/AuthContext';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  targetUserRole?: string;
  onSuccess?: () => void;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  targetUserRole,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState('Unwanted communication / safety precaution');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleBlock = () => {
    if (!currentUser) {
      setErrorMessage('You must be logged in to block a user.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = TrustSafetyStore.blockUser(currentUser.id, targetUserId, reason);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to block user.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <UserX className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Block Campus User</h2>
              <p className="text-xs text-slate-300">Safety & Boundary Controls</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <UserX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">User Blocked</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              <strong className="text-slate-900">{targetUserName}</strong> has been blocked. They can no longer send you direct messages, submit quotes, or view your private contact details.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>What happens when you block {targetUserName}?</span>
              </h4>
              <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside">
                <li>They will be unable to start or reply to direct chat messages.</li>
                <li>They cannot submit service order requests or custom proposals.</li>
                <li>You can unblock them at any time in your Settings &rarr; Safety tab.</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for blocking (Private, only visible to you & safety team)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
              >
                <option value="Unwanted communication / spam">Unwanted communication / spam</option>
                <option value="Off-platform payment pressure (OPay/Kuda/Bank)">Off-platform payment pressure</option>
                <option value="Harassment or inappropriate language">Harassment or inappropriate language</option>
                <option value="Suspicious / potential fraud">Suspicious / potential fraud</option>
                <option value="Personal safety preference">Personal safety preference</option>
              </select>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBlock}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <UserX className="w-4 h-4" />
                <span>{isSubmitting ? 'Blocking User...' : `Block ${targetUserName}`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

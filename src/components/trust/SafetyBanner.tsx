import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  CreditCard, 
  KeyRound, 
  MapPin, 
  ChevronRight, 
  ExternalLink,
  X
} from 'lucide-react';

interface SafetyBannerProps {
  category?: 'payments' | 'chat_warning' | 'general';
  customMessage?: string;
  onDismiss?: () => void;
  className?: string;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({
  category = 'payments',
  customMessage,
  onDismiss,
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (category === 'chat_warning') {
    return (
      <div className={`bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-start justify-between gap-3 text-rose-900 ${className}`}>
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <div className="font-black text-rose-900 flex items-center gap-1.5">
              <span>⚠️ SAFETY ALERT: Off-Platform Payment Attempt Detected</span>
            </div>
            <p className="text-rose-800 text-[11px] leading-relaxed">
              {customMessage || 'Never transfer money directly to bank accounts (OPay, Kuda, PalmPay) or disclose passwords. Always pay inside StudentCircle Escrow to keep your money 100% protected.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-rose-400 hover:text-rose-700 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/70 p-4 rounded-3xl flex items-center justify-between gap-4 text-xs ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="font-black text-[#061A4F] flex items-center gap-2">
            <span>OOU StudentCircle Escrow Protection</span>
            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">
              100% Protected
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            Funds remain secured in university-backed escrow until services or goods are delivered and confirmed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href="/safety"
          className="px-3.5 py-1.5 bg-white text-[#061A4F] font-black text-[11px] rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1"
        >
          <span>Safety Guide</span>
          <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

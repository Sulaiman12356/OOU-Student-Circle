import React, { useState } from 'react';
import { StudentPrivacySettings } from '../../types/studentConnect';
import { 
  X, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  UserPlus, 
  Briefcase, 
  CheckCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';

interface StudentPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: StudentPrivacySettings;
  onSave: (settings: Partial<StudentPrivacySettings>) => Promise<void>;
}

export const StudentPrivacyModal: React.FC<StudentPrivacyModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave
}) => {
  const [settings, setSettings] = useState<StudentPrivacySettings>(currentSettings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(settings);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#061A4F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#F5B400]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">Profile Privacy Controls</h2>
              <p className="text-xs text-slate-300">Control who can discover and contact you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Automatic PII Security Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 font-medium">
            <Lock className="w-4 h-4 text-[#061A4F] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Permanent Identity Protection: </span>
              Your Matriculation Number, JAMB Number, and private ID records are strictly confidential and are never shared publicly in Student Connect.
            </div>
          </div>

          {/* 1. Directory Visibility */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Directory & Search Visibility
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, profileVisibility: 'public' })}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  settings.profileVisibility === 'public'
                    ? 'border-[#061A4F] bg-blue-50/50 text-[#061A4F] font-bold ring-2 ring-[#061A4F]/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <Eye className="w-4 h-4 mb-1 text-[#061A4F]" />
                <span className="text-xs">Public</span>
                <span className="text-[10px] text-slate-400 font-normal">All visitors</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, profileVisibility: 'students_only' })}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  settings.profileVisibility === 'students_only'
                    ? 'border-[#061A4F] bg-blue-50/50 text-[#061A4F] font-bold ring-2 ring-[#061A4F]/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <Shield className="w-4 h-4 mb-1 text-emerald-600" />
                <span className="text-xs">OOU Only</span>
                <span className="text-[10px] text-slate-400 font-normal">Logged-in</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, profileVisibility: 'hidden' })}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  settings.profileVisibility === 'hidden'
                    ? 'border-[#061A4F] bg-blue-50/50 text-[#061A4F] font-bold ring-2 ring-[#061A4F]/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <EyeOff className="w-4 h-4 mb-1 text-rose-500" />
                <span className="text-xs">Hidden</span>
                <span className="text-[10px] text-slate-400 font-normal">Private</span>
              </button>
            </div>
          </div>

          {/* 2. Direct Messages Permission */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Who Can Send You Direct Messages?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="allowDirectMessages"
                  checked={settings.allowDirectMessages === 'everyone'}
                  onChange={() => setSettings({ ...settings, allowDirectMessages: 'everyone' })}
                  className="w-4 h-4 text-[#061A4F] focus:ring-[#061A4F]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Any Verified Student or Client</div>
                  <div className="text-[11px] text-slate-500">Anyone on OOU StudentCircle can start a conversation</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="allowDirectMessages"
                  checked={settings.allowDirectMessages === 'connections_only'}
                  onChange={() => setSettings({ ...settings, allowDirectMessages: 'connections_only' })}
                  className="w-4 h-4 text-[#061A4F] focus:ring-[#061A4F]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Connections Only</div>
                  <div className="text-[11px] text-slate-500">Only students you have accepted connection requests from</div>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Toggle Options */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Allow Connection Requests */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-[#061A4F]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Allow Connection Requests</div>
                  <div className="text-[11px] text-slate-500">Students can send you requests to connect</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowConnectionRequests}
                onChange={(e) => setSettings({ ...settings, allowConnectionRequests: e.target.checked })}
                className="w-4 h-4 text-[#061A4F] rounded-md focus:ring-[#061A4F]"
              />
            </div>

            {/* Show Services on Profile */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Display Services on Profile</div>
                  <div className="text-[11px] text-slate-500">Show freelance gigs you offer on your profile</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showServices}
                onChange={(e) => setSettings({ ...settings, showServices: e.target.checked })}
                className="w-4 h-4 text-[#061A4F] rounded-md focus:ring-[#061A4F]"
              />
            </div>

            {/* Optional Public Email */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Show Email Publicly</div>
                  <div className="text-[11px] text-slate-500">Allow other students to view your email address</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                className="w-4 h-4 text-[#061A4F] rounded-md focus:ring-[#061A4F]"
              />
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Privacy settings updated successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-2xs flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { PlatformSettings } from '../../types';
import { founderConfig } from '../../config/founder';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Percent, 
  Sliders, 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Building2, 
  ToggleLeft, 
  ToggleRight, 
  Layers, 
  Sparkles,
  RefreshCw,
  Globe
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const raw = DataStore.getPlatformSettings();
    return {
      ...raw,
      platformName: raw.platformName || 'OOU StudentCircle',
      platformFeePercent: raw.platformFeePercent || 10,
      platformFeePercentage: raw.platformFeePercentage || raw.platformFeePercent || 10,
      minEscrowAmount: raw.minEscrowAmount || 500,
      supportEmail: raw.supportEmail || 'hello@ooustudentcircle.com',
      supportPhone: raw.supportPhone || '+234 812 345 6789',
      primaryCampus: raw.primaryCampus || 'Ago-Iwoye Main Campus (Permanent Site)',
      maintenanceMode: Boolean(raw.maintenanceMode),
      requireStudentVerification: raw.requireStudentVerification ?? true,
      autoApproveServices: raw.autoApproveServices ?? false,
      allowNotifications: raw.allowNotifications ?? true,
      allowEmailNotifications: raw.allowEmailNotifications ?? true,
      allowInstantPayouts: raw.allowInstantPayouts ?? false,
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.savePlatformSettings(settings);
    DataStore.logAdminAction(
      'UPDATE_PLATFORM_SETTINGS',
      'platform_settings',
      'global',
      `Updated platform name to "${settings.platformName}", Commission: ${settings.platformFeePercent}%, Maintenance: ${settings.maintenanceMode ? 'ON' : 'OFF'}`
    );
    showToast('Platform settings saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Platform Governance & Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure platform branding, contact details, commission economics, moderation policies, and system notifications.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md flex-shrink-0"
        >
          <Save className="w-4 h-4 text-[#F5B400]" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. General & Brand Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Globe className="w-4 h-4 text-[#F5B400]" />
            <span>Platform Identity & General Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Platform Brand Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Displayed on navigation bars, invoices, and system receipts</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Primary Campus Headquarters</label>
              <input
                type="text"
                value={settings.primaryCampus}
                onChange={(e) => setSettings({ ...settings, primaryCampus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Main physical administrative hub of OOU StudentCircle</span>
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Contact & Support Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Official Support Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>
              <span className="text-[11px] text-slate-400">Used for customer care inquiries, dispute mediation, and receipts</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Support Phone / WhatsApp Desk</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>
              <span className="text-[11px] text-slate-400">Direct campus emergency hotline & WhatsApp concierge</span>
            </div>
          </div>
        </div>

        {/* 3. Commission & Escrow Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>Commission & Escrow Economics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Platform Commission Fee (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={settings.platformFeePercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSettings({ ...settings, platformFeePercent: val, platformFeePercentage: val });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Standard percentage deducted on completed service contracts and marketplace orders</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Minimum Escrow Milestone (₦)</label>
              <input
                type="number"
                min="500"
                step="500"
                value={settings.minEscrowAmount || 500}
                onChange={(e) => setSettings({ ...settings, minEscrowAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Minimum client project budget allowed on platform</span>
            </div>
          </div>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
            <div>
              <div className="font-bold text-slate-800">Instant Automated Payouts</div>
              <div className="text-[11px] text-slate-500">Automatically disburse funds to Nigerian bank accounts upon order milestone completion</div>
            </div>
            <input
              type="checkbox"
              checked={settings.allowInstantPayouts}
              onChange={(e) => setSettings({ ...settings, allowInstantPayouts: e.target.checked })}
              className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
            />
          </label>
        </div>

        {/* 4. Verification & Moderation Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Moderation & Verification Policies</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">Mandatory Student ID Verification</div>
                <div className="text-[11px] text-slate-500">Require student identity / matriculation card review before bidding on jobs or publishing services</div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireStudentVerification}
                onChange={(e) => setSettings({ ...settings, requireStudentVerification: e.target.checked })}
                className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">Automated Service Pre-Moderation</div>
                <div className="text-[11px] text-slate-500">Automatically flag new freelance gig listings for administrative approval before public display</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoApproveServices === false}
                onChange={(e) => setSettings({ ...settings, autoApproveServices: !e.target.checked })}
                className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
              />
            </label>
          </div>
        </div>

        {/* 5. Notification Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notification & Broadcast Channels</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">In-App Live Activity Notifications</div>
                <div className="text-[11px] text-slate-500">Send real-time alerts for proposal submissions, escrow deposits, dispute status, and messages</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowNotifications}
                onChange={(e) => setSettings({ ...settings, allowNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">Email Broadcast System</div>
                <div className="text-[11px] text-slate-500">Deliver email copies of critical order milestones, payment receipts, and university announcements</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowEmailNotifications}
                onChange={(e) => setSettings({ ...settings, allowEmailNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
              />
            </label>
          </div>
        </div>

        {/* 6. Maintenance Mode */}
        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-rose-900 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Platform Maintenance Mode</span>
              </div>
              <p className="text-xs text-rose-700">
                When active, non-admin users will see a maintenance notice during university portal updates or system upgrades.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#F5B400]" />
            <span>Save All Platform Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};

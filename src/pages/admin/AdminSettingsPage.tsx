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
  HelpCircle,
  Lock
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>(DataStore.getPlatformSettings());
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
      `Platform fee: ${settings.platformFeePercentage}%, Maintenance: ${settings.maintenanceMode ? 'ON' : 'OFF'}`
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
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Platform Governance & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure financial commission fees, verification requirements, maintenance mode, and campus administration parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Financial Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Percent className="w-4 h-4 text-[#F5B400]" />
            <span>Marketplace & Escrow Economics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Platform Commission Fee (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={settings.platformFeePercentage}
                onChange={(e) => setSettings({ ...settings, platformFeePercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Current standard deduction on completed orders/gigs</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Minimum Escrow Milestone (₦)</label>
              <input
                type="number"
                min="500"
                step="500"
                value={settings.minEscrowAmount}
                onChange={(e) => setSettings({ ...settings, minEscrowAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[11px] text-slate-400">Minimum client project budget allowed on platform</span>
            </div>
          </div>
        </div>

        {/* Security & Verification Gateways */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Verification & Moderation Policy</span>
          </div>

          <div className="space-y-3 text-xs">
            
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">Mandatory Student ID Verification</div>
                <div className="text-[11px] text-slate-500">Require matriculation card upload before students can submit job proposals or list services</div>
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

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition">
              <div>
                <div className="font-bold text-slate-800">Real-time In-App Notifications</div>
                <div className="text-[11px] text-slate-500">Send instant alerts for job proposals, order tracking milestones, and direct chat messages</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowNotifications}
                onChange={(e) => setSettings({ ...settings, allowNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#061A4F] focus:ring-[#061A4F]"
              />
            </label>

          </div>
        </div>

        {/* Campus & Founder Configuration Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F]">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Founder & Campus Administration Desk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Founder / Executive Lead</span>
              <span className="font-bold text-slate-900">{founderConfig.name} ({founderConfig.alias})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Support WhatsApp Contact</span>
              <span className="font-bold text-emerald-700">{founderConfig.whatsappFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Administrative Email</span>
              <span className="font-bold text-slate-800">{founderConfig.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Headquarters Campus</span>
              <span className="font-bold text-slate-800">Ago-Iwoye Main Campus, OOU</span>
            </div>
          </div>
        </div>

        {/* Maintenance Toggle */}
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#F5B400]" />
            <span>Save Platform Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};

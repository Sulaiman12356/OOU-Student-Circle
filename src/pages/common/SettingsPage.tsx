import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { UserProfile } from '../../types';
import { MediaUploader } from '../../components/common/MediaUploader';
import { 
  Settings, 
  User, 
  Building, 
  CreditCard, 
  Lock, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'payout' | 'security' | 'notifications'>('profile');
  
  // Profile State
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [location, setLocation] = useState(currentUser.location || 'Ago-Iwoye Main Campus');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [level, setLevel] = useState(currentUser.level || '300L');
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [shortBio, setShortBio] = useState(currentUser.shortBio || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto || '');

  // Payout / Bank Account State
  const [bankName, setBankName] = useState(currentUser.bankDetails?.bankName || 'Kuda Bank');
  const [accountNumber, setAccountNumber] = useState(currentUser.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(currentUser.bankDetails?.accountName || currentUser.fullName || '');

  // Password / Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [orderAlerts, setOrderAlerts] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName,
      phoneNumber,
      location,
      department: currentUser.role === 'student' ? department : undefined,
      level: currentUser.role === 'student' ? level : undefined,
      businessName: currentUser.role === 'client' ? businessName : undefined,
      shortBio,
      profilePhoto
    };

    DataStore.saveUser(updated);
    onUpdateUser(updated);
    showToast('Profile information updated successfully.');
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber.length !== 10) {
      showToast('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      bankDetails: {
        bankName,
        accountNumber,
        accountName
      }
    };

    DataStore.saveUser(updated);
    onUpdateUser(updated);
    showToast('Bank payout account details saved.');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    showToast('Security password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, campus identity, payout bank accounts, and platform security.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'profile'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('payout')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'payout'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bank Payout Account</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'security'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'notifications'
              ? 'border-[#061A4F] text-[#061A4F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Profile Form Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="pb-6 border-b border-slate-100">
            <MediaUploader
              storagePathPrefix={`users/${currentUser.id}/profile`}
              images={profilePhoto ? [profilePhoto] : []}
              onChange={(imgs) => setProfilePhoto(imgs[0] || '')}
              maxImages={1}
              label="Profile Photo (Upload from Device)"
              helperText="Upload your official matriculation or clear portrait photo from your device."
              aspectRatio="square"
              allowPrimarySelection={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 08123456789"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">OOU Campus / Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              >
                <option value="Ago-Iwoye Main Campus">Ago-Iwoye Main Campus</option>
                <option value="Sagamu Campus (Health Sciences)">Sagamu Campus (Health Sciences)</option>
                <option value="Ayetoro Campus (Agriculture)">Ayetoro Campus (Agriculture)</option>
                <option value="Ibogun Campus (Engineering)">Ibogun Campus (Engineering)</option>
                <option value="Off-Campus (Ogun State)">Off-Campus (Ogun State)</option>
              </select>
            </div>

            {currentUser.role === 'student' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Study Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    <option value="100L">100L (Freshman)</option>
                    <option value="200L">200L (Sophomore)</option>
                    <option value="300L">300L (Penultimate)</option>
                    <option value="400L">400L (Finalist)</option>
                    <option value="500L">500L (Engineering/Health)</option>
                    <option value="Postgraduate / Alum">Postgraduate / Alum</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Business / Brand Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Media Agency"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>
            )}

          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-700">Bio & Service Overview</label>
            <textarea
              rows={4}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Tell clients about your expertise, background, past campus projects, and turnaround guarantee..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F5B400]" />
              <span>Save Profile</span>
            </button>
          </div>

        </form>
      )}

      {/* Bank Payout Account Tab */}
      {activeTab === 'payout' && (
        <form onSubmit={handleSaveBank} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#061A4F]">Nigerian Bank Account (NUBAN)</h3>
            <p className="text-xs text-slate-500">
              Your freelance project milestones and marketplace sales earnings will be directly transferred to this account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Bank / Fintech Institution</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              >
                <option value="Kuda Bank">Kuda Bank</option>
                <option value="OPay">OPay</option>
                <option value="Moniepoint">Moniepoint</option>
                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                <option value="Access Bank">Access Bank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                <option value="Stanbic IBTC">Stanbic IBTC</option>
                <option value="Palmpay">Palmpay</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">10-Digit NUBAN Account Number</label>
              <input
                type="text"
                maxLength={10}
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 0123456789"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F] font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Account Beneficiary Name</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Name as registered with your bank"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F5B400]" />
              <span>Save Payout Account</span>
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleSavePassword} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#061A4F]">Change Account Password</h3>
            <p className="text-xs text-slate-500">
              Ensure your account is protected with a secure password containing at least 6 characters.
            </p>
          </div>

          <div className="space-y-4 text-xs max-w-md">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#F5B400]" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Notifications Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#061A4F]">Notification Preferences</h3>
            <p className="text-xs text-slate-500">
              Customize how and when you receive activity alerts and order notifications.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">Email Updates & Receipts</div>
                <div className="text-[11px] text-slate-500">Receive email notifications for job proposals and payment milestones</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#061A4F]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">Marketplace Order Alerts</div>
                <div className="text-[11px] text-slate-500">Instant alerts when a campus buyer places an order for your physical products</div>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#061A4F]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">SMS Notification Dispatch</div>
                <div className="text-[11px] text-slate-500">Send urgent delivery reminders directly to your Nigerian mobile line</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#061A4F]"
              />
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => showToast('Notification preferences saved.')}
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F5B400]" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

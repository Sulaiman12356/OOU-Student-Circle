import React, { useState } from 'react';
import { VendorProfile } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../common/MediaUploader';
import { 
  Store, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Phone, 
  CreditCard,
  FileText
} from 'lucide-react';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (vendor: VendorProfile) => void;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const categories = MarketplaceStore.getCategories();

  const [storeName, setStoreName] = useState(currentUser?.businessName || '');
  const [category, setCategory] = useState(categories[0]?.name || 'Fashion & Clothing');
  const [businessDescription, setBusinessDescription] = useState(currentUser?.shortBio || '');
  const [location, setLocation] = useState(currentUser?.location || 'Ago-Iwoye Main Campus');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phoneNumber || '080');
  const [profileImage, setProfileImage] = useState(currentUser?.profilePhoto || '');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=1200&auto=format&fit=crop&q=80');
  
  // Bank details
  const [bankName, setBankName] = useState('Kuda Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(currentUser?.fullName || '');

  // Agreement
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('You must be logged in as a student to create a vendor profile.');
      return;
    }
    if (!storeName.trim()) {
      setErrorMessage('Please enter your business or store brand name.');
      return;
    }
    if (!businessDescription.trim()) {
      setErrorMessage('Please provide a brief description of what your business sells.');
      return;
    }
    if (!accountNumber.trim() || accountNumber.length < 10) {
      setErrorMessage('Please provide a valid 10-digit NUBAN account number for receiving order payouts.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must agree to the StudentCircle Marketplace Community Standards & Prohibited Items Policy.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const vendorProfile: VendorProfile = {
        id: currentUser.id,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        studentEmail: currentUser.email,
        studentMatric: currentUser.matricNumber,
        studentDepartment: currentUser.department,
        studentLevel: currentUser.level,
        storeName: storeName.trim(),
        profileImage: profileImage.trim() || currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        bannerImage: bannerImage.trim() || undefined,
        businessDescription: businessDescription.trim(),
        category,
        location: location.trim(),
        whatsappNumber: whatsappNumber.trim(),
        contactPreferences: {
          whatsapp: true,
          inAppChat: true,
          phone: true,
          email: true
        },
        verificationStatus: currentUser.isVerified ? 'approved' : 'pending',
        rating: 5.0,
        reviewsCount: 0,
        totalSales: 0,
        totalProducts: 0,
        isDemo: false,
        bankInfo: {
          bankName,
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      MarketplaceStore.saveVendor(vendorProfile);
      onSuccess?.(vendorProfile);
      onClose();
    } catch (err) {
      setErrorMessage('Failed to create vendor profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        id="vendor-registration-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Store className="w-6 h-6 text-[#F5B400]" />
            <div>
              <h3 className="font-black text-lg">Student Vendor Onboarding</h3>
              <p className="text-xs text-blue-200">Start selling your products to thousands of OOU students</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Business Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>1. Store & Brand Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Store / Brand Name *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Trendy Fits Ago-Iwoye or Campus Chinchin"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Primary Product Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Store Description & Products Overview *
              </label>
              <textarea 
                rows={3}
                required
                placeholder="What physical items do you sell? Describe quality, materials, and value for students..."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Campus Base / Location *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Ago-Iwoye Main Campus (SMS complex)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  WhatsApp Contact Number *
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="08012345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Store Branding (Logo / Profile & Banner) */}
            <div className="pt-2">
              <MediaUploader
                storagePathPrefix={`vendors/${currentUser?.id || 'new'}/logo`}
                images={profileImage ? [profileImage] : []}
                onChange={(imgs) => setProfileImage(imgs[0] || '')}
                maxImages={1}
                label="Store Logo or Brand Avatar (Upload from Device)"
                helperText="Upload a crisp square brand logo or portrait photo representing your shop."
                aspectRatio="square"
                allowPrimarySelection={false}
              />
            </div>
          </div>

          {/* Payout Bank Info */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>2. Bank Account Details (For Direct Order Payouts)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Bank Name *
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Kuda Bank">Kuda Bank</option>
                  <option value="Opay">Opay</option>
                  <option value="Palmpay">Palmpay</option>
                  <option value="Guaranty Trust Bank (GTBank)">GTBank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="United Bank for Africa (UBA)">UBA</option>
                  <option value="First Bank of Nigeria">First Bank</option>
                  <option value="Moniepoint MFB">Moniepoint</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Account Number (10 Digits) *
                </label>
                <input 
                  type="text"
                  maxLength={10}
                  required
                  placeholder="2001928374"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Account Holder Name *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Must match student name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Community Standards Agreement */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>OOU Marketplace Community Standards</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Vendors agree to: fulfill customer orders promptly within agreed timelines, only list authentic physical products (no prohibited drugs, alcohol, weapons, or counterfeit items), maintain transparent pricing, and honor student pickup/delivery agreements. StudentCircle deducts a transparent 10% platform facilitation fee on successfully delivered orders.
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input 
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">
                I agree to the StudentCircle Vendor Terms & Community Standards
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !agreedToTerms}
              className="px-6 py-3 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-[#F5B400]" />
              <span>{submitting ? 'Setting up...' : 'Activate Vendor Profile'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

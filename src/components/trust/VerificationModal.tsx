import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  GraduationCap, 
  Sparkles, 
  Store, 
  Building2, 
  Lock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Phone,
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';
import { VerificationTier, VERIFICATION_TIERS } from '../../types/trustSafety';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../common/MediaUploader';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: VerificationTier;
  onSuccess?: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  initialTier = 'student',
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [selectedTier, setSelectedTier] = useState<VerificationTier>(initialTier);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form States
  // Student Form
  const [matricNumber, setMatricNumber] = useState('');
  const [jambNumber, setJambNumber] = useState('');
  const [faculty, setFaculty] = useState(currentUser?.faculty || 'Faculty of Science');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science');
  const [level, setLevel] = useState(currentUser?.level || '400L');
  const [idCardFile, setIdCardFile] = useState<string | null>(null);

  // Service Provider Form
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState(currentUser?.phoneNumber || '+234 805 178 0169');

  // Campus Shop Form
  const [shopName, setShopName] = useState('');
  const [shopPhysicalLocation, setShopPhysicalLocation] = useState('Shop E6, Motion Ground Commercial Centre, Ago-Iwoye Main Campus');
  const [shopPermitFile, setShopPermitFile] = useState<string | null>(null);

  // Business Tier Form
  const [businessName, setBusinessName] = useState(currentUser?.businessName || '');
  const [cacNumber, setCacNumber] = useState('');
  const [repName, setRepName] = useState(currentUser?.fullName || '');
  const [businessDocFile, setBusinessDocFile] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const currentStatus = TrustSafetyStore.getUserVerificationStatus(currentUser.id, selectedTier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedTier === 'student') {
      if (!matricNumber && !jambNumber) {
        setErrorMessage('Please provide your OOU Matriculation Number or JAMB Registration Number.');
        return;
      }
      if (!faculty || !department || !level) {
        setErrorMessage('Please provide your faculty, department, and academic level.');
        return;
      }
    } else if (selectedTier === 'service_provider') {
      if (!skills.trim() && !portfolioUrl.trim()) {
        setErrorMessage('Please describe your skill capabilities or provide a portfolio link.');
        return;
      }
      if (!verifiedPhone.trim()) {
        setErrorMessage('Please provide your phone/WhatsApp contact for verification.');
        return;
      }
    } else if (selectedTier === 'campus_shop') {
      if (!shopName.trim() || !shopPhysicalLocation.trim()) {
        setErrorMessage('Please specify your physical campus shop name and kiosk location.');
        return;
      }
    } else if (selectedTier === 'business') {
      if (!businessName.trim() || !cacNumber.trim()) {
        setErrorMessage('Please provide your registered Business Name and CAC Registration (RC) Number.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      TrustSafetyStore.submitVerificationRequest({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        userPhoto: currentUser.profilePhoto,
        tier: selectedTier,
        privateMatricNumber: matricNumber || undefined,
        privateJambNumber: jambNumber || undefined,
        faculty,
        department,
        level,
        studentIdCardUrl: idCardFile || '#doc-student-id-upload',
        providerSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
        providerPortfolioUrl: portfolioUrl || undefined,
        verifiedPhone: verifiedPhone || undefined,
        shopName: shopName || undefined,
        shopPhysicalLocation: shopPhysicalLocation || undefined,
        shopPermitUrl: shopPermitFile || '#doc-campus-shop-permit',
        businessName: businessName || undefined,
        cacRegistrationNumber: cacNumber || undefined,
        officialRepName: repName || undefined,
        businessDocUrl: businessDocFile || '#doc-cac-proof'
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit verification request. Please try again.');
    }
  };

  const handleSimulateUpload = (setter: (val: string) => void) => {
    setter(`uploaded-doc-verified-${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#061A4F] text-white px-6 py-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5B400]/20 border border-[#F5B400]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F5B400]" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                OOU StudentCircle Trust & Accreditation
              </h2>
              <p className="text-xs text-blue-200 font-medium">
                Official Multi-Tier Campus Identity Verification
              </p>
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#061A4F]">Verification Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your application for <strong className="text-slate-900">{VERIFICATION_TIERS[selectedTier].badgeLabel}</strong> has been submitted to the OOU Accreditation & Safety Registry.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left text-xs text-amber-900 space-y-1 max-w-md mx-auto">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Privacy & Security Notice</span>
              </div>
              <p>
                Your Matriculation Number, JAMB Number, and National identity documents are strictly encrypted and will never be exposed on public listings or searches.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition"
              >
                Done & Return to Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Tier Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Verification Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(VERIFICATION_TIERS) as VerificationTier[]).map((tierKey) => {
                  const info = VERIFICATION_TIERS[tierKey];
                  const isSelected = selectedTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tierKey);
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition ${
                        isSelected 
                          ? 'border-[#061A4F] bg-blue-50/50 shadow-xs ring-2 ring-[#061A4F]/20' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        {tierKey === 'student' && <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-[#061A4F]' : 'text-slate-500'}`} />}
                        {tierKey === 'service_provider' && <Sparkles className={`w-4 h-4 ${isSelected ? 'text-[#061A4F]' : 'text-slate-500'}`} />}
                        {tierKey === 'campus_shop' && <Store className={`w-4 h-4 ${isSelected ? 'text-[#061A4F]' : 'text-slate-500'}`} />}
                        {tierKey === 'business' && <Building2 className={`w-4 h-4 ${isSelected ? 'text-[#061A4F]' : 'text-slate-500'}`} />}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#061A4F]" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-slate-900">{info.badgeLabel}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Tier Description */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{VERIFICATION_TIERS[selectedTier].label}</span>
                {currentStatus === 'verified' && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px]">
                    Already Verified
                  </span>
                )}
                {currentStatus === 'pending' && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-black text-[10px]">
                    Pending Review
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {VERIFICATION_TIERS[selectedTier].description}
              </p>
              <div className="space-y-1 pt-1 border-t border-slate-200">
                <span className="font-bold text-[11px] text-slate-700">Required Credentials:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                  {VERIFICATION_TIERS[selectedTier].requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form Fields: Student Tier */}
            {selectedTier === 'student' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Privacy Banner */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                  <Lock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-black">OOU Student Privacy Guarantee:</strong> Your Matriculation Number / JAMB Number will remain strictly private and will <span className="underline font-bold">never</span> be displayed publicly on your profile, listings, or search results.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      OOU Matriculation Number
                    </label>
                    <input
                      type="text"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. CSC/2021/0482"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      JAMB Reg Number (Aspirants / Freshers)
                    </label>
                    <input
                      type="text"
                      value={jambNumber}
                      onChange={(e) => setJambNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 202410294829EF"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Faculty</label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    >
                      <option value="Faculty of Science">Faculty of Science</option>
                      <option value="Faculty of Social Sciences">Faculty of Social Sciences</option>
                      <option value="Faculty of Arts">Faculty of Arts</option>
                      <option value="Faculty of Law">Faculty of Law</option>
                      <option value="Faculty of Basic Medical Sciences">Faculty of Basic Medical Sciences</option>
                      <option value="Faculty of Clinical Sciences">Faculty of Clinical Sciences</option>
                      <option value="Faculty of Engineering & Environmental Studies">Faculty of Engineering</option>
                      <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
                      <option value="Faculty of Education">Faculty of Education</option>
                      <option value="Faculty of Agricultural Sciences">Faculty of Agricultural Sciences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    >
                      <option value="100L">100L (Fresher)</option>
                      <option value="200L">200L</option>
                      <option value="300L">300L</option>
                      <option value="400L">400L</option>
                      <option value="500L">500L (Final Year)</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Aspirant">Aspirant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <MediaUploader
                    storagePathPrefix={`verification/${currentUser.id}/student`}
                    images={idCardFile ? [idCardFile] : []}
                    onChange={(imgs) => setIdCardFile(imgs[0] || null)}
                    single={true}
                    maxImages={1}
                    maxFileSizeMB={15}
                    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']}
                    isPrivate={true}
                    label="Student ID Card or Admission Letter Scan"
                    helperText="Upload JPG, PNG, or PDF document. Encrypted & strictly private."
                    buttonText="Upload Verification Document"
                    aspectRatio="video"
                  />
                </div>
              </div>
            )}

            {/* Form Fields: Service Provider Tier */}
            {selectedTier === 'service_provider' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Skills & Core Competencies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Graphic Design, UI/UX, Python, Copywriting, Video Editing"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Live Portfolio or GitHub Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/yourhandle or behance.net/you"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={verifiedPhone}
                      onChange={(e) => setVerifiedPhone(e.target.value)}
                      placeholder="+234 805 178 0169"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields: Campus Shop Tier */}
            {selectedTier === 'campus_shop' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Shop / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Alhaja Biz Venture & Print Central"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Physical Stall / Kiosk Location on Campus
                  </label>
                  <input
                    type="text"
                    value={shopPhysicalLocation}
                    onChange={(e) => setShopPhysicalLocation(e.target.value)}
                    placeholder="e.g. Shop E6, Motion Ground Commercial Centre, Ago-Iwoye Main Campus"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  />
                </div>

                <div>
                  <MediaUploader
                    storagePathPrefix={`verification/${currentUser.id}/shop`}
                    images={shopPermitFile ? [shopPermitFile] : []}
                    onChange={(imgs) => setShopPermitFile(imgs[0] || null)}
                    single={true}
                    maxImages={1}
                    maxFileSizeMB={15}
                    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']}
                    isPrivate={true}
                    label="Campus Merchant Permit or Storefront Photo"
                    helperText="Upload campus trade permit, shop allocation slip, or kiosk storefront photo."
                    buttonText="Upload Shop Document"
                    aspectRatio="video"
                  />
                </div>
              </div>
            )}

            {/* Form Fields: Business Tier */}
            {selectedTier === 'business' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Corporate Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Brand Studio Ltd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CAC Registration Number (RC / BN)
                    </label>
                    <input
                      type="text"
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. RC-1849204"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorized Representative Name & Title
                  </label>
                  <input
                    type="text"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="e.g. Johnson Peter (HR Director)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  />
                </div>

                <div>
                  <MediaUploader
                    storagePathPrefix={`verification/${currentUser.id}/business`}
                    images={businessDocFile ? [businessDocFile] : []}
                    onChange={(imgs) => setBusinessDocFile(imgs[0] || null)}
                    single={true}
                    maxImages={1}
                    maxFileSizeMB={15}
                    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']}
                    isPrivate={true}
                    label="CAC Certificate or Tax Clearance Document"
                    helperText="Upload official CAC certificate, BN status document, or TIN proof."
                    buttonText="Upload Corporate Proof"
                    aspectRatio="video"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                className="px-6 py-2.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Credentials...' : `Submit for ${VERIFICATION_TIERS[selectedTier].badgeLabel}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

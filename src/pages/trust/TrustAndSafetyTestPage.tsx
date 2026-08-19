import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UserX, 
  Star, 
  FileCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Sparkles, 
  Store, 
  Building2, 
  MessageSquare, 
  Trash2, 
  RefreshCw, 
  Zap,
  ArrowRight,
  ShieldAlert,
  Send,
  HelpCircle
} from 'lucide-react';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { VerificationBadge } from '../../components/trust/VerificationBadge';
import { VerificationModal } from '../../components/trust/VerificationModal';
import { UniversalReportModal } from '../../components/trust/UniversalReportModal';
import { BlockUserModal } from '../../components/trust/BlockUserModal';
import { VerifiedReviewModal } from '../../components/trust/VerifiedReviewModal';
import { SafetyBanner } from '../../components/trust/SafetyBanner';
import { VerificationTier, VERIFICATION_TIERS, ReportTargetType } from '../../types/trustSafety';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';

export const TrustAndSafetyTestPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'verification' | 'reviews' | 'reporting' | 'blocking' | 'moderation' | 'safety_keywords'>('verification');

  // Modals trigger state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationTierToOpen, setVerificationTierToOpen] = useState<VerificationTier>('student');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<ReportTargetType>('service');
  const [reportTargetTitle, setReportTargetTitle] = useState('Logo Design Service');
  const [reportTargetId, setReportTargetId] = useState('srv-1');

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockTargetUser, setBlockTargetUser] = useState({ id: 'student-2', name: 'Adebayo Samuel' });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderConfig, setReviewOrderConfig] = useState({
    orderId: 'sord-1',
    targetUserId: 'student-2',
    targetUserName: 'Adebayo Samuel',
    targetItemId: 'srv-1',
    targetItemTitle: 'Modern Minimalist Logo & Brand Identity Design'
  });

  // Interactive Live Chat Off-Platform Payment Tester
  const [chatInputText, setChatInputText] = useState('Hey bro, please send ₦15,000 directly to my OPay 7012345678 to start work now.');
  const [detectedKeywordResult, setDetectedKeywordResult] = useState(() => 
    TrustSafetyStore.detectOffPlatformPaymentKeywords('Hey bro, please send ₦15,000 directly to my OPay 7012345678 to start work now.')
  );

  // Status refresh helper
  const [testCounter, setTestCounter] = useState(0);
  const triggerRefresh = () => setTestCounter(c => c + 1);

  const handleChatInputChange = (text: string) => {
    setChatInputText(text);
    setDetectedKeywordResult(TrustSafetyStore.detectOffPlatformPaymentKeywords(text));
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#061A4F]/10 text-[#061A4F] rounded-full text-xs font-black mb-2 border border-[#061A4F]/20">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>MODULE 9: TRUST AND SAFETY VERIFICATION STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#061A4F] tracking-tight">
              Trust Layer & Anti-Abuse Test Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed mt-1">
              Test end-to-end multi-tier verification (Student, Service Provider, Campus Shop, Business), private matric masking, transaction-enforced reviews, universal reporting, blocking, moderation, and escrow safety banners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerRefresh}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#061A4F] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync State</span>
            </button>
          </div>
        </div>

        {/* Global Safety Escrow Banner Demonstration */}
        <SafetyBanner category="payments" />

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'verification' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Verification & Badges</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>2. Verified Reviews (Anti-Abuse)</span>
          </button>

          <button
            onClick={() => setActiveTab('reporting')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reporting' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3. Universal Reporting</span>
          </button>

          <button
            onClick={() => setActiveTab('blocking')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'blocking' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>4. User Blocking System</span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'moderation' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>5. Admin Moderation Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('safety_keywords')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'safety_keywords' ? 'bg-[#061A4F] text-[#F5B400] shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>6. Off-Platform Escrow Detector</span>
          </button>
        </div>

        {/* TAB 1: VERIFICATION & BADGES */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            
            {/* Live Badge Showcase */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Verification Levels & Badge Display Enforcement</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Mandate:</strong> "Do not display verification badges unless verification has actually occurred." Below is the live verification badge renderer:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {(Object.keys(VERIFICATION_TIERS) as VerificationTier[]).map((tier) => {
                  const info = VERIFICATION_TIERS[tier];
                  const isCurrentUserVerified = currentUser ? TrustSafetyStore.isUserTierVerified(currentUser.id, tier) : false;
                  return (
                    <div key={tier} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Tier: {tier}
                          </span>
                          {isCurrentUserVerified ? (
                            <span className="text-[10px] text-emerald-700 font-bold">Active Badge</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">Not Verified</span>
                          )}
                        </div>

                        <div>
                          {isCurrentUserVerified ? (
                            <VerificationBadge userId={currentUser?.id} tier={tier} size="md" />
                          ) : (
                            <div className="text-xs text-slate-400 italic flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl">
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Badge Hidden (Unverified)</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-snug">
                          {info.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setVerificationTierToOpen(tier);
                          setIsVerificationModalOpen(true);
                        }}
                        className="w-full py-2 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-xs transition"
                      >
                        Submit {info.badgeLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy Compliance Test Card */}
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <Lock className="w-5 h-5 text-emerald-700" />
                <span>STUDENT PRIVACY MANDATE VERIFICATION</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                "Matric number/JAMB number must remain private. Never display these publicly."
              </p>
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Public Profile Output vs Private Admin Registry:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Public Profile / Search Endpoint</span>
                    <div className="font-bold text-slate-800 mt-1">
                      {currentUser?.fullName || 'Onifade Sulaiman'} ({currentUser?.department || 'Computer Science'}, {currentUser?.level || '400L'})
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <Lock className="w-3 h-3" />
                      <span>Matric No: Strictly Hidden / Private</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-[10px] font-bold text-[#061A4F] uppercase block">Admin Accreditation Queue (Confidential)</span>
                    <div className="font-bold text-slate-800 mt-1">
                      {currentUser?.fullName || 'Onifade Sulaiman'}
                    </div>
                    <div className="text-[11px] font-mono text-[#061A4F] font-bold mt-1">
                      Accreditation Record: CSC/2021/0482 (Protected)
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VERIFIED REVIEWS & ANTI-ABUSE */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Transaction-Enforced Reviews & Anti-Abuse Rules</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Reviews are strictly gated by valid completed order IDs to eliminate fake reviews, duplicate submissions, and self-reviews.
                </p>
              </div>

              {/* 3 Interactive Test Scenarios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Test 1: Valid Completed Order */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-900">
                      <span>1. Valid Completed Order</span>
                      <span className="px-2 py-0.2 bg-emerald-200 text-emerald-800 rounded-full text-[10px]">PASS</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-snug">
                      Reviewing a real, completed order with rating criteria, written feedback, and work proof image.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOrderConfig({
                        orderId: 'sord-1',
                        targetUserId: 'student-2',
                        targetUserName: 'Adebayo Samuel',
                        targetItemId: 'srv-1',
                        targetItemTitle: 'Modern Minimalist Logo & Brand Identity Design'
                      });
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition"
                  >
                    Test Valid Review Modal
                  </button>
                </div>

                {/* Test 2: Self Review (Blocked) */}
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black text-rose-900">
                      <span>2. Self-Review Attempt</span>
                      <span className="px-2 py-0.2 bg-rose-200 text-rose-800 rounded-full text-[10px]">BLOCKED</span>
                    </div>
                    <p className="text-xs text-rose-800 leading-snug">
                      Attempting to review your own profile/service. System immediately blocks self-reviews.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOrderConfig({
                        orderId: 'fake-self-order',
                        targetUserId: currentUser?.id || 'student-1',
                        targetUserName: currentUser?.fullName || 'You',
                        targetItemId: 'srv-self',
                        targetItemTitle: 'My Own Service Listing'
                      });
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-xs transition"
                  >
                    Test Self-Review Block
                  </button>
                </div>

                {/* Test 3: Duplicate Review (Blocked) */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black text-amber-900">
                      <span>3. Duplicate Review</span>
                      <span className="px-2 py-0.2 bg-amber-200 text-amber-800 rounded-full text-[10px]">BLOCKED</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-snug">
                      Attempting to submit a second review for already-reviewed order #tx-1001.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOrderConfig({
                        orderId: 'tx-1001', // already reviewed in initialVerifiedReviews
                        targetUserId: 'student-1',
                        targetUserName: 'Onifade Sulaiman',
                        targetItemId: 'job-4',
                        targetItemTitle: 'Web Developer to build landing page for student event'
                      });
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-xs transition"
                  >
                    Test Duplicate Block
                  </button>
                </div>

              </div>

              {/* Published Verified Reviews Feed */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Published Verified Transaction Reviews ({TrustSafetyStore.getVerifiedReviews().length})
                </h3>
                <div className="space-y-3">
                  {TrustSafetyStore.getVerifiedReviews().map((vRev) => (
                    <div key={vRev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{vRev.reviewerName}</span>
                          <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Verified Transaction #{vRev.orderId}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{vRev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        "{vRev.writtenReview}"
                      </p>
                      {vRev.proofImages && vRev.proofImages.length > 0 && (
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">Delivery Proof:</span>
                          <img src={vRev.proofImages[0]} alt="Proof" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: UNIVERSAL REPORTING */}
        {activeTab === 'reporting' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Universal Reporting Coverage</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Users can report any Profile, Product, Service, Job, Shop, Review, or Chat Message for Fraud, Misleading Info, Harassment, Prohibited Content, Copyright, or Other.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { type: 'service' as ReportTargetType, title: 'Suspicious Exam Fixer Service', id: 'srv-99' },
                  { type: 'product' as ReportTargetType, title: 'Banned Item in Marketplace', id: 'prod-88' },
                  { type: 'profile' as ReportTargetType, title: 'Impersonating Student Account', id: 'usr-44' },
                  { type: 'message' as ReportTargetType, title: 'Off-Platform Payment Extortion in Chat', id: 'msg-12' },
                  { type: 'job' as ReportTargetType, title: 'Deceptive Academic Dishonesty Gig', id: 'job-77' },
                  { type: 'shop' as ReportTargetType, title: 'Fake Unregistered Kiosk', id: 'shp-33' },
                  { type: 'review' as ReportTargetType, title: 'Defamatory Fake Review', id: 'rev-22' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setReportTargetType(item.type);
                      setReportTargetTitle(item.title);
                      setReportTargetId(item.id);
                      setIsReportModalOpen(true);
                    }}
                    className="p-3.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-2xl text-left transition flex flex-col justify-between gap-2"
                  >
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                      Report {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                      <span>Trigger Modal</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USER BLOCKING SYSTEM */}
        {activeTab === 'blocking' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                    <UserX className="w-5 h-5 text-rose-600" />
                    <span>User Blocking & Communication Lockdown</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Blocked users are completely restricted from initiating chat conversations, submitting quotes, or placing orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Block Test User</span>
                </button>
              </div>

              {/* Blocked Users List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Your Blocked Users List ({currentUser ? TrustSafetyStore.getBlockedUsers(currentUser.id).length : 0})
                </h3>
                {currentUser && TrustSafetyStore.getBlockedUsers(currentUser.id).length > 0 ? (
                  <div className="space-y-2">
                    {TrustSafetyStore.getBlockedUsers(currentUser.id).map((b) => (
                      <div key={b.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 font-black flex items-center justify-center text-xs">
                            <UserX className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{b.blockedUserName}</div>
                            <div className="text-[11px] text-slate-500">Reason: {b.reason || 'Safety action'}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            TrustSafetyStore.unblockUser(currentUser.id, b.blockedUserId);
                            triggerRefresh();
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                    No users currently blocked.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN MODERATION ACTIONS */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Admin Moderation Capabilities Matrix</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full administrative powers to review evidence, issue official safety warnings, take down content, suspend user accounts, and revoke verified credentials.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <div className="font-black text-xs text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>1. Issue Official Warning</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Sends safety compliance notification and logs infraction in user record.
                  </p>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="font-black text-xs text-rose-900 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-700" />
                    <span>2. Content Take Down</span>
                  </div>
                  <p className="text-xs text-rose-800">
                    Immediately unpublishes and removes flagged Services, Products, Jobs, or Reviews.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="font-black text-xs text-rose-400 flex items-center gap-1.5">
                    <UserX className="w-4 h-4" />
                    <span>3. Account Suspension</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Locks bad actor account, blocks login, and disables all active marketplace listings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: OFF-PLATFORM PAYMENT KEYWORD DETECTOR */}
        {activeTab === 'safety_keywords' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Real-Time Off-Platform Payment & Fraud Detector</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Type messages below to test the automatic safety alert triggered when users attempt to bypass escrow (OPay, Kuda, PalmPay, direct account transfers).
                </p>
              </div>

              {/* Live Chat Simulator */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Chat Message Input Simulator
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => handleChatInputChange(e.target.value)}
                    placeholder="Type a test message like 'Send to my OPay 7012345678'..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  />
                </div>
              </div>

              {/* Live Safety Warning Result */}
              {detectedKeywordResult.isSuspicious ? (
                <div className="space-y-3 animate-in fade-in">
                  <SafetyBanner category="chat_warning" customMessage={detectedKeywordResult.warningMessage} />
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
                    <span className="font-bold text-slate-700">Triggered Flagged Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {detectedKeywordResult.detectedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-[10px]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message contains no suspicious off-platform payment triggers.</span>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        initialTier={verificationTierToOpen}
        onSuccess={() => triggerRefresh()}
      />

      {/* Universal Report Modal */}
      <UniversalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType={reportTargetType}
        targetId={reportTargetId}
        targetTitle={reportTargetTitle}
        onSuccess={() => triggerRefresh()}
      />

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        targetUserId={blockTargetUser.id}
        targetUserName={blockTargetUser.name}
        onSuccess={() => triggerRefresh()}
      />

      {/* Verified Review Modal */}
      <VerifiedReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        orderId={reviewOrderConfig.orderId}
        transactionType="service"
        targetItemId={reviewOrderConfig.targetItemId}
        targetItemTitle={reviewOrderConfig.targetItemTitle}
        targetUserId={reviewOrderConfig.targetUserId}
        targetUserName={reviewOrderConfig.targetUserName}
        onSuccess={() => triggerRefresh()}
      />

    </div>
  );
};

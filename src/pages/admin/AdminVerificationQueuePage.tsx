import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  GraduationCap, 
  Sparkles, 
  Store, 
  Building2, 
  AlertCircle,
  Eye,
  Lock,
  FileText,
  Phone,
  ExternalLink,
  RotateCcw,
  X,
  Building
} from 'lucide-react';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { TrustVerificationRequest, VerificationTier, VERIFICATION_TIERS } from '../../types/trustSafety';
import { VerificationBadge } from '../../components/trust/VerificationBadge';

export const AdminVerificationQueuePage: React.FC = () => {
  const [requests, setRequests] = useState<TrustVerificationRequest[]>(() => TrustSafetyStore.getVerificationRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<VerificationTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [inspectRequest, setInspectRequest] = useState<TrustVerificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const refreshRequests = () => {
    setRequests(TrustSafetyStore.getVerificationRequests());
  };

  const filteredRequests = requests.filter(req => {
    const matchesTier = selectedTier === 'all' || req.tier === selectedTier;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    
    const matchesSearch = 
      searchQuery === '' ||
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.department && req.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.businessName && req.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.shopName && req.shopName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTier && matchesStatus && matchesSearch;
  });

  const handleApprove = (req: TrustVerificationRequest) => {
    TrustSafetyStore.reviewVerificationRequest(
      req.id, 
      'verified', 
      adminNotes || `Accredited by Admin (${VERIFICATION_TIERS[req.tier].badgeLabel})`
    );
    setActionSuccessMsg(`Approved ${req.userName} for ${VERIFICATION_TIERS[req.tier].badgeLabel}`);
    setInspectRequest(null);
    setAdminNotes('');
    refreshRequests();
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleReject = (req: TrustVerificationRequest) => {
    TrustSafetyStore.reviewVerificationRequest(
      req.id, 
      'rejected', 
      adminNotes || 'Insufficient accreditation documentation provided'
    );
    setActionSuccessMsg(`Rejected verification for ${req.userName}`);
    setInspectRequest(null);
    setAdminNotes('');
    refreshRequests();
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleRevoke = (req: TrustVerificationRequest) => {
    TrustSafetyStore.revokeVerificationBadge(req.userId, req.tier, 'Revoked during administrative audit');
    setActionSuccessMsg(`Revoked ${VERIFICATION_TIERS[req.tier].badgeLabel} from ${req.userName}`);
    refreshRequests();
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const verifiedCount = requests.filter(r => r.status === 'verified').length;

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#061A4F] rounded-full text-xs font-black mb-1.5 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>OOU StudentCircle Trust & Accreditation Desk</span>
          </div>
          <h1 className="text-2xl font-black text-[#061A4F]">
            Verification & Accreditation Queue
          </h1>
          <p className="text-xs text-slate-500">
            Review student matriculation records, skill credentials, campus shop locations, and business CAC filings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-slate-700">{pendingCount} Pending</span>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-700">{verifiedCount} Verified</span>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tier Tabs & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Tier Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedTier('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
              selectedTier === 'all' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Verification Tiers ({requests.length})
          </button>
          
          {(Object.keys(VERIFICATION_TIERS) as VerificationTier[]).map((tierKey) => {
            const count = requests.filter(r => r.tier === tierKey).length;
            const isSelected = selectedTier === tierKey;
            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => setSelectedTier(tierKey)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#061A4F] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tierKey === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                {tierKey === 'service_provider' && <Sparkles className="w-3.5 h-3.5" />}
                {tierKey === 'campus_shop' && <Store className="w-3.5 h-3.5" />}
                {tierKey === 'business' && <Building2 className="w-3.5 h-3.5" />}
                <span>{VERIFICATION_TIERS[tierKey].badgeLabel}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, department..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === 'pending' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === 'verified' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Verified ({requests.filter(r => r.status === 'verified').length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === 'rejected' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Rejected ({requests.filter(r => r.status === 'rejected').length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              All Records
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Candidate / Business</th>
                <th className="py-3.5 px-5">Verification Level</th>
                <th className="py-3.5 px-5">Key Credentials Summary</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Submitted</th>
                <th className="py-3.5 px-5 text-right">Accreditation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold">No verification requests matching your filter.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const tier = VERIFICATION_TIERS[req.tier];
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition">
                      {/* Candidate */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {req.userPhoto ? (
                            <img
                              src={req.userPhoto}
                              alt={req.userName}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#061A4F] text-[#F5B400] font-black flex items-center justify-center shrink-0">
                              {req.userName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[#061A4F]">{req.userName}</div>
                            <div className="text-[11px] text-slate-400">{req.userEmail}</div>
                            <div className="text-[10px] text-slate-500 font-semibold uppercase">{req.userRole}</div>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                          {req.tier === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                          {req.tier === 'service_provider' && <Sparkles className="w-3.5 h-3.5" />}
                          {req.tier === 'campus_shop' && <Store className="w-3.5 h-3.5" />}
                          {req.tier === 'business' && <Building2 className="w-3.5 h-3.5" />}
                          <span>{tier.badgeLabel}</span>
                        </span>
                      </td>

                      {/* Summary */}
                      <td className="py-4 px-5">
                        {req.tier === 'student' && (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">
                              {req.department || 'OOU Department'} ({req.level || '400L'})
                            </div>
                            <div className="text-[11px] text-slate-400">{req.faculty || 'Main Campus'}</div>
                            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Private Matric Record Attached</span>
                            </div>
                          </div>
                        )}
                        {req.tier === 'service_provider' && (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">
                              Skills: {req.providerSkills?.slice(0, 3).join(', ') || 'Freelancer skills'}
                            </div>
                            <div className="text-[11px] text-slate-500">Phone: {req.verifiedPhone || 'Provided'}</div>
                          </div>
                        )}
                        {req.tier === 'campus_shop' && (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">{req.shopName}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{req.shopPhysicalLocation}</div>
                          </div>
                        )}
                        {req.tier === 'business' && (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">{req.businessName}</div>
                            <div className="text-[11px] font-mono text-purple-700">CAC: {req.cacRegistrationNumber || 'Provided'}</div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {req.status === 'verified' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {req.status === 'pending' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-500 text-[11px]">
                        {new Date(req.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInspectRequest(req);
                              setAdminNotes(req.adminNotes || '');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#061A4F] hover:text-white text-[#061A4F] font-bold rounded-xl transition flex items-center gap-1"
                            title="Inspect private accreditation data"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {req.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(req)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(req)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {req.status === 'verified' && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(req)}
                              className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition font-bold text-[11px]"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Accreditation Inspection Modal */}
      {inspectRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#061A4F] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5B400]/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#F5B400]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Private Accreditation Verification</h2>
                  <p className="text-xs text-blue-200">Confidential Admin Registry Review</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectRequest(null)}
                className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Privacy Warning Header */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                <Lock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-black">OOU Student Privacy Compliance:</strong> The details below (including raw matriculation and JAMB numbers) are confidential to the Accreditation Directorate and are strictly prohibited from public profile or search views.
                </div>
              </div>

              {/* User Summary */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {inspectRequest.userPhoto ? (
                  <img
                    src={inspectRequest.userPhoto}
                    alt={inspectRequest.userName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#061A4F] text-[#F5B400] font-black text-lg flex items-center justify-center">
                    {inspectRequest.userName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-black text-slate-900">{inspectRequest.userName}</h3>
                  <p className="text-xs text-slate-500">{inspectRequest.userEmail}</p>
                  <div className="mt-1">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-[#061A4F] rounded-full text-[10px] font-black">
                      Target Tier: {VERIFICATION_TIERS[inspectRequest.tier].badgeLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Detailed Data */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Accreditation Credentials Submitted
                </h4>

                {inspectRequest.tier === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Private Matric No.</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {inspectRequest.privateMatricNumber || 'CSC/2021/0482'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">JAMB Reg No.</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {inspectRequest.privateJambNumber || 'Not provided'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Faculty & Department</span>
                      <span className="font-bold text-slate-900">
                        {inspectRequest.department || 'Computer Science'} ({inspectRequest.level || '400L'})
                      </span>
                      <p className="text-[11px] text-slate-500">{inspectRequest.faculty || 'Faculty of Science'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">ID Document Proof</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                        <FileText className="w-4 h-4" />
                        <span>Valid OOU Student ID Card Attached</span>
                      </span>
                    </div>
                  </div>
                )}

                {inspectRequest.tier === 'service_provider' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Skills Portfolio</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {inspectRequest.providerSkills?.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-blue-100 text-[#061A4F] rounded-lg font-bold text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                      {inspectRequest.providerPortfolioUrl && (
                        <a 
                          href={inspectRequest.providerPortfolioUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-bold pt-1"
                        >
                          <span>{inspectRequest.providerPortfolioUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Validated Phone</span>
                      <span className="font-bold text-slate-900">{inspectRequest.verifiedPhone || '+234 805 178 0169'}</span>
                    </div>
                  </div>
                )}

                {inspectRequest.tier === 'campus_shop' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Physical Shop / Kiosk Name</span>
                      <span className="font-bold text-slate-900 text-sm">{inspectRequest.shopName}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Campus Location</span>
                      <span className="font-bold text-slate-800">{inspectRequest.shopPhysicalLocation}</span>
                    </div>
                  </div>
                )}

                {inspectRequest.tier === 'business' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Corporate Name</span>
                      <span className="font-bold text-slate-900">{inspectRequest.businessName}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">CAC RC / BN Number</span>
                      <span className="font-mono font-bold text-purple-700">{inspectRequest.cacRegistrationNumber}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Official Representative</span>
                      <span className="font-bold text-slate-900">{inspectRequest.officialRepName || 'Authorized Signatory'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Decision Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accreditation Directorate Notes (Audit Log & User Feedback)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter accreditation notes, verification confirmation codes, or rejection feedback..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectRequest(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReject(inspectRequest)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200"
                  >
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(inspectRequest)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Grant Badge</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

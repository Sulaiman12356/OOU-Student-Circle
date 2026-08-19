import React, { useState } from 'react';
import { Opportunity } from '../../types/opportunities';
import { useAuth } from '../../context/AuthContext';
import { OpportunityStore } from '../../services/opportunityStore';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Download, 
  Share2, 
  Bookmark, 
  Send, 
  Clock, 
  ExternalLink,
  Layers,
  Award,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (opportunity: Opportunity) => void;
  onNavigateMessage?: (creatorId: string, jobId?: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onApply,
  onNavigateMessage
}) => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    currentUser && opportunity ? OpportunityStore.isBookmarked(currentUser.id, opportunity.id) : false
  );

  if (!isOpen || !opportunity) return null;

  const isExpired = new Date(opportunity.deadline).getTime() < Date.now();
  const isFilled = opportunity.status === 'filled';
  const isOwner = currentUser?.id === opportunity.creatorId;
  const isStudent = currentUser?.role === 'student';
  
  // Check if current student already applied
  const existingApp = currentUser ? OpportunityStore.getApplications(opportunity.id, currentUser.id)[0] : null;

  const handleToggleBookmark = () => {
    if (!currentUser) return;
    const bookmarked = OpportunityStore.toggleBookmark(currentUser.id, opportunity.id);
    setIsBookmarked(bookmarked);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatBudgetDisplay = () => {
    if (opportunity.budgetString) return opportunity.budgetString;
    if (typeof opportunity.budget === 'number') {
      return `₦${opportunity.budget.toLocaleString()}`;
    }
    if (opportunity.budget?.min && opportunity.budget?.max) {
      return `₦${opportunity.budget.min.toLocaleString()} - ₦${opportunity.budget.max.toLocaleString()}`;
    }
    return 'Stipend / Prize Grant';
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'internship':
      case 'siwes':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'competition':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'scholarship':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fellowship':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getWorkModeLabel = (mode: string) => {
    if (mode === 'remote') return 'Remote (Virtual)';
    if (mode === 'on_campus') return 'On-Campus';
    return 'Hybrid (Campus & Remote)';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            {opportunity.organizationLogo ? (
              <img 
                src={opportunity.organizationLogo} 
                alt={opportunity.organizationName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover bg-white p-1 border-2 border-[#F5B400] flex-shrink-0" 
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F5B400] font-bold text-xl flex-shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
            )}
            
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getTypeBadgeColor(opportunity.opportunityType)}`}>
                  {opportunity.opportunityType.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/15">
                  {opportunity.category}
                </span>
                {opportunity.moderationStatus === 'approved' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Opportunity
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug">
                {opportunity.title}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>{opportunity.organizationName}</span>
                <span className="text-slate-400">• Posted by {opportunity.creatorName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {currentUser && (
              <button
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
                className={`p-2 rounded-xl border transition ${
                  isBookmarked ? 'bg-[#F5B400] text-[#061A4F] border-[#F5B400]' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleCopyLink}
              title="Share Opportunity"
              className="p-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
          
          {/* Key Facts Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reward / Budget</span>
              <div className="font-extrabold text-sm text-[#061A4F]">
                {formatBudgetDisplay()}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Work Mode</span>
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                {getWorkModeLabel(opportunity.workMode)}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campus / Location</span>
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1 truncate" title={opportunity.campus}>
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="truncate">{opportunity.campus}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deadline</span>
              <div className={`font-bold text-xs flex items-center gap-1 ${isExpired ? 'text-rose-600' : 'text-amber-700'}`}>
                <Clock className="w-3.5 h-3.5" />
                {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Status alerts */}
          {copied && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Link copied to clipboard! Share it with your fellow OOU students.</span>
            </div>
          )}

          {existingApp && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-blue-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>You applied for this opportunity on {new Date(existingApp.createdAt).toLocaleDateString()}. Status: <strong className="capitalize">{existingApp.status.replace('_', ' ')}</strong></span>
              </div>
              <span className="px-2 py-0.5 bg-blue-200 text-blue-900 font-bold rounded-lg text-[10px] uppercase">
                {existingApp.status}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#F5B400]" />
              Opportunity Overview & Scope
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
              {opportunity.description}
            </p>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Key Deliverables & Responsibilities
              </h3>
              <ul className="space-y-1.5">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#061A4F] mt-1.5 flex-shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Requirements & Required Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {opportunity.requirements.map((req, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Criteria & Target Faculties/Levels */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              Student Eligibility & Campus Target
            </h3>
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 space-y-3">
              {opportunity.eligibility && opportunity.eligibility.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-900">Criteria:</span>
                  <ul className="space-y-1">
                    {opportunity.eligibility.map((crit, i) => (
                      <li key={i} className="text-purple-950 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        {crit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-100/80">
                {opportunity.targetFaculties?.map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-[10px] font-bold">
                    🎓 {f}
                  </span>
                ))}
                {opportunity.targetLevels?.map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-lg bg-white border border-purple-200 text-purple-900 text-[10px] font-bold">
                    📚 {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Attachments & Documents */}
          {opportunity.attachments && opportunity.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                Guidelines & Attached Documents
              </h3>
              <div className="space-y-2">
                {opportunity.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#061A4F] group-hover:text-blue-600 transition" />
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{att.name}</div>
                        {att.size && <div className="text-[10px] text-slate-400">{att.size}</div>}
                      </div>
                    </div>
                    <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                      Download <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Host / Creator Snapshot */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#061A4F] text-[#F5B400] font-bold flex items-center justify-center text-sm">
                {opportunity.creatorName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-800 text-xs">{opportunity.creatorName}</div>
                <div className="text-[11px] text-slate-500 capitalize">{opportunity.creatorRole} • {opportunity.organizationName}</div>
              </div>
            </div>

            {onNavigateMessage && currentUser && currentUser.id !== opportunity.creatorId && (
              <button
                onClick={() => onNavigateMessage(opportunity.creatorId, opportunity.id)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-[#061A4F] text-slate-700 hover:text-[#061A4F] font-bold text-xs transition flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Message Poster</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed">
                Deadline Expired
              </span>
            ) : isFilled ? (
              <span className="px-4 py-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
                Position Filled
              </span>
            ) : isOwner ? (
              <span className="px-4 py-2.5 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                You Posted This Opportunity
              </span>
            ) : existingApp ? (
              <button
                onClick={() => onApply(opportunity)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
              >
                <span>Edit My Application</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onApply(opportunity)}
                className="px-6 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs transition flex items-center gap-2 shadow-md hover:shadow-lg group"
              >
                <span>Apply Now</span>
                <Send className="w-3.5 h-3.5 text-[#F5B400] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

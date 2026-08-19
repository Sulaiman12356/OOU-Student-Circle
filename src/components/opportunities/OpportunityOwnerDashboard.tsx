import React, { useState, useMemo } from 'react';
import { 
  Opportunity, 
  OpportunityApplication, 
  OpportunityStatus, 
  ApplicationStatus 
} from '../../types/opportunities';
import { useAuth } from '../../context/AuthContext';
import { OpportunityStore } from '../../services/opportunityStore';
import { DataStore } from '../../services/dataStore';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Star, 
  Award, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ExternalLink, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  FileText, 
  GraduationCap,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { OpportunityCreateModal } from './OpportunityCreateModal';
import { OpportunityDetailModal } from './OpportunityDetailModal';

interface OpportunityOwnerDashboardProps {
  onNavigateMessage?: (recipientId: string, jobId?: string) => void;
  onNavigate?: (path: string) => void;
}

export const OpportunityOwnerDashboard: React.FC<OpportunityOwnerDashboardProps> = ({
  onNavigateMessage,
  onNavigate
}) => {
  const { currentUser } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    return currentUser ? OpportunityStore.getOpportunitiesByCreator(currentUser.id) : [];
  });

  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<OpportunityApplication | null>(null);
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appSearchQuery, setAppSearchQuery] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOpportunity, setEditOpportunity] = useState<Opportunity | null>(null);
  const [previewOpportunity, setPreviewOpportunity] = useState<Opportunity | null>(null);

  const [feedbackNote, setFeedbackNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    if (currentUser) {
      setOpportunities(OpportunityStore.getOpportunitiesByCreator(currentUser.id));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedOpp = useMemo(() => {
    return opportunities.find(op => op.id === selectedOpportunityId) || null;
  }, [opportunities, selectedOpportunityId]);

  const rawApplications = useMemo(() => {
    if (!selectedOpportunityId) return [];
    return OpportunityStore.getApplications(selectedOpportunityId);
  }, [selectedOpportunityId, opportunities]);

  const applications = useMemo(() => {
    return rawApplications.filter(app => {
      const matchFilter = appStatusFilter === 'all' || app.status === appStatusFilter;
      const matchSearch = appSearchQuery === '' || 
        app.studentName.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
        (app.studentDepartment && app.studentDepartment.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
        app.relevantSkills.some(s => s.toLowerCase().includes(appSearchQuery.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [rawApplications, appStatusFilter, appSearchQuery]);

  const handleUpdateAppStatus = (appId: string, status: ApplicationStatus) => {
    OpportunityStore.updateApplicationStatus(appId, status, feedbackNote || undefined);
    refreshData();
    showToast(`Application updated to ${status.replace('_', ' ')}`);
    setFeedbackNote('');
    if (selectedApplication?.id === appId) {
      setSelectedApplication(OpportunityStore.getApplicationById(appId) || null);
    }
  };

  const handleHireApplicant = (app: OpportunityApplication) => {
    if (!selectedOpp) return;
    if (confirm(`Confirm selecting/hiring ${app.studentName} for "${selectedOpp.title}"?`)) {
      OpportunityStore.updateApplicationStatus(app.id, 'hired', 'Selected & Awarded position');
      OpportunityStore.updateOpportunityStatus(selectedOpp.id, 'filled', app.studentId, app.studentName, app.id);
      refreshData();
      showToast(`🎉 ${app.studentName} has been hired and position marked as Filled!`);
    }
  };

  const handleUpdateOppStatus = (oppId: string, status: OpportunityStatus) => {
    OpportunityStore.updateOpportunityStatus(oppId, status);
    refreshData();
    showToast(`Opportunity status updated to ${status.replace('_', ' ')}`);
  };

  const handleDeleteOpp = (oppId: string) => {
    if (confirm('Are you sure you want to delete this opportunity? This cannot be undone.')) {
      OpportunityStore.deleteOpportunity(oppId);
      refreshData();
      if (selectedOpportunityId === oppId) {
        setSelectedOpportunityId(null);
      }
      showToast('Opportunity posting removed.');
    }
  };

  const handleStartMessage = (studentId: string, oppId: string) => {
    if (onNavigateMessage) {
      onNavigateMessage(studentId, oppId);
    } else if (onNavigate) {
      onNavigate('/student/messages');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#061A4F]">
            My Posted Opportunities & Applicant Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your job listings, review student applications, shortlist talent, and hire top campus candidates.
          </p>
        </div>

        <button
          onClick={() => {
            setEditOpportunity(null);
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4 text-[#F5B400]" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* Main Grid: Opportunities List + Applications Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: My Opportunities List */}
        <div className={`space-y-4 ${selectedOpportunityId ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#061A4F]" />
              <span>Your Listings ({opportunities.length})</span>
            </h2>
            {selectedOpportunityId && (
              <button
                onClick={() => setSelectedOpportunityId(null)}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Show All Listings
              </button>
            )}
          </div>

          {opportunities.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Opportunities Posted Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Post freelance gigs, student jobs, SIWES placements, scholarships, or hackathons to connect with OOU students.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#061A4F] text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Create First Brief</span>
              </button>
            </div>
          ) : (
            <div className={`space-y-3 ${!selectedOpportunityId ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0' : ''}`}>
              {opportunities.map(opp => {
                const isSelected = selectedOpportunityId === opp.id;
                const appsCount = OpportunityStore.getApplications(opp.id).length;
                return (
                  <div
                    key={opp.id}
                    onClick={() => {
                      setSelectedOpportunityId(opp.id);
                      setSelectedApplication(null);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                      isSelected 
                        ? 'bg-[#061A4F] text-white border-[#061A4F] shadow-md' 
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            isSelected ? 'bg-white/20 text-[#F5B400]' : 'bg-blue-50 text-blue-800'
                          }`}>
                            {opp.opportunityType}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                            opp.status === 'open' 
                              ? isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                              : opp.status === 'filled'
                              ? isSelected ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-100 text-amber-800'
                              : isSelected ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {opp.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className={`font-bold text-xs sm:text-sm truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {opp.title}
                        </h3>
                        <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {typeof opp.budget === 'number' ? `₦${opp.budget.toLocaleString()}` : opp.budgetString || 'Budgeted'} • {opp.campus}
                        </p>
                      </div>

                      <div className={`px-2.5 py-1 rounded-xl text-center flex-shrink-0 ${
                        isSelected ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-100 text-[#061A4F]'
                      }`}>
                        <div className="font-extrabold text-xs">{appsCount}</div>
                        <div className="text-[8px] uppercase font-bold tracking-wider">Apps</div>
                      </div>
                    </div>

                    <div className={`mt-3 pt-3 border-t flex items-center justify-between text-[11px] ${
                      isSelected ? 'border-white/15 text-slate-300' : 'border-slate-100 text-slate-400'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                      </div>
                      <span className="font-bold flex items-center gap-0.5">
                        {isSelected ? 'Reviewing' : 'Review Applicants'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Applications Workspace */}
        {selectedOpportunityId && selectedOpp && (
          <div className="lg:col-span-8 space-y-4 animate-fadeIn">
            
            {/* Opportunity Management Header Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Managing Listing
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      selectedOpp.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {selectedOpp.status.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Moderation: {selectedOpp.moderationStatus}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#061A4F] mt-0.5">
                    {selectedOpp.title}
                  </h2>
                </div>

                {/* Quick actions for opportunity */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setPreviewOpportunity(selectedOpp)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Preview Public Brief"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditOpportunity(selectedOpp);
                      setShowCreateModal(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Edit Brief"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {selectedOpp.status === 'open' ? (
                    <button
                      onClick={() => handleUpdateOppStatus(selectedOpp.id, 'filled')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Filled</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateOppStatus(selectedOpp.id, 'open')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Re-Open</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOpp(selectedOpp.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
                    title="Delete Brief"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters toolbar for applicants */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
                  {['all', 'pending', 'shortlisted', 'hired', 'rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => setAppStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition ${
                        appStatusFilter === st 
                          ? 'bg-[#061A4F] text-white font-bold' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st} ({st === 'all' ? rawApplications.length : rawApplications.filter(a => a.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={appSearchQuery}
                    onChange={(e) => setAppSearchQuery(e.target.value)}
                    placeholder="Search candidate or skill..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No Applications Matching Filter</h3>
                <p className="text-xs text-slate-400">
                  {rawApplications.length === 0 
                    ? 'No student applications submitted yet. Your listing is live on the campus board.'
                    : 'Try changing your status filter or search keywords.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => {
                  const isAppSelected = selectedApplication?.id === app.id;
                  return (
                    <div 
                      key={app.id} 
                      className={`p-5 bg-white rounded-2xl border transition space-y-4 ${
                        isAppSelected ? 'border-[#061A4F] ring-1 ring-[#061A4F] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top bar: Student info & status pill */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={app.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                            alt={app.studentName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{app.studentName}</span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                                Verified
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {app.studentDepartment || 'Student'} ({app.studentLevel || 'Undergraduate'}) • Matric: {app.studentMatric || 'OOU'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                            app.status === 'shortlisted' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                            app.status === 'hired' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            app.status === 'rejected' ? 'bg-rose-100 text-rose-900' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>

                          <button
                            onClick={() => handleStartMessage(app.studentId, selectedOpp.id)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message</span>
                          </button>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Statement / Pitch:</span>
                        {app.coverMessage}
                      </div>

                      {/* Skills Tags */}
                      {app.relevantSkills && app.relevantSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Skills:</span>
                          {app.relevantSkills.map(sk => (
                            <span key={sk} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Portfolio & Attachments Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        {app.portfolioLinks && app.portfolioLinks.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Portfolio Links:</span>
                            {app.portfolioLinks.map((p, i) => (
                              <a
                                key={i}
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold truncate"
                              >
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{p.title || p.url}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {app.attachments && app.attachments.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Attached CV / Files:</span>
                            {app.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:underline flex items-center gap-1 font-semibold truncate"
                              >
                                <FileText className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{att.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Decision Action Toolbar */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                          {app.proposedBudget ? <span className="font-bold text-slate-700 ml-2">Proposed: ₦{app.proposedBudget.toLocaleString()}</span> : null}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {app.status !== 'shortlisted' && app.status !== 'hired' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'shortlisted')}
                              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span>Shortlist</span>
                            </button>
                          )}

                          {app.status !== 'hired' && (
                            <button
                              onClick={() => handleHireApplicant(app)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                            >
                              <Award className="w-3.5 h-3.5 text-[#F5B400]" />
                              <span>Hire / Select</span>
                            </button>
                          )}

                          {app.status !== 'rejected' && app.status !== 'hired' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Modals */}
      <OpportunityCreateModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditOpportunity(null);
        }}
        initialData={editOpportunity || undefined}
        onSuccess={() => {
          refreshData();
          showToast('Opportunity updated successfully');
        }}
      />

      <OpportunityDetailModal
        opportunity={previewOpportunity}
        isOpen={!!previewOpportunity}
        onClose={() => setPreviewOpportunity(null)}
        onApply={() => {}}
        onNavigateMessage={handleStartMessage}
      />

    </div>
  );
};

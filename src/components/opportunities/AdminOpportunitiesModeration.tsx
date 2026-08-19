import React, { useState, useMemo } from 'react';
import { 
  Opportunity, 
  OpportunityModerationStatus, 
  OpportunityStatus,
  OpportunityType,
  OpportunityCategory
} from '../../types/opportunities';
import { OpportunityStore } from '../../services/opportunityStore';
import { DataStore } from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  Clock, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Check, 
  X, 
  ShieldAlert,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { OpportunityDetailModal } from './OpportunityDetailModal';

export const AdminOpportunitiesModeration: React.FC = () => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => OpportunityStore.getOpportunities());
  const [searchTerm, setSearchTerm] = useState('');
  const [moderationFilter, setModerationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  
  // Moderation modal / action state
  const [actionModalOpp, setActionModalOpp] = useState<Opportunity | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setOpportunities(OpportunityStore.getOpportunities());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPI Metrics
  const metrics = useMemo(() => {
    return {
      pending: opportunities.filter(o => o.moderationStatus === 'pending').length,
      approved: opportunities.filter(o => o.moderationStatus === 'approved').length,
      suspended: opportunities.filter(o => o.moderationStatus === 'suspended').length,
      rejected: opportunities.filter(o => o.moderationStatus === 'rejected').length,
      total: opportunities.length
    };
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = 
        searchTerm === '' ||
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.campus.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModeration = moderationFilter === 'all' || opp.moderationStatus === moderationFilter;
      const matchesType = typeFilter === 'all' || opp.opportunityType === typeFilter;
      const matchesCategory = categoryFilter === 'all' || opp.category === categoryFilter;

      return matchesSearch && matchesModeration && matchesType && matchesCategory;
    });
  }, [opportunities, searchTerm, moderationFilter, typeFilter, categoryFilter]);

  const handleOpenActionModal = (opp: Opportunity, type: 'approve' | 'reject' | 'suspend') => {
    setActionModalOpp(opp);
    setActionType(type);
    setModerationReason(
      type === 'approve' 
        ? 'Verified authentic campus opportunity compliant with student community guidelines.'
        : type === 'reject'
        ? 'Brief does not satisfy minimum verification standards or contains invalid budget/contact details.'
        : 'Opportunity temporarily suspended pending review of reported discrepancy.'
    );
  };

  const handleConfirmModeration = () => {
    if (!actionModalOpp || !actionType || !currentUser) return;

    let targetModStatus: OpportunityModerationStatus = 'approved';
    let targetStatus: OpportunityStatus = 'open';

    if (actionType === 'approve') {
      targetModStatus = 'approved';
      targetStatus = 'open';
    } else if (actionType === 'reject') {
      targetModStatus = 'rejected';
      targetStatus = 'under_review';
    } else if (actionType === 'suspend') {
      targetModStatus = 'suspended';
      targetStatus = 'suspended';
    }

    OpportunityStore.updateOpportunityModeration(
      actionModalOpp.id,
      targetModStatus,
      currentUser.id,
      moderationReason
    );

    // If approved, ensure status is open
    if (actionType === 'approve') {
      OpportunityStore.updateOpportunityStatus(actionModalOpp.id, 'open');
    } else if (actionType === 'suspend') {
      OpportunityStore.updateOpportunityStatus(actionModalOpp.id, 'suspended');
    }

    DataStore.logAdminAction(
      `OPPORTUNITY_MODERATION_${actionType.toUpperCase()}`,
      'opportunity',
      actionModalOpp.id,
      `${actionType.toUpperCase()}: ${actionModalOpp.title} - ${moderationReason}`
    );

    refreshData();
    showToast(`Opportunity marked as ${targetModStatus.toUpperCase()}`);
    setActionModalOpp(null);
    setActionType(null);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    if (confirm('Are you sure you want to permanently delete this opportunity posting? This will remove all student applications attached to it.')) {
      OpportunityStore.deleteOpportunity(oppId);
      DataStore.logAdminAction('DELETE_OPPORTUNITY', 'opportunity', oppId, 'Deleted opportunity posting and applications');
      refreshData();
      showToast('Opportunity removed permanently.');
    }
  };

  const getModerationBadge = (modStatus: OpportunityModerationStatus) => {
    switch (modStatus) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Approved</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
      case 'suspended':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Suspended</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#061A4F]">
            Opportunities & Jobs Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, reject, or suspend student jobs, SIWES briefs, scholarships, and competition postings.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-2xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div 
          onClick={() => setModerationFilter('pending')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            moderationFilter === 'pending' ? 'bg-amber-500 text-white border-amber-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Pending Review</div>
          <div className="text-2xl font-extrabold mt-1">{metrics.pending}</div>
        </div>

        <div 
          onClick={() => setModerationFilter('approved')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            moderationFilter === 'approved' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Live & Approved</div>
          <div className="text-2xl font-extrabold mt-1">{metrics.approved}</div>
        </div>

        <div 
          onClick={() => setModerationFilter('suspended')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            moderationFilter === 'suspended' ? 'bg-purple-600 text-white border-purple-700 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Suspended</div>
          <div className="text-2xl font-extrabold mt-1">{metrics.suspended}</div>
        </div>

        <div 
          onClick={() => setModerationFilter('rejected')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            moderationFilter === 'rejected' ? 'bg-rose-600 text-white border-rose-700 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Rejected</div>
          <div className="text-2xl font-extrabold mt-1">{metrics.rejected}</div>
        </div>

        <div 
          onClick={() => setModerationFilter('all')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            moderationFilter === 'all' ? 'bg-[#061A4F] text-white border-[#061A4F] shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Briefs</div>
          <div className="text-2xl font-extrabold mt-1">{metrics.total}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, organization, creator, campus..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Opportunity Types</option>
              <option value="job">Student / Freelance Jobs</option>
              <option value="internship">Internships</option>
              <option value="siwes">SIWES Placement</option>
              <option value="scholarship">Scholarships</option>
              <option value="competition">Competitions & Hackathons</option>
              <option value="fellowship">Fellowships & Incubators</option>
              <option value="project">Projects & Research</option>
              <option value="program">Enterprise Programs</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={moderationFilter}
              onChange={(e) => setModerationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Moderation Statuses</option>
              <option value="pending">Pending Moderation</option>
              <option value="approved">Approved & Live</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Opportunity & Host</th>
                <th className="py-3.5 px-4">Type & Category</th>
                <th className="py-3.5 px-4">Budget / Reward</th>
                <th className="py-3.5 px-4">Campus & Mode</th>
                <th className="py-3.5 px-4">Applications</th>
                <th className="py-3.5 px-4">Moderation</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => {
                  const appsCount = OpportunityStore.getApplications(opp.id).length;
                  return (
                    <tr key={opp.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Title & Host */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1" title={opp.title}>
                          {opp.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-600">{opp.organizationName}</span>
                          <span>•</span>
                          <span>By {opp.creatorName} ({opp.creatorRole})</span>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#061A4F] capitalize">{opp.opportunityType}</div>
                        <div className="text-[10px] text-slate-400">{opp.category}</div>
                      </td>

                      {/* Budget */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                        {typeof opp.budget === 'number' ? `₦${opp.budget.toLocaleString()}` : opp.budgetString || 'Funded'}
                      </td>

                      {/* Campus & Mode */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate font-medium text-slate-800">{opp.campus}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{opp.workMode.replace('_', ' ')}</div>
                      </td>

                      {/* Applications */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-extrabold text-[11px]">
                          {appsCount} candidates
                        </span>
                      </td>

                      {/* Moderation Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getModerationBadge(opp.moderationStatus)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOpportunity(opp)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {opp.moderationStatus !== 'approved' && (
                            <button
                              onClick={() => handleOpenActionModal(opp, 'approve')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                              title="Approve & Publish Live"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {opp.moderationStatus !== 'rejected' && (
                            <button
                              onClick={() => handleOpenActionModal(opp, 'reject')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition flex items-center gap-1"
                              title="Reject Posting"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}

                          {opp.moderationStatus !== 'suspended' && (
                            <button
                              onClick={() => handleOpenActionModal(opp, 'suspend')}
                              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                              title="Suspend Posting"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOpportunity(opp.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Posting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No opportunity postings match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionModalOpp && actionType && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {actionType === 'approve' ? (
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                ) : actionType === 'reject' ? (
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                    <XCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                <h3 className="font-bold text-base text-slate-900 capitalize">
                  {actionType} Opportunity Posting
                </h3>
              </div>
              <button
                onClick={() => {
                  setActionModalOpp(null);
                  setActionType(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{actionModalOpp.title}</div>
              <div className="text-slate-500">
                Posted by {actionModalOpp.creatorName} • {actionModalOpp.organizationName}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Moderator Note / Explanation
              </label>
              <textarea
                rows={3}
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Reason for moderation decision..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setActionModalOpp(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmModeration}
                className={`px-5 py-2 rounded-xl font-bold text-xs text-white shadow-sm transition ${
                  actionType === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Confirm {actionType.toUpperCase()}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Details Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onApply={() => {}}
      />

    </div>
  );
};

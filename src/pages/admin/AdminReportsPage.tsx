import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  MessageSquare, 
  X, 
  FileText, 
  UserX, 
  Trash2, 
  AlertOctagon, 
  User, 
  Package, 
  Briefcase, 
  Sparkles, 
  Store, 
  Star 
} from 'lucide-react';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { UniversalReport, ReportTargetType, ReportReasonCode, REPORT_REASONS } from '../../types/trustSafety';
import { DataStore } from '../../services/dataStore';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<UniversalReport[]>(() => TrustSafetyStore.getReports());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ReportTargetType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'investigating' | 'actioned' | 'dismissed'>('all');
  const [selectedReport, setSelectedReport] = useState<UniversalReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const refreshReports = () => {
    setReports(TrustSafetyStore.getReports());
  };

  const filteredReports = reports.filter(rep => {
    const matchesType = typeFilter === 'all' || rep.targetType === typeFilter;
    const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
    
    const matchesSearch = 
      searchQuery === '' ||
      rep.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.targetOwnerName && rep.targetOwnerName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesStatus && matchesSearch;
  });

  const handleTakeAction = (action: 'warning_issued' | 'content_removed' | 'user_suspended' | 'badge_revoked' | 'dismissed') => {
    if (!selectedReport) return;

    if (action === 'dismissed') {
      TrustSafetyStore.updateReportStatus(selectedReport.id, 'dismissed', 'dismissed', adminNotes || 'Dismissed after review');
      setActionSuccessMsg(`Report #${selectedReport.id} dismissed.`);
    } else if (action === 'warning_issued') {
      TrustSafetyStore.executeModerationAction({
        adminId: 'admin-1',
        adminName: 'Admin Trust Desk',
        action: 'issue_warning',
        targetType: selectedReport.targetType,
        targetId: selectedReport.targetOwnerId || selectedReport.targetId,
        reason: selectedReport.reasonLabel,
        notes: adminNotes
      });
      setActionSuccessMsg(`Official warning issued to user for "${selectedReport.targetTitle}"`);
    } else if (action === 'content_removed') {
      TrustSafetyStore.executeModerationAction({
        adminId: 'admin-1',
        adminName: 'Admin Trust Desk',
        action: 'remove_content',
        targetType: selectedReport.targetType,
        targetId: selectedReport.targetId,
        reason: selectedReport.reasonLabel,
        notes: adminNotes
      });
      setActionSuccessMsg(`Content (${selectedReport.targetType}) removed and taken down.`);
    } else if (action === 'user_suspended') {
      TrustSafetyStore.executeModerationAction({
        adminId: 'admin-1',
        adminName: 'Admin Trust Desk',
        action: 'suspend_user',
        targetType: 'user',
        targetId: selectedReport.targetOwnerId || selectedReport.targetId,
        reason: selectedReport.reasonLabel,
        notes: adminNotes
      });
      setActionSuccessMsg(`User account suspended from OOU StudentCircle.`);
    } else if (action === 'badge_revoked') {
      TrustSafetyStore.executeModerationAction({
        adminId: 'admin-1',
        adminName: 'Admin Trust Desk',
        action: 'revoke_badge',
        targetType: 'user',
        targetId: selectedReport.targetOwnerId || selectedReport.targetId,
        reason: selectedReport.reasonLabel,
        notes: adminNotes
      });
      setActionSuccessMsg(`Verification badge revoked from user.`);
    }

    setSelectedReport(null);
    setAdminNotes('');
    refreshReports();
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const getTargetIcon = (type: ReportTargetType) => {
    switch (type) {
      case 'profile': return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'product': return <Package className="w-3.5 h-3.5 text-amber-600" />;
      case 'service': return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
      case 'job': return <Briefcase className="w-3.5 h-3.5 text-emerald-600" />;
      case 'shop': return <Store className="w-3.5 h-3.5 text-purple-600" />;
      case 'review': return <Star className="w-3.5 h-3.5 text-amber-500" />;
      case 'message': return <MessageSquare className="w-3.5 h-3.5 text-rose-600" />;
      default: return <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-black mb-1.5 border border-rose-200">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>OOU StudentCircle Trust & Safety Moderation</span>
          </div>
          <h1 className="text-2xl font-black text-[#061A4F]">
            Content Moderation & Incident Reports
          </h1>
          <p className="text-xs text-slate-500">
            Investigate policy violations across profiles, products, services, jobs, campus shops, reviews, and chat messages.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs text-xs flex items-center gap-2 font-bold text-slate-700">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>{reports.filter(r => r.status === 'pending').length} Action Required</span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Target Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
              typeFilter === 'all' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Types ({reports.length})
          </button>
          {(['profile', 'product', 'service', 'job', 'shop', 'review', 'message'] as ReportTargetType[]).map((type) => {
            const count = reports.filter(r => r.targetType === type).length;
            const isSelected = typeFilter === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getTargetIcon(type)}
                <span className="capitalize">{type}s</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, reporter, description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs w-full sm:w-auto overflow-x-auto">
            {(['pending', 'investigating', 'actioned', 'dismissed', 'all'] as const).map((st) => {
              const isSelected = statusFilter === st;
              const count = st === 'all' ? reports.length : reports.filter(r => r.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap capitalize ${
                    isSelected ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Target Entity</th>
                <th className="py-3.5 px-5">Report Reason</th>
                <th className="py-3.5 px-5">Reporter Details</th>
                <th className="py-3.5 px-5">Incident Description</th>
                <th className="py-3.5 px-5">Status / Action</th>
                <th className="py-3.5 px-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    <p className="font-bold">No incident reports matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/60 transition">
                    
                    {/* Target */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-slate-100 rounded-xl mt-0.5 shrink-0">
                          {getTargetIcon(rep.targetType)}
                        </div>
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.2 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded-md inline-block">
                            {rep.targetType}
                          </span>
                          <div className="font-bold text-[#061A4F] leading-snug">{rep.targetTitle}</div>
                          {rep.targetOwnerName && (
                            <div className="text-[11px] text-slate-500">By {rep.targetOwnerName}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-bold text-[11px] inline-block">
                        {rep.reasonLabel}
                      </span>
                    </td>

                    {/* Reporter */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">{rep.reporterName}</div>
                      <div className="text-[11px] text-slate-400">{rep.reporterEmail}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(rep.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-5 max-w-xs">
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {rep.description}
                      </p>
                      {rep.evidenceAttachments && rep.evidenceAttachments.length > 0 && (
                        <span className="text-[10px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{rep.evidenceAttachments.length} Evidence Attachment(s)</span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {rep.status === 'pending' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {rep.status === 'investigating' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-[#061A4F] font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                          Investigating
                        </span>
                      )}
                      {rep.status === 'actioned' && (
                        <div className="space-y-0.5">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Actioned
                          </span>
                          <div className="text-[10px] text-slate-500 font-semibold">{rep.actionTaken}</div>
                        </div>
                      )}
                      {rep.status === 'dismissed' && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Dismissed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReport(rep);
                          setAdminNotes(rep.adminNotes || '');
                        }}
                        className="px-3.5 py-1.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-[#F5B400] font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mediate & Action</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation & Action Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-rose-600 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Trust & Safety Moderation Desk</h2>
                  <p className="text-xs text-rose-100">Review Incident & Execute Remediation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Incident Banner */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-rose-200/60 text-rose-900 font-bold text-[10px] uppercase rounded-full">
                    Violation Type: {selectedReport.reasonLabel}
                  </span>
                  <span className="text-[11px] text-rose-700 font-semibold">
                    Reported {new Date(selectedReport.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base font-black text-rose-950">
                  {selectedReport.targetTitle}
                </h3>
                <p className="text-xs text-rose-900 leading-relaxed">
                  "{selectedReport.description}"
                </p>
              </div>

              {/* Entity & Reporter Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase">Reported By</span>
                  <div className="font-bold text-slate-900">{selectedReport.reporterName}</div>
                  <div className="text-slate-500">{selectedReport.reporterEmail}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase">Target Account / Owner</span>
                  <div className="font-bold text-slate-900">{selectedReport.targetOwnerName || 'Target Content Entity'}</div>
                  <div className="text-slate-500">ID: {selectedReport.targetId}</div>
                </div>
              </div>

              {/* Admin Remediation Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Moderator Audit Log & Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="State the findings of your investigation and the justification for the action taken..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                />
              </div>

              {/* Moderation Controls Matrix */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Remediation Action
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleTakeAction('warning_issued')}
                    className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left transition flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-black text-amber-900">Issue Official Warning</div>
                      <div className="text-[10px] text-amber-700">Send safety compliance warning to user.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTakeAction('content_removed')}
                    className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left transition flex items-start gap-2.5"
                  >
                    <Trash2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-black text-rose-900">Take Down Content</div>
                      <div className="text-[10px] text-rose-700">Unpublish & remove flagged {selectedReport.targetType}.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTakeAction('user_suspended')}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-left transition flex items-start gap-2.5"
                  >
                    <UserX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-black text-white">Suspend User Account</div>
                      <div className="text-[10px] text-slate-300">Disable login and lock all active listings.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTakeAction('dismissed')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition flex items-start gap-2.5"
                  >
                    <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-black text-slate-800">Dismiss Report</div>
                      <div className="text-[10px] text-slate-500">No policy violation detected.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Close footer */}
              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

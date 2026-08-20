import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight,
  RotateCcw,
  Check,
  X,
  User,
  ExternalLink,
  Scale
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { OrderDispute, DisputeResolutionAction } from '../../types/transaction';

export const AdminDisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<OrderDispute[]>(() => TransactionEngineStore.getDisputes());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<OrderDispute | null>(null);
  const [resolutionAction, setResolutionAction] = useState<DisputeResolutionAction>('refund_buyer');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshDisputes = () => {
    setDisputes(TransactionEngineStore.getDisputes());
  };

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    const refundAmount = resolutionAction === 'refund_buyer' 
      ? selectedDispute.orderAmount 
      : resolutionAction === 'split_settlement' 
      ? Math.round(selectedDispute.orderAmount * 0.5) 
      : 0;

    TransactionEngineStore.resolveDispute({
      disputeId: selectedDispute.id,
      action: resolutionAction,
      adminNotes: resolutionNotes || `Resolved via administrative arbitration (${resolutionAction})`,
      refundAmount,
      resolvedByAdmin: {
        id: 'admin-1',
        name: 'Admin ICT Directorate'
      }
    });

    DataStore.logAdminAction(
      'RESOLVE_DISPUTE',
      'dispute',
      selectedDispute.id,
      `Arbitrated dispute on Order #${selectedDispute.orderId} with decision: ${resolutionAction.toUpperCase()}`
    );

    refreshDisputes();
    showToast(`Dispute #${selectedDispute.disputeId || selectedDispute.id} successfully arbitrated.`);
    setSelectedDispute(null);
    setResolutionNotes('');
  };

  const filteredDisputes = disputes.filter(d => {
    const matchSearch = 
      d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.openedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.against.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.orderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reasonLabel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = disputes.filter(d => d.status === 'Open').length;
  const underReviewCount = disputes.filter(d => d.status === 'Under Review').length;
  const resolvedCount = disputes.filter(d => d.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#061A4F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#F5B400] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F] flex items-center gap-2">
            <Scale className="w-7 h-7 text-[#F5B400]" />
            <span>Escrow Dispute Arbitration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Impartial arbitration desk to inspect claims, review deliverables, and issue refunds or split settlements.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          Active Dispute Cases: <strong className="text-rose-600">{openCount + underReviewCount}</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-rose-600 uppercase">Open Disputes</div>
          <div className="text-2xl font-extrabold text-rose-600">{openCount}</div>
          <div className="text-[11px] text-slate-400">Escrow funds currently frozen</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-amber-600 uppercase">Under Review</div>
          <div className="text-2xl font-extrabold text-amber-600">{underReviewCount}</div>
          <div className="text-[11px] text-slate-400">Evidence and work undergoing inspection</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-emerald-600 uppercase">Resolved Cases</div>
          <div className="text-2xl font-extrabold text-emerald-700">{resolvedCount}</div>
          <div className="text-[11px] text-slate-400">Successfully closed & disbursed</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, buyer, seller, reason, or gig title..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Dispute Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case / Order</th>
                <th className="py-3 px-4">Opened By</th>
                <th className="py-3 px-4">Against Party</th>
                <th className="py-3 px-4">Disputed Amount</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Arbitration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisputes.length > 0 ? (
                filteredDisputes.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50/70 transition">
                    
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#061A4F]">{disp.disputeId || disp.id}</div>
                      <div className="text-[11px] text-slate-400">Order: {disp.orderId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{disp.openedBy.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{disp.openedBy.role}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{disp.against.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{disp.against.role}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#061A4F]">
                      ₦{disp.orderAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-100 rounded text-[10px] font-bold">
                        {disp.reasonLabel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        disp.status === 'Open'
                          ? 'bg-rose-100 text-rose-800'
                          : disp.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {disp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedDispute(disp)}
                        className="px-3 py-1.5 bg-[#061A4F] hover:bg-[#08226b] text-white font-bold text-xs rounded-xl transition"
                      >
                        {disp.status === 'Resolved' ? 'View Case' : 'Arbitrate'}
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No disputes match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Arbitration Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#061A4F]">
                  Arbitrate Dispute #{selectedDispute.disputeId || selectedDispute.id}
                </h3>
                <p className="text-xs text-slate-500">Order ID: {selectedDispute.orderId} • {selectedDispute.orderTitle}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Claimant</span>
                  <span className="font-bold text-slate-800">{selectedDispute.openedBy.name} ({selectedDispute.openedBy.role})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Respondent</span>
                  <span className="font-bold text-slate-800">{selectedDispute.against.name} ({selectedDispute.against.role})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Dispute Reason</span>
                <span className="font-bold text-rose-700">{selectedDispute.reasonLabel}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Claim Description</span>
                <p className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed mt-1">
                  {selectedDispute.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-600">Escrow Value in Dispute:</span>
                <span className="text-base text-[#061A4F]">₦{selectedDispute.orderAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Resolution Form */}
            {selectedDispute.status !== 'Resolved' ? (
              <form onSubmit={handleResolveDispute} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Arbitration Decision</label>
                  <select
                    value={resolutionAction}
                    onChange={(e) => setResolutionAction(e.target.value as DisputeResolutionAction)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    <option value="refund_buyer">100% Refund Buyer (Cancel order & return escrow to buyer)</option>
                    <option value="release_to_seller">100% Release to Seller (Reject claim & pay student/seller)</option>
                    <option value="split_settlement">50/50 Split Settlement (Split funds equally between parties)</option>
                    <option value="dismissed">Dismiss Dispute (Return order to active in-progress state)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Arbitration Findings & Legal Notes</label>
                  <textarea
                    required
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Document evidence verification, communication transcripts, and justification for this payout decision..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold transition"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#061A4F] hover:bg-[#08226b] text-white rounded-xl font-bold transition shadow-md"
                  >
                    Execute Binding Arbitration
                  </button>
                </div>

              </form>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Case Closed & Arbitrated</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Notes: {selectedDispute.adminNotes || 'Arbitration settled.'}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

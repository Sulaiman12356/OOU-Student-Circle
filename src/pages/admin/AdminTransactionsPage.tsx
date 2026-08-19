import React, { useState } from 'react';
import { DataStore } from '../../services/dataStore';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { WalletTransaction, PayoutRequest } from '../../types';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  CreditCard,
  Building,
  RefreshCw
} from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'escrow' | 'payouts'>('all');
  const [transactions, setTransactions] = useState<WalletTransaction[]>(DataStore.getTransactions());
  const [payouts, setPayouts] = useState<PayoutRequest[]>(MarketplaceStore.getPayoutRequests());
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdatePayoutStatus = (payoutId: string, status: PayoutRequest['status']) => {
    MarketplaceStore.updatePayoutStatus(payoutId, status);
    DataStore.logAdminAction(
      'UPDATE_PAYOUT_STATUS',
      'payout',
      payoutId,
      `Payout marked as ${status.toUpperCase()}`
    );
    setPayouts(MarketplaceStore.getPayoutRequests());
    showToast(`Payout status updated to ${status}`);
  };

  // Financial Calculations
  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const platformRevenue = transactions.reduce((sum, t) => sum + (t.platformFee || 0), 0);
  const heldInEscrow = transactions.filter(t => t.status === 'held_in_escrow').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalPayouts = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = 
      (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.payerName && t.payerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.recipientName && t.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.jobTitle && t.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'escrow') return matchSearch && t.status === 'held_in_escrow';
    return matchSearch;
  });

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
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Financial Telemetry & Escrow</h1>
          <p className="text-xs text-slate-500 mt-1">
            Escrow ledger, commission accounting, student wallet balances, and vendor bank payouts.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          Platform Commission Rate: <strong className="text-[#061A4F]">10%</strong>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross GMV Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            ₦{totalVolume.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Total processed marketplace transactions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Revenue</span>
            <div className="w-2 h-2 rounded-full bg-[#F5B400]"></div>
          </div>
          <div className="text-2xl font-extrabold text-[#F5B400]">
            ₦{platformRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">10% maintenance & escrow fee earnings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Held in Escrow Vault</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">
            ₦{heldInEscrow.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Active project funds awaiting milestone sign-off</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Disbursed Payouts</span>
            <Wallet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">
            ₦{totalPayouts.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Paid directly to Nigerian NUBAN accounts</div>
        </div>

      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'all'
                ? 'bg-[#061A4F] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Ledger Records ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'escrow'
                ? 'bg-[#061A4F] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Escrow Holds
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'payouts'
                ? 'bg-[#061A4F] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Vendor Payout Requests ({payouts.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, payer, recipient..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
          />
        </div>
      </div>

      {/* Transactions Table (for 'all' and 'escrow' tabs) */}
      {activeTab !== 'payouts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction / Reference</th>
                  <th className="py-3 px-4">Payer (Client)</th>
                  <th className="py-3 px-4">Recipient (Student)</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Platform Fee (10%)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tx.reference || tx.id}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.jobTitle || 'Freelance Service Contract'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{tx.payerName || 'Client'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#061A4F]">{tx.recipientName || 'Student'}</div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₦{(tx.amount || 0).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-[#F5B400] font-bold">
                        ₦{(tx.platformFee || Math.round((tx.amount || 0) * 0.1)).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-700">
                        ₦{(tx.netAmount || Math.round((tx.amount || 0) * 0.9)).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          tx.status === 'released' || tx.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'held_in_escrow'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.status === 'refunded'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.status?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No transactions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payouts Table (for 'payouts' tab) */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vendor / Student</th>
                  <th className="py-3 px-4">Amount Requested</th>
                  <th className="py-3 px-4">Bank Name</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.length > 0 ? (
                  payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.vendorStoreName || 'Student'}</div>
                        <div className="text-[10px] text-slate-400">{p.vendorId}</div>
                      </td>

                      <td className="py-3 px-4 font-extrabold text-[#061A4F]">
                        ₦{p.amount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {p.bankName}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {p.accountNumber}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {p.accountName}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          p.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : p.status === 'failed' || p.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status !== 'paid' && (
                            <button
                              onClick={() => handleUpdatePayoutStatus(p.id, 'paid')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                            >
                              Approve Payout
                            </button>
                          )}
                          {p.status === 'pending' && (
                            <button
                              onClick={() => handleUpdatePayoutStatus(p.id, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-xl transition"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No vendor payout requests pending.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

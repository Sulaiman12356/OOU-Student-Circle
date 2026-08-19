import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  CreditCard,
  History
} from 'lucide-react';

export const StudentEarningsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bankName, setBankName] = useState('GTBank (Guaranty Trust Bank)');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState(currentUser?.fullName || 'Student Account');
  const [savedBank, setSavedBank] = useState(false);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10000);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const [transactions, setTransactions] = useState([
    {
      id: 'tx-101',
      title: 'Payment for Logo & Brand Design (Apex Studio)',
      type: 'credit',
      amount: 25000,
      status: 'completed',
      date: '2025-02-14'
    },
    {
      id: 'tx-102',
      title: 'Payment for CSC Tutoring Milestone (OOU Freshers)',
      type: 'credit',
      amount: 15000,
      status: 'completed',
      date: '2025-02-10'
    },
    {
      id: 'tx-103',
      title: 'Bank Payout to GTBank ••6789',
      type: 'debit',
      amount: 20000,
      status: 'completed',
      date: '2025-02-05'
    },
    {
      id: 'tx-104',
      title: 'Payment for UI/UX Wireframing (Sagamu Health)',
      type: 'credit',
      amount: 25000,
      status: 'completed',
      date: '2025-01-28'
    }
  ]);

  const nigerianBanks = [
    'GTBank (Guaranty Trust Bank)',
    'Access Bank',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'OPay Digital Services',
    'Palmpay Nigeria',
    'Kuda Microfinance Bank',
    'Stanbic IBTC Bank',
    'Moniepoint MFB'
  ];

  const availableBalance = currentUser?.totalEarnings || 45000;
  const pendingInEscrow = 15000;

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBank(true);
    setTimeout(() => setSavedBank(false), 3000);
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    if (withdrawAmount > availableBalance) {
      setWithdrawError('Withdrawal amount exceeds your available wallet balance.');
      return;
    }
    if (withdrawAmount < 2000) {
      setWithdrawError('Minimum withdrawal amount is ₦2,000.');
      return;
    }

    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
      setTransactions([
        {
          id: `tx-${Date.now()}`,
          title: `Bank Payout to ${bankName.split(' ')[0]} ••${accountNumber.slice(-4)}`,
          type: 'debit',
          amount: Number(withdrawAmount),
          status: 'completed',
          date: new Date().toISOString().split('T')[0]
        },
        ...transactions
      ]);
      setTimeout(() => setWithdrawSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Earnings & Wallet Settlement</h1>
        <p className="text-xs text-slate-500">Manage client payouts, direct Nigerian bank account settlements, and income ledger</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#061A4F] text-white p-6 rounded-3xl shadow-lg border border-[#F5B400]/30 space-y-2 relative overflow-hidden">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Available Wallet Balance
          </span>
          <div className="text-3xl font-extrabold text-[#F5B400]">
            ₦{(availableBalance || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300">
            Ready for instant bank transfer
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pending in Milestone Escrow
          </span>
          <div className="text-3xl font-extrabold text-[#061A4F]">
            ₦{(pendingInEscrow || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            Released upon client final milestone approval
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Lifetime Earned
          </span>
          <div className="text-3xl font-extrabold text-emerald-700">
            ₦{((availableBalance || 0) + 20000).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            Across 5 completed contracts
          </p>
        </div>

      </div>

      {/* Grid: Bank Payout & Request Withdrawal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Bank Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#061A4F] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#F5B400]" />
              <span>Nigerian Bank Payout Details</span>
            </h3>
            {savedBank && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveBank} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Select Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              >
                {nigerianBanks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">10-Digit NUBAN Account Number</label>
              <input
                type="text"
                required
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Account Name (Must match student name)</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-100 hover:bg-[#061A4F] hover:text-white text-[#061A4F] font-bold text-xs rounded-xl transition"
            >
              Update Payout Account
            </button>
          </form>
        </div>

        {/* Card 2: Request Payout Withdrawal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-[#061A4F] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Request Bank Transfer Payout</span>
          </h3>

          {withdrawSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Withdrawal request processed! Funds are dispatched to your verified bank account.</span>
            </div>
          )}

          {withdrawError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          <form onSubmit={handleRequestWithdrawal} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Amount to Withdraw (₦ NGN)</label>
              <input
                type="number"
                required
                min={2000}
                max={availableBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
              <span className="text-[10px] text-slate-400">Min. withdrawal: ₦2,000 • 0% platform fee</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Destination Bank:</span>
                <strong className="text-slate-800">{bankName.split(' ')[0]}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Account Number:</span>
                <strong className="text-slate-800">{accountNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Account Name:</span>
                <strong className="text-slate-800">{accountName}</strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={withdrawing || availableBalance < 2000}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
            >
              {withdrawing ? 'Processing Transfer...' : `Withdraw ₦${(withdrawAmount || 0).toLocaleString()} Now`}
            </button>
          </form>
        </div>

      </div>

      {/* Transaction History Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#061A4F] flex items-center gap-2">
          <History className="w-4 h-4 text-[#F5B400]" />
          <span>Wallet Activity Ledger</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction / Job</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-[#061A4F]">
                    {t.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {t.date}
                  </td>
                  <td className="py-3.5 px-4">
                    {t.type === 'credit' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Credit +
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Debit -
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 text-right font-extrabold ${t.type === 'credit' ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {t.type === 'credit' ? '+' : '-'}₦{(t.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

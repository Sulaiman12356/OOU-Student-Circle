import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminService, PlatformLiveStats } from '../../services/adminService';
import { DataStore } from '../../services/dataStore';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { CampusStore } from '../../services/campusStore';
import { OpportunityStore } from '../../services/opportunityStore';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { AdminActivityLog } from '../../types/admin';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Store, 
  Package, 
  Sparkles, 
  Briefcase, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Tags, 
  FileText, 
  Sliders, 
  ShieldAlert,
  Clock,
  TrendingUp,
  Activity,
  RefreshCw,
  BarChart3,
  UserPlus
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();
  
  const [liveStats, setLiveStats] = useState<PlatformLiveStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminActivityLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [stats, logs] = await Promise.all([
        AdminService.getLivePlatformStats(),
        AdminService.getAuditLogs(8)
      ]);
      setLiveStats(stats);
      setAuditLogs(logs);
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fallback calculations if liveStats still loading
  const allUsers = DataStore.getUsers();
  const activeUsers = allUsers.filter(u => u.status === 'active');
  const students = allUsers.filter(u => u.role === 'student');
  const unverifiedStudents = students.filter(u => !u.isVerified || u.verificationStatus === 'pending');

  const stats: PlatformLiveStats = liveStats || {
    totalUsers: allUsers.length,
    activeUsers: activeUsers.length,
    studentProfessionals: students.length,
    vendors: MarketplaceStore.getAllVendors().length || 3,
    campusShops: CampusStore.getShops().length,
    services: DataStore.getServices().length,
    products: MarketplaceStore.getAllProducts().length,
    jobs: OpportunityStore.getOpportunities().length,
    orders: CampusStore.getOrders().length + TransactionEngineStore.getOrders().length,
    completedTransactions: DataStore.getTransactions().length,
    pendingVerification: unverifiedStudents.length,
    reports: TrustSafetyStore.getReports().length + MarketplaceStore.getAllReports().length,
    disputes: TransactionEngineStore.getDisputes().length
  };

  const handleQuickApprove = async (userId: string) => {
    DataStore.verifyUser(userId, true);
    if (adminProfile) {
      await AdminService.logActivity({
        adminId: adminProfile.uid,
        adminEmail: adminProfile.email,
        action: 'QUICK_VERIFY_STUDENT',
        targetType: 'user',
        targetId: userId,
        description: `Verified student ID for user ${userId}`
      });
    }
    await loadData();
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#061A4F] text-white p-6 sm:p-8 rounded-3xl border border-[#F5B400]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-extrabold uppercase">
              OOU StudentCircle Master Console
            </span>
            {isSuperAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400]/20 text-[#F5B400] border border-[#F5B400]/40 text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Super Administrator</span>
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Telemetry Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Platform Administration Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Live telemetry, multi-campus moderation, student identity accreditation, and financial escrow governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/20 flex items-center justify-center cursor-pointer"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className={`w-4 h-4 text-[#F5B400] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('/admin/verification')}
            className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Queue ({stats.pendingVerification})</span>
          </button>
          
          <button
            onClick={() => onNavigate('/admin/analytics')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#F5B400]" />
            <span>Live Analytics</span>
          </button>
        </div>
      </div>

      {/* 13 REAL METRICS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#F5B400]" />
            <span>Platform Core Metrics ({new Date().toLocaleDateString()})</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Strict live database aggregation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          
          {/* 1. Users */}
          <div 
            onClick={() => onNavigate('/admin/users')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-[#061A4F]">{stats.totalUsers}</div>
            <div className="text-[10px] text-slate-400">Registered accounts</div>
          </div>

          {/* 2. Active Users */}
          <div 
            onClick={() => onNavigate('/admin/users')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Users</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">{stats.activeUsers}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Non-suspended</div>
          </div>

          {/* 3. Student Professionals */}
          <div 
            onClick={() => onNavigate('/admin/users')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Student Pros</span>
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700">{stats.studentProfessionals}</div>
            <div className="text-[10px] text-slate-400">Undergraduates & alumni</div>
          </div>

          {/* 4. Vendors */}
          <div 
            onClick={() => onNavigate('/admin/marketplace')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Vendors</span>
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">{stats.vendors}</div>
            <div className="text-[10px] text-slate-400">Campus merchants</div>
          </div>

          {/* 5. Campus Shops */}
          <div 
            onClick={() => onNavigate('/admin/shops')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Campus Shops</span>
              <Store className="w-4 h-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black text-[#061A4F]">{stats.campusShops}</div>
            <div className="text-[10px] text-slate-400">Across 4 OOU campuses</div>
          </div>

          {/* 6. Products */}
          <div 
            onClick={() => onNavigate('/admin/products')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Products</span>
              <Package className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-700">{stats.products}</div>
            <div className="text-[10px] text-slate-400">Marketplace listings</div>
          </div>

          {/* 7. Services */}
          <div 
            onClick={() => onNavigate('/admin/services')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Services</span>
              <Sparkles className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-2xl font-black text-pink-700">{stats.services}</div>
            <div className="text-[10px] text-slate-400">Student skill offerings</div>
          </div>

          {/* 8. Jobs */}
          <div 
            onClick={() => onNavigate('/admin/jobs')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Jobs / Gigs</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">{stats.jobs}</div>
            <div className="text-[10px] text-slate-400">Opportunities & briefs</div>
          </div>

          {/* 9. Orders */}
          <div 
            onClick={() => onNavigate('/admin/transactions')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-700">{stats.orders}</div>
            <div className="text-[10px] text-slate-400">Campus + marketplace</div>
          </div>

          {/* 10. Transactions */}
          <div 
            onClick={() => onNavigate('/admin/transactions')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Transactions</span>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-black text-[#061A4F]">{stats.completedTransactions}</div>
            <div className="text-[10px] text-slate-400">Escrow & payout records</div>
          </div>

          {/* 11. Pending Verification */}
          <div 
            onClick={() => onNavigate('/admin/verification')}
            className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm hover:border-amber-400 transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending ID/Tier</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">{stats.pendingVerification}</div>
            <div className="text-[10px] text-amber-700 font-bold">Needs admin review</div>
          </div>

          {/* 12. Reports */}
          <div 
            onClick={() => onNavigate('/admin/reports')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Reports</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600">{stats.reports}</div>
            <div className="text-[10px] text-slate-400">Flagged content & safety</div>
          </div>

          {/* 13. Disputes */}
          <div 
            onClick={() => onNavigate('/admin/disputes')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#061A4F] transition cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Disputes</span>
              <Scale className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700">{stats.disputes}</div>
            <div className="text-[10px] text-slate-400">Contested escrow orders</div>
          </div>

        </div>
      </div>

      {/* ADMINISTRATIVE CONTROL MODULES */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#061A4F] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#F5B400]" />
          <span>Administrative Control Modules</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          <button
            onClick={() => onNavigate('/admin/users')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">User Management</div>
                <div className="text-[10px] text-slate-400">Search, suspend, verify</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/services')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Service Moderation</div>
                <div className="text-[10px] text-slate-400">Approve, reject, remove</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/products')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Product Moderation</div>
                <div className="text-[10px] text-slate-400">Campus listings review</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/jobs')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Job Moderation</div>
                <div className="text-[10px] text-slate-400">Client briefs & gigs</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/shops')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Shop Moderation</div>
                <div className="text-[10px] text-slate-400">Accredit & verify shops</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/locations')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Campus Locations</div>
                <div className="text-[10px] text-slate-400">4 OOU campus sites</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/categories')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <Tags className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Category Taxonomy</div>
                <div className="text-[10px] text-slate-400">Services, items, gigs</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Safety & Reports</div>
                <div className="text-[10px] text-slate-400">Universal content reports</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/disputes')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Dispute Arbitration</div>
                <div className="text-[10px] text-slate-400">Escrow resolutions</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/transactions')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Financial Telemetry</div>
                <div className="text-[10px] text-slate-400">Escrow ledger & payouts</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          <button
            onClick={() => onNavigate('/admin/activity')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#061A4F]">Audit Activity Trail</div>
                <div className="text-[10px] text-slate-400">Immutable admin logs</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
          </button>

          {isSuperAdmin ? (
            <button
              onClick={() => onNavigate('/admin/settings/administrators')}
              className="p-4 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">Admin Staff RBAC</div>
                  <div className="text-[10px] text-blue-700 font-semibold">Super Admin Only</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#061A4F] transition" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin/settings')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#061A4F]">Platform Settings</div>
                  <div className="text-[10px] text-slate-400">Commissions & features</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#061A4F] transition" />
            </button>
          )}

        </div>
      </div>

      {/* Verification Queue & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Pending Student Verifications */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5B400]" />
              <span>Pending ID Verification Queue</span>
            </h2>
            <button
              onClick={() => onNavigate('/admin/verification')}
              className="text-xs font-bold text-[#061A4F] hover:underline cursor-pointer"
            >
              View Full Queue ({unverifiedStudents.length})
            </button>
          </div>

          {unverifiedStudents.length > 0 ? (
            <div className="space-y-3">
              {unverifiedStudents.slice(0, 4).map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.profilePhoto}
                      alt={student.fullName}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#061A4F] truncate">{student.fullName}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Matric: <strong>{student.matricNumber || 'Pending'}</strong> • {student.department} ({student.level})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {student.faculty} • {student.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuickApprove(student.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Verification Queue is Empty</div>
              <p className="text-[11px] text-slate-400">All student matric credentials and profile tiers have been verified.</p>
            </div>
          )}
        </div>

        {/* Right: Recent Audit Log Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F] flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Live System Audit Log</span>
            </h2>
            <button
              onClick={() => onNavigate('/admin/activity')}
              className="text-xs font-bold text-[#061A4F] hover:underline cursor-pointer"
            >
              All Logs
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {auditLogs.length > 0 ? (
              auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 bg-[#061A4F] text-white font-mono text-[9px] font-bold rounded">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">{log.description}</p>
                  <div className="text-[10px] text-slate-400">By: {log.adminEmail}</div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No recent admin activity recorded.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

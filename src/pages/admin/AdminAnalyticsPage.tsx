import React, { useState, useEffect } from 'react';
import { AdminService, PlatformLiveStats } from '../../services/adminService';
import { DataStore } from '../../services/dataStore';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { CampusStore } from '../../services/campusStore';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Sparkles, 
  Layers, 
  Activity, 
  CheckCircle2,
  PieChart,
  BarChart3,
  Calendar
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformLiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await AdminService.getLivePlatformStats();
      setStats(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const users = DataStore.getUsers();
  const services = DataStore.getServices();
  const products = MarketplaceStore.getAllProducts();
  const transactions = DataStore.getTransactions();

  // Category aggregations
  const serviceCategoriesCount: Record<string, number> = {};
  services.forEach(s => {
    serviceCategoriesCount[s.category] = (serviceCategoriesCount[s.category] || 0) + 1;
  });

  const facultyCount: Record<string, number> = {};
  users.forEach(u => {
    if (u.faculty) {
      facultyCount[u.faculty] = (facultyCount[u.faculty] || 0) + 1;
    }
  });

  // Calculate gross escrow volume
  const grossVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#F5B400]/20 text-[#061A4F] text-[10px] font-extrabold border border-[#F5B400]/40 uppercase">
              Platform Telemetry
            </span>
            <span className="text-xs text-slate-400">Live Production Aggregation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#061A4F] mt-1">Platform Analytics & Growth Trends</h1>
          <p className="text-xs text-slate-500">
            Real-time multi-campus activity metrics, transaction volume, and verified identity distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F] shadow-sm font-semibold text-slate-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All-Time Cumulative</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-8 h-8 border-3 border-[#061A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Calculating real analytics from Firestore records...</p>
        </div>
      ) : !stats || stats.totalUsers === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2">
          <Activity className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Not enough data yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            As students and campus businesses register and trade across Ago-Iwoye, Ayetoro, Ibogun, and Sagamu campuses, live growth trends will populate here automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Gross Transaction Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#061A4F]">
                ₦{grossVolume.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{stats.completedTransactions} completed settlements</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Active Accounts</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-[#061A4F]">
                {stats.activeUsers} <span className="text-xs font-normal text-slate-400">/ {stats.totalUsers}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                {((stats.activeUsers / (stats.totalUsers || 1)) * 100).toFixed(0)}% account health rate
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Verified Identity Ratio</span>
                <ShieldCheck className="w-4 h-4 text-[#F5B400]" />
              </div>
              <div className="text-2xl font-black text-[#061A4F]">
                {users.filter(u => u.isVerified).length} <span className="text-xs font-normal text-slate-400">verified</span>
              </div>
              <div className="text-[10px] text-amber-600 font-semibold">
                {stats.pendingVerification} awaiting document audit
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Dispute & Incident Rate</span>
                <Scale className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-[#061A4F]">
                {stats.disputes} <span className="text-xs font-normal text-slate-400">disputes</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                {stats.reports} safety incident reports
              </div>
            </div>

          </div>

          {/* Detailed Distribution Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Service Categories Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#061A4F]" />
                  <h3 className="font-extrabold text-sm text-[#061A4F]">Service Categories Distribution</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">{services.length} Total Services</span>
              </div>

              {Object.keys(serviceCategoriesCount).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Not enough category data yet.</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(serviceCategoriesCount).map(([cat, count]) => {
                    const pct = Math.round((count / services.length) * 100);
                    return (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{cat}</span>
                          <span>{count} listings ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#061A4F] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Faculty Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#F5B400]" />
                  <h3 className="font-extrabold text-sm text-[#061A4F]">Campus Faculty Demographics</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">{users.length} Users</span>
              </div>

              {Object.keys(facultyCount).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Not enough faculty data yet.</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(facultyCount).slice(0, 6).map(([faculty, count]) => {
                    const pct = Math.round((count / users.length) * 100);
                    return (
                      <div key={faculty} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{faculty}</span>
                          <span>{count} students ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#F5B400] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Campus Location Breakdowns */}
          <div className="bg-[#061A4F] text-white p-6 sm:p-8 rounded-3xl border border-[#F5B400]/30 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Multi-Campus Trading Nodes</h3>
                <p className="text-xs text-slate-300">Distribution of registered kiosks and campus service zones across OOU centers.</p>
              </div>
              <span className="px-2.5 py-1 bg-[#F5B400] text-[#061A4F] text-xs font-black rounded-xl">
                4 Campuses Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-slate-300 uppercase font-bold">Main Campus</div>
                <div className="text-base font-black text-white">Ago-Iwoye</div>
                <div className="text-[10px] text-[#F5B400] font-semibold mt-1">Permanent Site & Mini Campus</div>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-slate-300 uppercase font-bold">Agricultural Sciences</div>
                <div className="text-base font-black text-white">Ayetoro</div>
                <div className="text-[10px] text-emerald-300 font-semibold mt-1">FAS & Veterinary Hub</div>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-slate-300 uppercase font-bold">Engineering & Tech</div>
                <div className="text-base font-black text-white">Ibogun</div>
                <div className="text-[10px] text-blue-300 font-semibold mt-1">Engineering Complex</div>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-slate-300 uppercase font-bold">Health Sciences / OOUTH</div>
                <div className="text-base font-black text-white">Sagamu</div>
                <div className="text-[10px] text-purple-300 font-semibold mt-1">Medical College & Hospital</div>
              </div>
            </div>
          </div>

        </>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { ProductItem, ProductReport, PayoutRequest, VendorProfile } from '../../types/marketplace';
import { 
  Store, 
  Package, 
  AlertTriangle, 
  Wallet, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Check, 
  X, 
  Clock, 
  Flag,
  Search,
  SlidersHorizontal
} from 'lucide-react';

export const AdminMarketplacePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'vendors' | 'reports' | 'payouts'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  // Live collections
  const products: ProductItem[] = MarketplaceStore.getAllProducts();
  const reports: ProductReport[] = MarketplaceStore.getAllReports();
  const payouts: PayoutRequest[] = MarketplaceStore.getAllPayouts();
  const vendors: VendorProfile[] = MarketplaceStore.getAllVendors();

  // Metrics
  const totalProducts = products.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
  const totalEscrowGross = products.reduce((sum, p) => sum + (p.price * (p.salesCount || 0)), 0);

  // Handlers
  const handleApproveProduct = (productId: string) => {
    MarketplaceStore.updateProductStatus(productId, 'published');
  };

  const handlePauseProduct = (productId: string) => {
    MarketplaceStore.updateProductStatus(productId, 'paused');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Delete this product from marketplace?')) {
      MarketplaceStore.deleteProduct(productId);
    }
  };

  const handleResolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    MarketplaceStore.updateReportStatus(reportId, action);
  };

  const handleProcessPayout = (payoutId: string) => {
    MarketplaceStore.updatePayoutStatus(payoutId, 'paid');
  };

  const handleVerifyVendor = (vendorId: string) => {
    const v = MarketplaceStore.getVendorById(vendorId);
    if (v) {
      MarketplaceStore.saveVendor({ ...v, verificationStatus: 'approved' });
    }
  };

  return (
    <div id="admin-marketplace-panel" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">StudentCircle Marketplace Moderation</h2>
          <p className="text-xs text-slate-500">Monitor campus products, vendor payouts, reports, and community integrity</p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Live Products</span>
          <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
          <span className="text-[10px] text-emerald-700 font-bold">{vendors.length} Registered Vendors</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Pending Safety Reports</span>
          <div className="text-2xl font-black text-rose-600">{pendingReports}</div>
          <span className="text-[10px] text-slate-400">Items flagged by students</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Pending Vendor Payouts</span>
          <div className="text-2xl font-black text-amber-600">{pendingPayouts}</div>
          <span className="text-[10px] text-slate-400">Withdrawals awaiting release</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Platform Commission (10%)</span>
          <div className="text-2xl font-black text-[#061A4F]">₦{(totalEscrowGross * 0.1).toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Facilitation revenue</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'vendors', label: `Vendors (${vendors.length})`, icon: Store },
          { id: 'reports', label: `Reports (${pendingReports})`, icon: AlertTriangle, badge: pendingReports },
          { id: 'payouts', label: `Payout Requests (${pendingPayouts})`, icon: Wallet, badge: pendingPayouts }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================= */}
      {/* PRODUCTS TAB */}
      {/* ======================================= */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900">Campus Product Catalog</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (₦)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products
                  .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendorStoreName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={p.mainImage || p.images[0]} alt={p.title} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-[180px]">{p.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-bold">{p.vendorStoreName}</td>
                      <td className="p-3 text-slate-500">{p.category}</td>
                      <td className="p-3 font-bold text-slate-900">₦{p.price.toLocaleString()}</td>
                      <td className="p-3">{p.quantity}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          p.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'paused' ? 'bg-slate-200 text-slate-700' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {p.status !== 'published' ? (
                          <button
                            onClick={() => handleApproveProduct(p.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePauseProduct(p.id)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-[10px] font-bold"
                          >
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* VENDORS TAB */}
      {/* ======================================= */}
      {activeTab === 'vendors' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900">Registered Student Vendors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => (
              <div key={v.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={v.profileImage} alt={v.storeName} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{v.storeName}</h4>
                    <p className="text-[11px] text-slate-500">{v.studentName} • {v.studentDepartment}</p>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                      v.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.verificationStatus}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  <p>Bank: {v.bankInfo?.bankName} ({v.bankInfo?.accountNumber})</p>
                  <p>WhatsApp: {v.whatsappNumber}</p>
                </div>
                {v.verificationStatus !== 'approved' && (
                  <button
                    onClick={() => handleVerifyVendor(v.id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Verify Student Vendor
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* REPORTS TAB */}
      {/* ======================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900">Student Safety Reports</h3>
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center">No reports flagged by students.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-rose-100 text-rose-800 rounded">
                        {r.reason}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{r.productTitle}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600">{r.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                    <span>Reported by: {r.reporterName} ({r.reporterEmail})</span>
                    {r.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveReport(r.id, 'dismissed')}
                          className="px-2.5 py-1 text-[10px] font-bold bg-slate-200 text-slate-700 rounded-lg"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            MarketplaceStore.deleteProduct(r.productId);
                            handleResolveReport(r.id, 'resolved');
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-rose-600 text-white rounded-lg"
                        >
                          Remove Product & Resolve
                        </button>
                      </div>
                    ) : (
                      <span className="font-bold uppercase text-emerald-700">{r.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* PAYOUTS TAB */}
      {/* ======================================= */}
      {activeTab === 'payouts' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900">Vendor Withdrawal Payout Queue</h3>
          {payouts.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center">No withdrawal payout requests currently.</p>
          ) : (
            <div className="space-y-3">
              {payouts.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{req.vendorStoreName}</span>
                    <p className="text-xs text-slate-600">
                      Destination: {req.bankName} • Account: <span className="font-mono font-bold">{req.accountNumber}</span> ({req.accountName})
                    </p>
                    <span className="text-[10px] text-slate-400">{new Date(req.requestedAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">₦{req.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                        req.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleProcessPayout(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Approve & Mark Transferred
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

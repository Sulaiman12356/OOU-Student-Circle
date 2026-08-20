import React, { useState } from 'react';
import { CampusStore } from '../../services/campusStore';
import { DataStore } from '../../services/dataStore';
import { CampusShop, ShopVerificationStatus } from '../../types/campus';
import { 
  Store, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Clock, 
  Check, 
  X, 
  AlertTriangle, 
  PauseCircle,
  ExternalLink,
  MessageSquare,
  Building
} from 'lucide-react';

export const AdminShopsPage: React.FC = () => {
  const [shops, setShops] = useState<CampusShop[]>(() => CampusStore.getShops());
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedShop, setSelectedShop] = useState<CampusShop | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshShops = () => {
    setShops(CampusStore.getShops());
  };

  const handleUpdateVerification = (shopId: string, status: ShopVerificationStatus) => {
    CampusStore.updateShopStatus(shopId, status, actionReason);
    DataStore.logAdminAction(
      `SHOP_VERIFICATION_${status.toUpperCase()}`,
      'campus_shop',
      shopId,
      `Updated shop verification status to ${status.toUpperCase()}${actionReason ? ` - Reason: ${actionReason}` : ''}`
    );
    refreshShops();
    showToast(`Shop status updated to ${status}`);
    if (selectedShop?.id === shopId) {
      setSelectedShop({ ...selectedShop, verificationStatus: status });
    }
    setActionReason('');
  };

  const filteredShops = shops.filter(shop => {
    const matchSearch = 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.campusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.specificArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCampus = campusFilter === 'all' || shop.campusId === campusFilter || shop.campusName.toLowerCase().includes(campusFilter.toLowerCase());
    const matchVerification = verificationFilter === 'all' || shop.verificationStatus === verificationFilter;

    return matchSearch && matchCampus && matchVerification;
  });

  const verifiedCount = shops.filter(s => s.verificationStatus === 'verified').length;
  const pendingCount = shops.filter(s => s.verificationStatus === 'pending' || s.verificationStatus === 'under_review').length;
  const suspendedCount = shops.filter(s => s.verificationStatus === 'suspended').length;

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
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Campus Shop Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify, accredit, and moderate student-serving business centers and kiosks across all 5 OOU campuses.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          Registered Campus Shops: <strong className="text-[#061A4F]">{shops.length}</strong>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Verified Shops</div>
            <div className="text-xl font-extrabold text-emerald-700">{verifiedCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Pending Review</div>
            <div className="text-xl font-extrabold text-amber-600">{pendingCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Suspended Shops</div>
            <div className="text-xl font-extrabold text-rose-600">{suspendedCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <PauseCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shops by name, owner, campus, or landmark..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Campuses</option>
              <option value="main-campus">Main Campus (Permanent Site)</option>
              <option value="mini-campus">Mini Campus (Ago-Iwoye)</option>
              <option value="ibogun">Ibogun Campus</option>
              <option value="ayetoro">Ayetoro Campus</option>
              <option value="sagamu">Sagamu Campus</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Verification Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Shop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Shop Details</th>
                <th className="p-4">Campus & Location</th>
                <th className="p-4">Owner & Contact</th>
                <th className="p-4">Services</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50/70 transition">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={shop.logo || (shop.photos && shop.photos.length > 0 ? shop.photos[0] : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80')}
                          alt={shop.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-[#061A4F] truncate flex items-center gap-1">
                            <span>{shop.name}</span>
                            {shop.verificationStatus === 'verified' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{shop.description}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Code: {shop.shopCode || shop.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{shop.campusName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{shop.specificArea}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{shop.ownerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{shop.ownerPhone || shop.whatsappNumber}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {shop.servicesOffered?.slice(0, 2).map((srv, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-medium">
                            {srv}
                          </span>
                        ))}
                        {(shop.servicesOffered?.length || 0) > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-bold">
                            +{(shop.servicesOffered?.length || 0) - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                        shop.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : shop.verificationStatus === 'suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : shop.verificationStatus === 'rejected'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {shop.verificationStatus === 'verified' && <ShieldCheck className="w-3 h-3" />}
                        {shop.verificationStatus === 'suspended' && <PauseCircle className="w-3 h-3" />}
                        <span>{shop.verificationStatus}</span>
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Modal */}
                        <button
                          onClick={() => setSelectedShop(shop)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          title="View Shop Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Verify / Approve */}
                        {shop.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => handleUpdateVerification(shop.id, 'verified')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="Verify & Accredit Shop"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}

                        {/* Suspend */}
                        {shop.verificationStatus === 'verified' && (
                          <button
                            onClick={() => handleUpdateVerification(shop.id, 'suspended')}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                            title="Suspend Shop"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Reject */}
                        {shop.verificationStatus !== 'rejected' && shop.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => handleUpdateVerification(shop.id, 'rejected')}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                            title="Reject Shop"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Store className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No campus shops match the search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shop Detail Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase rounded">
                  {selectedShop.campusName}
                </span>
                <h3 className="text-lg font-bold text-[#061A4F] mt-1">{selectedShop.name}</h3>
              </div>
              <button
                onClick={() => setSelectedShop(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shop Photos */}
            {selectedShop.photos && selectedShop.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedShop.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`${selectedShop.name} ${idx + 1}`}
                    className="w-full h-36 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Specific Location</div>
                <div className="font-bold text-slate-800">{selectedShop.specificArea}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Operating Hours</div>
                <div className="font-bold text-slate-800">{selectedShop.openingHours} - {selectedShop.closingHours}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Owner</div>
                <div className="font-bold text-slate-800">{selectedShop.ownerName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Status</div>
                <div className="font-bold text-slate-800 capitalize">{selectedShop.verificationStatus}</div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Services & Catalogue</h4>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {selectedShop.servicesOffered?.map((srv, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Pickup Instructions */}
            {selectedShop.pickupInstructions && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pickup & Delivery Instructions</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedShop.pickupInstructions}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedShop.verificationStatus !== 'verified' && (
                <button
                  onClick={() => handleUpdateVerification(selectedShop.id, 'verified')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Verify Shop</span>
                </button>
              )}
              {selectedShop.verificationStatus === 'verified' && (
                <button
                  onClick={() => handleUpdateVerification(selectedShop.id, 'suspended')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Suspend Shop</span>
                </button>
              )}
              {selectedShop.verificationStatus !== 'rejected' && selectedShop.verificationStatus !== 'verified' && (
                <button
                  onClick={() => handleUpdateVerification(selectedShop.id, 'rejected')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  Eye, 
  Image as ImageIcon,
  User,
  Store,
  ShoppingBag,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SwipeableGallery } from '../../components/common/SwipeableGallery';

interface MediaItem {
  id: string;
  type: 'profile_photo' | 'product_image' | 'service_portfolio' | 'shop_cover' | 'verification_doc';
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  title: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const initialMediaQueue: MediaItem[] = [];

export const AdminMediaModerationPage: React.FC = () => {
  const [queue, setQueue] = useState<MediaItem[]>(initialMediaQueue);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleApprove = (id: string) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'approved', reviewedAt: new Date().toISOString() } : item));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleReject = (id: string, reason: string = 'Inappropriate or non-compliant media') => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString() } : item));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this media permanently from the database and storage?')) {
      setQueue(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const filtered = queue.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const getTypeIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'profile_photo': return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'product_image': return <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />;
      case 'service_portfolio': return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'shop_cover': return <Store className="w-3.5 h-3.5 text-indigo-600" />;
      default: return <ImageIcon className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#061A4F]/5 text-[#061A4F]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#061A4F]">Media Moderation</h1>
            <p className="text-xs text-slate-500 font-medium">
              Review and audit user uploads across profiles, marketplace products, freelance portfolios, and campus shops.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {queue.filter(q => q.status === 'pending').length} Pending Reviews
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="all">All Media Types</option>
            <option value="profile_photo">Profile Photos</option>
            <option value="product_image">Marketplace Products</option>
            <option value="service_portfolio">Service Portfolios</option>
            <option value="shop_cover">Campus Shop Covers</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-400">{filtered.length} media items shown</span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#061A4F]/40 transition"
          >
            {/* Image Preview */}
            <div 
              onClick={() => setSelectedItem(item)}
              className="relative aspect-square w-full bg-slate-100 cursor-pointer group"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                <Eye className="w-4 h-4" /> Click to Inspect
              </div>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${
                    item.status === 'approved'
                      ? 'bg-emerald-500 text-white'
                      : item.status === 'rejected'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1">
                  {getTypeIcon(item.type)}
                  <span className="capitalize">{item.type.replace('_', ' ')}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{item.ownerName} ({item.ownerRole})</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                {item.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 py-1 px-2 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Approve
                  </button>
                )}
                {item.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 py-1 px-2 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Details Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedItem.title}</h3>
              <p className="text-xs text-slate-500">Uploaded by: {selectedItem.ownerName} • {selectedItem.ownerRole}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleApprove(selectedItem.id)}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                Approve Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

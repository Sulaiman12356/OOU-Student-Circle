import React, { useState } from 'react';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { DataStore } from '../../services/dataStore';
import { ProductItem } from '../../types/marketplace';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  DollarSign, 
  Store, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  PauseCircle,
  ExternalLink
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(() => MarketplaceStore.getAllProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campusFilter, setCampusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [activeModalAction, setActiveModalAction] = useState<'approve' | 'reject' | 'suspend' | 'delete' | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshProducts = () => {
    setProducts(MarketplaceStore.getAllProducts());
  };

  const handleUpdateStatus = (productId: string, status: ProductItem['status']) => {
    MarketplaceStore.updateProductStatus(productId, status);
    DataStore.logAdminAction(
      `PRODUCT_STATUS_${status.toUpperCase()}`,
      'product',
      productId,
      `Changed product status to ${status.toUpperCase()}${actionReason ? ` - Reason: ${actionReason}` : ''}`
    );
    refreshProducts();
    showToast(`Product status updated to ${status}`);
    if (selectedProduct?.id === productId) {
      setSelectedProduct({ ...selectedProduct, status });
    }
    setActiveModalAction(null);
    setActionReason('');
  };

  const handleDeleteProduct = (productId: string) => {
    MarketplaceStore.deleteProduct(productId);
    DataStore.logAdminAction(
      'DELETE_PRODUCT',
      'product',
      productId,
      `Permanently removed product listing${actionReason ? ` - Reason: ${actionReason}` : ''}`
    );
    refreshProducts();
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
    setActiveModalAction(null);
    setActionReason('');
    showToast('Product listing removed successfully.');
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchCampus = campusFilter === 'all' || p.campus === campusFilter;

    return matchSearch && matchCat && matchStatus && matchCampus;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const campuses = Array.from(new Set(products.map(p => p.campus).filter(Boolean)));

  const publishedCount = products.filter(p => p.status === 'published').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const pausedCount = products.filter(p => p.status === 'paused').length;

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
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Product Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, suspend, and remove items listed on the StudentCircle campus marketplace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            Total Listings: <strong className="text-[#061A4F]">{products.length}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Live / Published</div>
            <div className="text-xl font-extrabold text-emerald-700">{publishedCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Draft / Pending</div>
            <div className="text-xl font-extrabold text-amber-600">{draftCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Paused / Suspended</div>
            <div className="text-xl font-extrabold text-rose-600">{pausedCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <PauseCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, sellers, or descriptions..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Campuses</option>
              {campuses.map(camp => (
                <option key={camp} value={camp}>{camp}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused / Suspended</option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Product Details</th>
                <th className="p-4">Seller & Campus</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-[#061A4F] truncate">{product.title}</div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{product.description}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{product.sellerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{product.campus || 'Main Campus'}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                        {product.category}
                      </span>
                    </td>

                    <td className="p-4 font-extrabold text-[#061A4F]">
                      ₦{product.price.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className="capitalize text-slate-600 font-semibold">
                        {product.condition?.replace('_', ' ') || 'Good'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                        product.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : product.status === 'paused'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {product.status === 'published' && <CheckCircle2 className="w-3 h-3" />}
                        {product.status === 'paused' && <PauseCircle className="w-3 h-3" />}
                        <span>{product.status}</span>
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Inspect / View */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve (Publish) */}
                        {product.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(product.id, 'published')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="Approve Listing"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* Suspend / Pause */}
                        {product.status === 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(product.id, 'paused')}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                            title="Suspend Listing"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Remove / Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently remove product listing "${product.title}"?`)) {
                              handleDeleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No products match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase rounded">
                  {selectedProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#061A4F] mt-1">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images Gallery */}
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedProduct.title} ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Price</div>
                <div className="font-extrabold text-[#061A4F] text-base">₦{selectedProduct.price.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Condition</div>
                <div className="font-bold text-slate-700 capitalize">{selectedProduct.condition?.replace('_', ' ') || 'Good'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Campus</div>
                <div className="font-bold text-slate-700">{selectedProduct.campus || 'Main Campus'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Status</div>
                <div className="font-bold text-slate-700 capitalize">{selectedProduct.status}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Description</h4>
              <p className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedProduct.description}
              </p>
            </div>

            {/* Seller Details */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-1">
              <div className="font-bold text-[#061A4F]">Seller Information</div>
              <div className="text-slate-700">Name: <strong>{selectedProduct.sellerName}</strong></div>
              <div className="text-slate-600">Seller ID: <span className="font-mono">{selectedProduct.sellerId}</span></div>
              <div className="text-slate-600">Meeting Point: <span>{selectedProduct.meetingLocation || 'Campus Quadrangle'}</span></div>
            </div>

            {/* Moderation Actions in Modal */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedProduct.status !== 'published' && (
                <button
                  onClick={() => handleUpdateStatus(selectedProduct.id, 'published')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Publish</span>
                </button>
              )}
              {selectedProduct.status === 'published' && (
                <button
                  onClick={() => handleUpdateStatus(selectedProduct.id, 'paused')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Suspend Listing</span>
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm(`Permanently remove product listing "${selectedProduct.title}"?`)) {
                    handleDeleteProduct(selectedProduct.id);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Listing</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

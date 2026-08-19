import React, { useState } from 'react';
import { MasterOrder, VendorOrder, ProductItem } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { ReviewModal } from './ReviewModal';
import { 
  ShoppingBag, 
  Store, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Star, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';

interface CustomerOrdersViewProps {
  onBrowseMarketplace?: () => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  onBrowseMarketplace
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest-user';

  const orders: MasterOrder[] = MarketplaceStore.getCustomerOrders(userId);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<ProductItem | null>(null);
  const [selectedOrderIdForReview, setSelectedOrderIdForReview] = useState<string>('');

  const handleOpenReview = (productId: string, orderId: string) => {
    const prod = MarketplaceStore.getProductById(productId);
    if (prod) {
      setSelectedProductForReview(prod);
      setSelectedOrderIdForReview(orderId);
      setReviewModalOpen(true);
    }
  };

  const openWhatsAppVendor = (vendorOrder: VendorOrder) => {
    const vendor = MarketplaceStore.getVendorById(vendorOrder.vendorId);
    const phone = vendor?.whatsappNumber || '08051780169';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    const msg = encodeURIComponent(`Hello ${vendorOrder.vendorStoreName}! I am checking on my StudentCircle suborder #${vendorOrder.id} for "${vendorOrder.items.map(i => i.title).join(', ')}".`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="customer-orders-view" className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Marketplace Orders</h2>
          <p className="text-xs text-slate-500">Track fulfillment status and leave verified reviews for student vendors</p>
        </div>

        {onBrowseMarketplace && (
          <button
            onClick={onBrowseMarketplace}
            className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] shadow transition self-start sm:self-center"
          >
            Browse More Products
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Explore campus listings for student-made fashion, tech gear, textbooks, snacks and study items.
          </p>
          {onBrowseMarketplace && (
            <button
              onClick={onBrowseMarketplace}
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow"
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((master) => {
            const vendorOrders = MarketplaceStore.getVendorOrdersForMaster(master.id);

            return (
              <div 
                key={master.id} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5 sm:p-6"
              >
                {/* Top Master Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">Order #{master.id}</span>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-blue-100 text-blue-900">
                        {master.overallStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(master.createdAt).toLocaleDateString()} • Ref: <span className="font-mono text-slate-700">{master.paymentReference}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Amount Paid</span>
                    <span className="text-lg font-black text-slate-900">₦{master.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Address & Status Snapshot */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Destination: <strong>{master.deliveryAddress}</strong> ({master.location})</span>
                  </div>

                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    StudentCircle Escrow Protected
                  </span>
                </div>

                {/* Vendor Sub-Orders Breakdown */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Vendor Packages in this Order ({vendorOrders.length})
                  </h4>

                  {vendorOrders.map((vo) => (
                    <div key={vo.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      
                      {/* Vendor Store Line */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-xs text-slate-900">{vo.vendorStoreName}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                            vo.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                            vo.status === 'delivered' || vo.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {vo.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsAppVendor(vo)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contact Vendor</span>
                          </button>
                        </div>
                      </div>

                      {/* Items in this suborder */}
                      <div className="space-y-2">
                        {vo.items.map((item, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-slate-900 truncate">{item.title}</h5>
                                <span className="text-[11px] text-slate-500 block">
                                  Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="font-black text-xs text-slate-900">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>

                              {/* Review CTA if delivered */}
                              {(vo.status === 'delivered' || vo.status === 'completed') && (
                                <button
                                  onClick={() => handleOpenReview(item.productId, vo.id)}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-1"
                                >
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>Review</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedProductForReview && (
        <ReviewModal
          product={selectedProductForReview}
          orderId={selectedOrderIdForReview}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            // review submitted
          }}
        />
      )}

    </div>
  );
};

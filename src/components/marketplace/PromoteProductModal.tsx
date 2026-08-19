import React, { useState } from 'react';
import { ProductItem, ProductPromotion, PromotionPackage } from '../../types/marketplace';
import { MarketplaceStore, initialPromotionPackages } from '../../services/marketplaceStore';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  CreditCard, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  Award,
  Zap
} from 'lucide-react';

interface PromoteProductModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PromoteProductModal: React.FC<PromoteProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess
}) => {
  const packages = initialPromotionPackages;
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[0]?.id || '');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedPkg = packages.find(p => p.id === selectedPackageId) || packages[0];

  const handleLaunchPromotion = () => {
    setProcessing(true);

    setTimeout(() => {
      const promo: ProductPromotion = {
        id: `promo-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        productImage: product.mainImage || product.images[0],
        vendorId: product.vendorId,
        vendorStoreName: product.vendorStoreName,
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        type: selectedPkg.type,
        durationDays: selectedPkg.durationDays,
        cost: selectedPkg.price,
        paymentStatus: 'paid',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + selectedPkg.durationDays * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };

      MarketplaceStore.createPromotion(promo);
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1800);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        id="promote-product-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-[#061A4F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-200" />
            <div>
              <h3 className="font-black text-lg">Promote Product & Boost Campus Sales</h3>
              <p className="text-xs text-amber-100">Reach 10x more student buyers across OOU faculties</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {success ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Flame className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Promotion Activated!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                "{product.title}" has been boosted to the <strong>{selectedPkg.name}</strong> tier. Your badge is live now!
              </p>
            </div>
          ) : (
            <>
              {/* Product Snapshot */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img 
                  src={product.mainImage || product.images[0]} 
                  alt={product.title} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                  <p className="text-[11px] text-slate-500">₦{product.price.toLocaleString()} • {product.category}</p>
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Choose an Advertising Package
                </label>

                <div className="space-y-2.5">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50/40 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="promo_package" 
                              checked={isSelected}
                              onChange={() => setSelectedPackageId(pkg.id)}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <span className="font-bold text-sm text-slate-900">{pkg.name}</span>
                            {pkg.isPopular && (
                              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-[#061A4F] rounded-md uppercase">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 pl-5">{pkg.description}</p>
                          <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                            {pkg.features.map((f, i) => (
                              <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                ✓ {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="sm:text-right pl-5 sm:pl-0">
                          <div className="text-lg font-black text-slate-900">
                            ₦{pkg.price.toLocaleString()}
                          </div>
                          <span className="text-[11px] text-slate-500">{pkg.durationDays} Days</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total & Action */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Total Advertising Fee</span>
                  <span className="text-xl font-black text-slate-900">₦{selectedPkg.price.toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={processing}
                    onClick={handleLaunchPromotion}
                    className="px-6 py-2.5 text-xs font-bold bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl shadow transition active:scale-95 flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 text-[#F5B400]" />
                    <span>{processing ? 'Activating...' : `Pay ₦${selectedPkg.price.toLocaleString()} & Boost`}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

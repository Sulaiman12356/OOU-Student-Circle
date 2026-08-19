import React from 'react';
import { Cart, CartItem } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Store, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  userId,
  onProceedToCheckout
}) => {
  const cart: Cart = MarketplaceStore.getCart(userId);

  if (!isOpen) return null;

  // Group cart items by vendor
  const vendorGroups: { [vendorId: string]: { vendorName: string; items: CartItem[] } } = {};
  cart.items.forEach(item => {
    if (!vendorGroups[item.vendorId]) {
      vendorGroups[item.vendorId] = {
        vendorName: item.vendorStoreName || 'Student Vendor',
        items: []
      };
    }
    vendorGroups[item.vendorId].items.push(item);
  });

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    MarketplaceStore.updateCartQuantity(userId, productId, quantity);
  };

  const handleRemove = (productId: string) => {
    MarketplaceStore.removeFromCart(userId, productId);
  };

  const handleToggleDeliveryMethod = (item: CartItem, method: 'pickup' | 'delivery') => {
    item.selectedDeliveryMethod = method;
    MarketplaceStore.saveCart(cart);
  };

  // Subtotals and Delivery calculation
  let itemsSubtotal = 0;
  let totalDelivery = 0;

  Object.values(vendorGroups).forEach(group => {
    const groupItemSum = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    itemsSubtotal += groupItemSum;

    const hasDelivery = group.items.some(item => item.selectedDeliveryMethod === 'delivery');
    if (hasDelivery) {
      const vendorMaxDelivery = Math.max(...group.items.map(item => item.deliveryFee || 0));
      totalDelivery += vendorMaxDelivery;
    }
  });

  const grandTotal = itemsSubtotal + totalDelivery;
  const totalItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div 
        id="marketplace-cart-drawer"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden transform transition-all"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#061A4F]" />
            <h3 className="text-lg font-black text-slate-900">Your Cart ({totalItemsCount})</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Discover student-made fashion, tech gear, textbooks, snacks and campus essentials in the marketplace.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] shadow transition"
              >
                Browse Campus Products
              </button>
            </div>
          ) : (
            <>
              {/* Multi-Vendor Alert */}
              {Object.keys(vendorGroups).length > 1 && (
                <div className="p-3 bg-blue-50/80 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Your order contains items from <strong>{Object.keys(vendorGroups).length} student vendors</strong>. Each vendor will fulfill their portion directly.
                  </span>
                </div>
              )}

              {/* Vendor Groups */}
              {Object.entries(vendorGroups).map(([vId, group]) => {
                const groupDeliverySelected = group.items.some(i => i.selectedDeliveryMethod === 'delivery');
                const groupDeliveryFee = groupDeliverySelected 
                  ? Math.max(...group.items.map(i => i.deliveryFee || 0)) 
                  : 0;

                return (
                  <div key={vId} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                    
                    {/* Store Title */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span>{group.vendorName}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Products in this vendor group */}
                    <div className="space-y-3">
                      {group.items.map(item => (
                        <div key={item.productId} className="flex gap-3 py-2">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h5>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-sm font-black text-slate-900">
                                  ₦{item.price.toLocaleString()}
                                </span>
                                {item.discountPrice && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    ₦{item.discountPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stepper & Delete */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                  className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxAvailable}
                                  className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemove(item.productId)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Option for this vendor */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {group.items[0]?.pickupAvailable && (
                          <button
                            type="button"
                            onClick={() => group.items.forEach(i => handleToggleDeliveryMethod(i, 'pickup'))}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              !groupDeliverySelected 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Campus Pickup (Free)
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => group.items.forEach(i => handleToggleDeliveryMethod(i, 'delivery'))}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                            groupDeliverySelected 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Delivery (+₦{group.items[0]?.deliveryFee?.toLocaleString() || '500'})
                        </button>
                      </div>

                      <span className="font-bold text-slate-800 text-xs">
                        ₦{groupDeliveryFee.toLocaleString()}
                      </span>
                    </div>

                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.items.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">₦{itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Delivery Fees:</span>
                <span className="font-bold text-slate-900">₦{totalDelivery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Buyer Protection & Escrow:</span>
                <span className="font-bold text-emerald-700">FREE (₦0)</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              id="btn-cart-checkout"
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-2xl font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>

            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Protected by StudentCircle Campus Escrow
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

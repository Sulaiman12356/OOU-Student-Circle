import React, { useState } from 'react';
import { Cart, MasterOrder, VendorOrder } from '../../types/marketplace';
import { MarketplaceStore } from '../../services/marketplaceStore';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Store,
  Clock,
  ExternalLink
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onOrderPlaced: (order: MasterOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  userId,
  onOrderPlaced
}) => {
  const { currentUser } = useAuth();
  const cart: Cart = MarketplaceStore.getCart(userId);

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneNumber || '080');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [campusLocation, setCampusLocation] = useState('Ago-Iwoye Main Campus');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.location || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cod'>('paystack');

  // Checkout process step
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [placedOrder, setPlacedOrder] = useState<MasterOrder | null>(null);
  const [placedVendorOrders, setPlacedVendorOrders] = useState<VendorOrder[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Group cart items by vendor for review
  const vendorGroups: { [vendorId: string]: typeof cart.items } = {};
  cart.items.forEach(item => {
    if (!vendorGroups[item.vendorId]) {
      vendorGroups[item.vendorId] = [];
    }
    vendorGroups[item.vendorId].push(item);
  });

  let subtotal = 0;
  let deliveryTotal = 0;

  Object.values(vendorGroups).forEach(items => {
    const sum = items.reduce((s, i) => s + (i.price * i.quantity), 0);
    subtotal += sum;
    const hasDel = items.some(i => i.selectedDeliveryMethod === 'delivery');
    if (hasDel) {
      deliveryTotal += Math.max(...items.map(i => i.deliveryFee || 0));
    }
  });

  const grandTotal = subtotal + deliveryTotal;

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage('Please fill in your contact information.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please specify your hostel room / pickup delivery address.');
      return;
    }

    setErrorMessage('');
    setStep('processing');

    // Simulate Paystack payment authorization (1.8 seconds)
    setTimeout(() => {
      try {
        const paymentRef = `PAY-OOU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const result = MarketplaceStore.createMasterOrder(
          {
            customerId: currentUser?.id || userId,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerEmail: customerEmail.trim(),
            deliveryAddress: deliveryAddress.trim(),
            location: campusLocation,
            customerNotes: customerNotes.trim() || undefined
          },
          cart.items,
          paymentRef
        );

        setPlacedOrder(result.masterOrder);
        setPlacedVendorOrders(result.vendorOrders);
        setStep('success');
        onOrderPlaced(result.masterOrder);
      } catch (err) {
        setErrorMessage('An error occurred while creating your order. Please try again.');
        setStep('form');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-lg">Secure Campus Checkout</h3>
              <p className="text-xs text-blue-200">OOU StudentCircle Escrow Protection</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {step === 'processing' ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-[#061A4F] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-xl font-bold text-slate-900">Authorizing Secure Payment...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Communicating with Paystack sandbox & splitting order to student vendor dispatch queues...
              </p>
            </div>
          ) : step === 'success' && placedOrder ? (
            <div className="py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Order Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  Order ID: <strong className="text-slate-800">{placedOrder.id}</strong> • Payment Ref: <span className="font-mono">{placedOrder.paymentReference}</span>
                </p>
              </div>

              {/* Multi-Vendor Order Breakdown Receipt */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Dispatched Student Vendor Orders ({placedVendorOrders.length})
                </h5>

                <div className="space-y-3">
                  {placedVendorOrders.map((vo) => (
                    <div key={vo.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <Store className="w-3.5 h-3.5 text-blue-600" />
                          <span>{vo.vendorStoreName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({vo.id})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {vo.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right flex items-center justify-between sm:block">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {vo.deliveryMethod === 'pickup' ? 'Ready for Pickup' : 'Dispatching'}
                        </span>
                        <div className="font-black text-xs text-slate-900 mt-1">
                          ₦{(vo.subtotal + vo.deliveryFee).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Grand Total Paid:</span>
                  <span>₦{placedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  The student vendors have been notified to prepare your items. Your funds remain safely held in StudentCircle Escrow until you confirm receipt.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-xl font-bold text-sm shadow transition"
                >
                  View My Orders & Track Delivery
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProcessOrder} className="space-y-6">
              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Delivery Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>1. Delivery & Contact Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Phone Number (WhatsApp Active) *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Primary Campus Location *
                    </label>
                    <select
                      value={campusLocation}
                      onChange={(e) => setCampusLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="Ago-Iwoye Main Campus">Ago-Iwoye Main Campus</option>
                      <option value="Ago-Iwoye Mini Campus">Ago-Iwoye Mini Campus</option>
                      <option value="Sagamu Campus (CHS)">Sagamu Campus (CHS Medical)</option>
                      <option value="Ayetoro Campus (Agric)">Ayetoro Campus (Agricultural Science)</option>
                      <option value="Ibogun Campus (Engineering)">Ibogun Campus (Engineering)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Specific Hostel / Room Number / Faculty Landmark *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Block B Room 14, Silver Hostel, Ago-Iwoye or Outside SMS Faculty"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Call when outside the gate; Deliver between 2pm - 4pm"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>2. Payment Method</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === 'paystack' 
                        ? 'border-blue-600 bg-blue-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>Paystack Instant Escrow</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">Recommended</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Debit Card, Bank Transfer, USSD. Funds held safely in campus escrow.
                      </p>
                    </div>
                  </label>

                  <label 
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === 'cod' 
                        ? 'border-blue-600 bg-blue-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        Campus Pickup / Cash on Delivery
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Inspect items before transfer or cash payment at campus spot.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Products Subtotal ({cart.items.length} items):</span>
                  <span className="font-bold text-slate-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Campus Delivery Fee:</span>
                  <span className="font-bold text-slate-900">₦{deliveryTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Student Escrow Fee:</span>
                  <span className="font-bold text-emerald-700">₦0 (Covered)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount to Pay:</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  id="btn-complete-order"
                  type="submit"
                  className="w-full py-4 bg-[#061A4F] hover:bg-[#0B2A6F] text-white rounded-2xl font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#F5B400]" />
                  <span>Pay ₦{grandTotal.toLocaleString()} & Complete Order</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Wallet
} from 'lucide-react';
import { UnifiedOrder } from '../../types/transaction';
import { PAYMENT_CONFIG, formatCurrency } from '../../config/paymentConfig';
import { TransactionEngineStore } from '../../services/transactionEngineStore';

interface SecurePaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: UnifiedOrder;
  onPaymentSuccess: (updatedOrder: UnifiedOrder) => void;
}

type PaymentChannel = 'escrow_vault' | 'paystack' | 'flutterwave' | 'bank_transfer';

export const SecurePaymentGatewayModal: React.FC<SecurePaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess
}) => {
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('escrow_vault');
  const [step, setStep] = useState<'select' | 'processing' | 'otp' | 'transfer_verify' | 'success'>('select');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('5399 4100 8821 9934');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardPin, setCardPin] = useState('');
  
  // Escrow Vault PIN
  const [escrowPin, setEscrowPin] = useState('');
  
  // Bank Transfer Reference
  const [transferRef, setTransferRef] = useState('');
  const [senderAccountName, setSenderAccountName] = useState('');
  
  // OTP Verification
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  
  const [copiedRef, setCopiedRef] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const paymentRef = `SC-ESCROW-${order.orderId}-${Date.now().toString().slice(-4)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleInitiatePayment = () => {
    setErrorMessage(null);
    setIsProcessing(true);

    if (selectedChannel === 'escrow_vault') {
      // Escrow direct authorize
      setTimeout(() => {
        setIsProcessing(false);
        setStep('otp'); // Request 2FA authentication
      }, 800);
    } else if (selectedChannel === 'paystack' || selectedChannel === 'flutterwave') {
      // Card payment
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        setIsProcessing(false);
        return;
      }
      setTimeout(() => {
        setIsProcessing(false);
        setStep('otp'); // 3D-Secure 2FA OTP prompt
      }, 1000);
    } else if (selectedChannel === 'bank_transfer') {
      setIsProcessing(false);
      setStep('transfer_verify');
    }
  };

  const handleVerifyOtpAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setOtpError('Please enter the 4-6 digit verification OTP code.');
      return;
    }

    setIsProcessing(true);
    setOtpError(null);

    setTimeout(() => {
      // Execute actual payment confirmation in store
      const result = TransactionEngineStore.confirmPayment(order.id, {
        reference: paymentRef,
        channel: selectedChannel,
        amountPaid: order.amount,
        currency: PAYMENT_CONFIG.currency,
        gatewayTransactionId: `GTX-${selectedChannel.toUpperCase()}-${Date.now()}`,
        verificationCode: otpCode
      });

      setIsProcessing(false);

      if (result.success && result.order) {
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(result.order!);
          onClose();
        }, 2200);
      } else {
        setOtpError(result.message || 'Payment verification failed.');
      }
    }, 1200);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRef.trim()) {
      setErrorMessage('Please provide your bank transfer transaction reference or session ID.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      // Execute actual payment confirmation in store
      const result = TransactionEngineStore.confirmPayment(order.id, {
        reference: transferRef.trim(),
        channel: 'bank_transfer',
        amountPaid: order.amount,
        currency: PAYMENT_CONFIG.currency,
        gatewayTransactionId: `BANK-TRF-${Date.now()}`,
        verificationCode: transferRef.trim()
      });

      setIsProcessing(false);

      if (result.success && result.order) {
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(result.order!);
          onClose();
        }, 2200);
      } else {
        setErrorMessage(result.message || 'Transfer confirmation failed.');
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#061A4F] to-[#0A267A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-[#F5B400]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400]">Step 4: Secure Escrow Checkout</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">SSL Encrypted</span>
              </div>
              <h2 className="text-xl font-bold">OOU StudentCircle Escrow Vault</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Price Banner */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Payment for Order #{order.orderId}</p>
            <p className="text-sm font-bold text-slate-800 line-clamp-1">{order.targetItemTitle}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Payable</span>
            <span className="text-xl font-extrabold text-[#061A4F]">{formatCurrency(order.amount)}</span>
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: SELECT CHANNEL & ENTER DETAILS */}
          {step === 'select' && (
            <div className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedChannel('escrow_vault')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedChannel === 'escrow_vault'
                        ? 'border-[#061A4F] bg-blue-50/70 ring-2 ring-[#061A4F]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Wallet className="w-5 h-5 text-[#061A4F]" />
                      {selectedChannel === 'escrow_vault' && <CheckCircle2 className="w-4 h-4 text-[#061A4F]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Escrow Vault</p>
                      <p className="text-[10px] text-slate-500">Student Wallet / PIN</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannel('paystack')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedChannel === 'paystack'
                        ? 'border-[#061A4F] bg-blue-50/70 ring-2 ring-[#061A4F]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      {selectedChannel === 'paystack' && <CheckCircle2 className="w-4 h-4 text-[#061A4F]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Debit Card</p>
                      <p className="text-[10px] text-slate-500">Paystack Checkout</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannel('bank_transfer')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedChannel === 'bank_transfer'
                        ? 'border-[#061A4F] bg-blue-50/70 ring-2 ring-[#061A4F]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      {selectedChannel === 'bank_transfer' && <CheckCircle2 className="w-4 h-4 text-[#061A4F]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Bank Transfer</p>
                      <p className="text-[10px] text-slate-500">Direct Campus Vault</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Sub-form based on channel */}
              {selectedChannel === 'escrow_vault' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Available Balance in Student Wallet</span>
                    <span className="text-xs font-bold text-emerald-700">₦45,000.00</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Payment will be locked in the OOU StudentCircle Escrow Vault. The provider will NOT receive payout until you approve the completed delivery.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Authorize with 4-Digit Wallet PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={escrowPin}
                      onChange={(e) => setEscrowPin(e.target.value)}
                      placeholder="• • • •"
                      className="w-full text-center tracking-widest text-lg font-bold py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>
              )}

              {selectedChannel === 'paystack' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="5399 0000 0000 0000"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">CVV Security</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedChannel === 'bank_transfer' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Bank Name:</span>
                      <span className="font-bold text-slate-800">{PAYMENT_CONFIG.escrowBankName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Account Number:</span>
                      <span className="font-bold font-mono text-[#061A4F]">{PAYMENT_CONFIG.escrowAccountNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Account Name:</span>
                      <span className="font-bold text-slate-800">{PAYMENT_CONFIG.escrowAccountName}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Make transfer of exact amount ({formatCurrency(order.amount)}) to the vault account, then proceed to input your transaction session reference on the next step.
                  </p>
                </div>
              )}

              {/* Escrow Guarantee Disclaimer */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>100% Escrow Protection:</strong> Payment remains locked in OOU StudentCircle Vault. If the service is not delivered to specification, you are fully covered under our campus refund guarantee.
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F5B400]" />
                  {isProcessing ? 'Connecting...' : `Pay ${formatCurrency(order.amount)} via Escrow`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: 2FA / OTP CONFIRMATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtpAndConfirm} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-[#061A4F]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit confirmation OTP sent to your registered phone / email or enter test code <strong className="text-slate-800">123456</strong>.
                </p>
              </div>

              {otpError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {otpError}
                </div>
              )}

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-2xl font-bold py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isProcessing ? 'Verifying...' : 'Confirm & Secure Payment in Escrow'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BANK TRANSFER VERIFICATION */}
          {step === 'transfer_verify' && (
            <form onSubmit={handleConfirmTransfer} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
                <p className="font-bold mb-1">Transfer Payment Verification</p>
                <p>Transfer <strong>{formatCurrency(order.amount)}</strong> to Wema Bank Acct: <strong>{PAYMENT_CONFIG.escrowAccountNumber}</strong>.</p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bank Transfer Reference / Session ID *
                </label>
                <input
                  type="text"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  placeholder="e.g. TRF-OOU-9941824 or Session ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sender Account Name (Optional)
                </label>
                <input
                  type="text"
                  value={senderAccountName}
                  onChange={(e) => setSenderAccountName(e.target.value)}
                  placeholder="e.g. Sulaiman Onifade"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#061A4F] text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                  {isProcessing ? 'Verifying Transfer...' : 'Confirm Transfer & Fund Escrow'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Confirmed & Secured!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                ₦{order.amount.toLocaleString()} is securely held in OOU StudentCircle Escrow. The provider has been notified to commence processing.
              </p>
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-mono font-medium">
                Ref: {paymentRef}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

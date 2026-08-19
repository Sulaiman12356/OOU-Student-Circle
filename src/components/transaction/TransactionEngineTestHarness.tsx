import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  UserCheck,
  Eye,
  FileCheck,
  Layers,
  Scale
} from 'lucide-react';
import { PartyInfo, TransactionType, UnifiedOrder, TransactionRequest, TransactionQuote, OrderDispute } from '../../types/transaction';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { formatCurrency } from '../../config/paymentConfig';
import { OrderDetailModal } from './OrderDetailModal';
import { AdminDisputeResolutionModal } from './AdminDisputeResolutionModal';
import { SecurePaymentGatewayModal } from './SecurePaymentGatewayModal';
import { VerifiedReviewModal } from './VerifiedReviewModal';
import founderImage from '../../assets/images/founder_sulaiman.jpg';

interface TransactionEngineTestHarnessProps {
  currentUser: PartyInfo;
  onRefreshOrders?: () => void;
}

export const TransactionEngineTestHarness: React.FC<TransactionEngineTestHarnessProps> = ({
  currentUser,
  onRefreshOrders
}) => {
  const [activeTab, setActiveTab] = useState<'stepper' | 'security_test' | 'arbitration'>('stepper');
  
  // Test Harness State
  const [selectedType, setSelectedType] = useState<TransactionType>('service');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdDisputeId, setCreatedDisputeId] = useState<string | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isInspectingOrder, setIsInspectingOrder] = useState<string | null>(null);
  const [isArbitratingDispute, setIsArbitratingDispute] = useState<OrderDispute | null>(null);

  // Security test state
  const [securityTestOrderId, setSecurityTestOrderId] = useState('ORD-TX-001');
  const [securityTestResult, setSecurityTestResult] = useState<{ allowed: boolean; message: string } | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  // Demo Parties for Simulation
  const simulatedBuyer: PartyInfo = {
    id: 'client-1',
    name: 'Johnson Peter (Apex Studios)',
    email: 'johnson.peter@gmail.com',
    phoneNumber: '+234 802 333 4455',
    role: 'client',
    location: 'Ago-Iwoye Main Campus'
  };

  const simulatedSeller: PartyInfo = {
    id: 'student-1',
    name: 'Onifade Sulaiman (Mr. Clarity)',
    email: 'sulaiman@ooustudentcircle.com',
    phoneNumber: '+234 812 345 6789',
    photo: founderImage,
    role: 'student',
    departmentOrCompany: 'Computer Science (400L)',
    location: 'Ago-Iwoye Main Campus'
  };

  const simulatedAdmin: PartyInfo = {
    id: 'admin-1',
    name: 'OOU StudentCircle Compliance Admin',
    role: 'admin'
  };

  // STEP 1 & 2: Initiate Request
  const runStepRequest = () => {
    addLog(`Initiating Step 1 (Discover) & Step 2 (Request) for type: ${selectedType.toUpperCase()}...`);
    const req = TransactionEngineStore.createRequest({
      buyer: simulatedBuyer,
      seller: simulatedSeller,
      type: selectedType,
      targetItemId: `sim-${Date.now()}`,
      targetItemTitle: selectedType === 'service' ? 'Full Stack Campus Web Application' :
                       selectedType === 'product' ? 'Official OOU Customized Heavyweight Hoodie' :
                       selectedType === 'campus_service' ? 'Final Year Project Color Printing & Hardcover Binding' :
                       'Freelance Digital Campaign Lead',
      targetItemCategory: 'Student Professional Work',
      title: `Automated Test Request: ${selectedType.replace('_', ' ').toUpperCase()}`,
      description: 'Comprehensive project requirements and specifications verified for end-to-end lifecycle testing.',
      budget: 15000,
      expectedDeliveryDays: 3,
      deliveryLocation: 'Ago-Iwoye Main Campus'
    });

    setCreatedRequestId(req.id);
    setActiveStep(3);
    addLog(`✅ Request created: ${req.requestId} | Status: ${req.status}`);
    if (onRefreshOrders) onRefreshOrders();
  };

  // STEP 3: Send Quote
  const runStepQuote = () => {
    if (!createdRequestId) return;
    addLog(`Executing Step 3 (Quote): Provider Onifade Sulaiman preparing quote...`);
    const quote = TransactionEngineStore.sendQuote({
      requestId: createdRequestId,
      amount: 15000,
      deliveryTime: '2 Days',
      deliveryDays: 2,
      message: 'I can deliver full specifications within 48 hours including source files and documentation.',
      scopeBreakdown: ['Architecture design', 'Core implementation', 'Final QA & deliverable submission']
    });

    if (quote) {
      setCreatedQuoteId(quote.id);
      setActiveStep(4);
      addLog(`✅ Quote dispatched: ${quote.quoteId} for ₦15,000 | Status: ${quote.status}`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // STEP 4: Accept Quote & Create Order
  const runStepAccept = () => {
    if (!createdQuoteId) return;
    addLog(`Executing Step 4 (Accept): Buyer Johnson Peter accepts quote...`);
    const order = TransactionEngineStore.acceptQuoteAndCreateOrder(createdQuoteId);

    if (order) {
      setCreatedOrderId(order.id);
      setActiveStep(5);
      addLog(`✅ Order created: ${order.orderId} | Status: ${order.status} | Payment: ${order.paymentStatus}`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // STEP 5: Confirm Real Escrow Payment
  const runStepPayment = () => {
    if (!createdOrderId) return;
    addLog(`Executing Step 5 (Pay): Securing ₦15,000 in OOU StudentCircle Escrow Vault...`);
    const res = TransactionEngineStore.confirmPayment(createdOrderId, {
      reference: `SC-TEST-PAY-${Date.now().toString().slice(-4)}`,
      channel: 'escrow_vault',
      amountPaid: 15000,
      currency: 'NGN',
      verificationCode: '123456'
    });

    if (res.success && res.order) {
      setActiveStep(6);
      addLog(`✅ Escrow payment confirmed! Reference: ${res.order.paymentDetails?.reference} | Status: ${res.order.status}`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // STEP 6: Process and Deliver
  const runStepProcessAndDeliver = () => {
    if (!createdOrderId) return;
    addLog(`Executing Step 6 (Process): Provider confirms, works, and submits deliverables...`);
    TransactionEngineStore.updateOrderStatus(createdOrderId, 'Confirmed', 'Provider confirmed order.');
    TransactionEngineStore.updateOrderStatus(createdOrderId, 'Processing', 'Work actively in production.');
    const delRes = TransactionEngineStore.deliverOrder(
      createdOrderId,
      'Project fully completed and tested. Staging link and source archive attached.',
      ['https://github.com/oou-studentcircle/project-deliverable.zip'],
      simulatedSeller
    );

    if (delRes.success) {
      setActiveStep(7);
      addLog(`✅ Deliverables submitted! Status: Delivered | Ready for customer approval.`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // STEP 7: Complete and Release Escrow
  const runStepComplete = () => {
    if (!createdOrderId) return;
    addLog(`Executing Step 7 (Complete): Buyer approves work. Escrow funds releasing to provider...`);
    const res = TransactionEngineStore.completeOrder(createdOrderId, simulatedBuyer);

    if (res.success && res.order) {
      setActiveStep(8);
      addLog(`✅ Order Completed! ₦${res.order.netSellerAmount.toLocaleString()} released to Onifade Sulaiman.`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // STEP 8: Write Verified Review
  const runStepReview = () => {
    if (!createdOrderId) return;
    addLog(`Executing Step 8 (Review): Customer writes verified review...`);
    const res = TransactionEngineStore.submitReview({
      orderId: createdOrderId,
      reviewer: simulatedBuyer,
      rating: 5,
      title: 'Flawless execution & super reliable!',
      comment: 'Sulaiman is a premier talent. Code was pristine, delivered ahead of schedule, and responsive throughout.',
      tags: ['Fast Delivery', 'Top Quality', 'Campus Verified']
    });

    if (res.success) {
      setActiveStep(9);
      addLog(`✅ Verified Review Published! Rating: 5/5 stars with Verified Transaction Badge.`);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  // Reset Stepper
  const resetTest = () => {
    setActiveStep(1);
    setCreatedRequestId(null);
    setCreatedQuoteId(null);
    setCreatedOrderId(null);
    setTestLogs([]);
    addLog('Reset test harness to Step 1.');
  };

  // Run Security Check
  const runSecurityTest = () => {
    const intruderId = 'stranger-user-999';
    const isAuth = TransactionEngineStore.isUserAuthorizedForOrder(intruderId, 'student', securityTestOrderId);
    if (!isAuth) {
      setSecurityTestResult({
        allowed: false,
        message: `🛡️ SECURITY SHIELD ACTIVE: User "${intruderId}" was DENIED access to order "${securityTestOrderId}". URL manipulation attack blocked.`
      });
    } else {
      setSecurityTestResult({
        allowed: true,
        message: `⚠️ Access allowed.`
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#061A4F] via-[#0A267A] to-[#061A4F] text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F5B400] text-[#061A4F] rounded-xl font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Unified Transaction Engine Test Harness</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white">
                Live Interactive Mode
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Module 7 Unified Architecture: Discover → Request → Quote → Accept → Pay → Process → Complete → Review
            </p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stepper')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'stepper' ? 'bg-[#F5B400] text-[#061A4F]' : 'text-white/80 hover:text-white'
            }`}
          >
            Lifecycle Stepper
          </button>
          <button
            onClick={() => setActiveTab('security_test')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'security_test' ? 'bg-[#F5B400] text-[#061A4F]' : 'text-white/80 hover:text-white'
            }`}
          >
            Security & URL Shield
          </button>
        </div>
      </div>

      {/* Tab 1: Stepper */}
      {activeTab === 'stepper' && (
        <div className="p-6 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Transaction Type:</span>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                {(['service', 'product', 'campus_service', 'job'] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    disabled={activeStep > 1}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all ${
                      selectedType === t ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetTest}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-100 rounded-lg flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Pipeline
              </button>
              {createdOrderId && (
                <button
                  onClick={() => setIsInspectingOrder(createdOrderId)}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Order Modal ({createdOrderId})
                </button>
              )}
            </div>
          </div>

          {/* Stepper Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Step 1 & 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 1 ? 'border-[#061A4F] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20' :
              activeStep > 2 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Steps 1 & 2</span>
                {activeStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Layers className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Discover & Request</h4>
              <p className="text-[11px] text-slate-500 mb-3">Buyer discovers service and sends inquiry with budget & specs.</p>
              <button
                disabled={activeStep !== 1}
                onClick={runStepRequest}
                className="w-full py-1.5 bg-[#061A4F] hover:bg-[#082269] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Create Request
              </button>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 3 ? 'border-[#061A4F] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20' :
              activeStep > 3 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 3</span>
                {activeStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Provider Quote</h4>
              <p className="text-[11px] text-slate-500 mb-3">Provider calculates fees, sets ₦15,000 quote with milestones.</p>
              <button
                disabled={activeStep !== 3}
                onClick={runStepQuote}
                className="w-full py-1.5 bg-[#061A4F] hover:bg-[#082269] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Dispatch Quote
              </button>
            </div>

            {/* Step 4 & 5 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep === 4 || activeStep === 5 ? 'border-[#061A4F] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20' :
              activeStep > 5 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Steps 4 & 5</span>
                {activeStep > 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Accept & Escrow Pay</h4>
              <p className="text-[11px] text-slate-500 mb-3">Customer accepts quote and locks ₦15,000 in Escrow Vault.</p>
              {activeStep === 4 ? (
                <button
                  onClick={runStepAccept}
                  className="w-full py-1.5 bg-[#061A4F] hover:bg-[#082269] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Play className="w-3 h-3" /> Accept Quote
                </button>
              ) : (
                <button
                  disabled={activeStep !== 5}
                  onClick={runStepPayment}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Fund Escrow
                </button>
              )}
            </div>

            {/* Step 6, 7, 8 */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStep >= 6 && activeStep <= 8 ? 'border-[#061A4F] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20' :
              activeStep >= 9 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Steps 6, 7, 8</span>
                {activeStep >= 9 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShieldCheck className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Fulfill, Release & Review</h4>
              <p className="text-[11px] text-slate-500 mb-3">Submit deliverables, buyer approves payout, publish review.</p>
              {activeStep === 6 && (
                <button
                  onClick={runStepProcessAndDeliver}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Play className="w-3 h-3" /> Submit Work
                </button>
              )}
              {activeStep === 7 && (
                <button
                  onClick={runStepComplete}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> Approve & Payout
                </button>
              )}
              {activeStep === 8 && (
                <button
                  onClick={runStepReview}
                  className="w-full py-1.5 bg-[#F5B400] hover:bg-amber-500 text-[#061A4F] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Write Review
                </button>
              )}
              {activeStep >= 9 && (
                <div className="py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                  🎉 Cycle Completed 100%
                </div>
              )}
            </div>
          </div>

          {/* Test Console Output */}
          <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
            <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2 font-sans flex items-center justify-between">
              <span>Transaction Engine Execution Logs</span>
              <span>{testLogs.length} events</span>
            </div>
            {testLogs.length === 0 ? (
              <p className="text-slate-500 italic">Click "Create Request" above to launch the 8-step simulation...</p>
            ) : (
              testLogs.map((log, i) => (
                <p key={i} className="leading-relaxed">{log}</p>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Security & URL Shield */}
      {activeTab === 'security_test' && (
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#061A4F]" />
              <h3 className="text-sm font-bold text-slate-800">URL Manipulation & Authorization Guard Test</h3>
            </div>
            <p className="text-xs text-slate-600">
              Users must ONLY see orders they are authorized to see. If an unauthorized student or bad actor tries to craft a URL like <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">/orders/ORD-TX-001</code> without being the buyer, seller, or admin, the application immediately blocks access.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <input
                type="text"
                value={securityTestOrderId}
                onChange={(e) => setSecurityTestOrderId(e.target.value)}
                placeholder="Order ID"
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <button
                onClick={runSecurityTest}
                className="px-4 py-2 bg-[#061A4F] hover:bg-[#082269] text-white rounded-xl text-xs font-bold"
              >
                Simulate Stranger Access Attack
              </button>
            </div>

            {securityTestResult && (
              <div className={`p-3 rounded-xl border text-xs font-semibold ${
                !securityTestResult.allowed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {securityTestResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inspector Modal */}
      {isInspectingOrder && (
        <OrderDetailModal
          isOpen={!!isInspectingOrder}
          onClose={() => setIsInspectingOrder(null)}
          orderId={isInspectingOrder}
          currentUser={currentUser}
          onOrderUpdated={() => {
            if (onRefreshOrders) onRefreshOrders();
          }}
        />
      )}
    </div>
  );
};

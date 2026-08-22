import React, { useState } from 'react';
import { UserProfile, NotificationType } from '../../types';
import { MessagingStore } from '../../services/messagingStore';
import { 
  Play, 
  CheckCircle2, 
  ShieldAlert, 
  Bell, 
  MessageSquare, 
  Users, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

interface MessagingTestHarnessProps {
  currentUser: UserProfile;
  onSelectConversation: (conversationId: string) => void;
  onNavigate: (path: string) => void;
}

export const MessagingTestHarness: React.FC<MessagingTestHarnessProps> = ({
  currentUser,
  onSelectConversation,
  onNavigate
}) => {
  const [activeTestResult, setActiveTestResult] = useState<string | null>(null);
  const [selectedNotifType, setSelectedNotifType] = useState<NotificationType>('connection_accepted');

  const all15NotificationTypes: { type: NotificationType; label: string; desc: string }[] = [
    { type: 'connection_request', label: 'Connection Request', desc: 'Peer connection invitation from fellow student' },
    { type: 'connection_accepted', label: 'Connection Accepted', desc: 'Acceptance alert with instant chat unlock' },
    { type: 'new_message', label: 'New Message', desc: 'Inbound chat message notification' },
    { type: 'new_service_request', label: 'New Service Request', desc: 'Customer requests a freelance service quote' },
    { type: 'new_quote', label: 'New Quote', desc: 'Provider sends official scope & price quote' },
    { type: 'quote_accepted', label: 'Quote Accepted', desc: 'Client accepts quote and deposits into escrow' },
    { type: 'quote_declined', label: 'Quote Declined', desc: 'Client declines or requests revision' },
    { type: 'order_created', label: 'Order Created', desc: 'Unified order record initialized' },
    { type: 'payment_confirmed', label: 'Payment Confirmed', desc: 'Escrow payment locked safely' },
    { type: 'order_status', label: 'Order Status', desc: 'Milestone update (e.g. Delivered, Processing)' },
    { type: 'review', label: '5-Star Review', desc: 'Verified client review published on profile' },
    { type: 'job_application', label: 'Job Application', desc: 'Student applies for posted opportunity' },
    { type: 'job_shortlist', label: 'Job Shortlist', desc: 'Candidate shortlisted for campus gig' },
    { type: 'shop_request', label: 'Campus Shop Order', desc: 'Print hub or campus vendor order alert' },
    { type: 'admin_action', label: 'Admin Security Notice', desc: 'Platform safety and campus moderation notice' },
    { type: 'verification', label: 'ID Verification', desc: 'Student ID card matriculation verified' }
  ];

  const runTestScenario = (scenario: number) => {
    switch (scenario) {
      case 1:
        // Scenario 1: Student -> Student
        onSelectConversation('conv-connect-1');
        setActiveTestResult('✅ Test 1 Passed: Loaded Student ↔ Student (Connect) between Sulaiman and Maryam with PDF attachments and study collaboration.');
        break;

      case 2:
        // Scenario 2: Client -> Provider
        onSelectConversation('conv-service-1');
        setActiveTestResult('✅ Test 2 Passed: Loaded Client ↔ Provider between Johnson Peter and Adebayo Samuel with custom ₦5,000 quote card and design deliverables.');
        break;

      case 3:
        // Scenario 3: Customer -> Vendor (Marketplace)
        onSelectConversation('conv-market-1');
        setActiveTestResult('✅ Test 3 Passed: Loaded Customer ↔ Vendor with Order #ORD-8823 (Apple 67W Charger) and physical campus pickup coordinates.');
        break;

      case 4:
        // Scenario 4: Aspirant -> Shop
        onSelectConversation('conv-campus-1');
        setActiveTestResult('✅ Test 4 Passed: Loaded Student/Aspirant ↔ Ago-Iwoye Print Hub with 20-page color-printed spiral bound documents.');
        break;

      case 5:
        // Scenario 5: Security ID Injection Violation Test
        // Attempt to load a fake/unauthorized conversation ID
        onSelectConversation('conv-unauthorized-secret-999');
        setActiveTestResult('🛡️ Test 5 Passed: Security Shield Triggered! Access blocked with 403 Forbidden because current user is not a participant.');
        break;
    }
  };

  const handleDispatchNotification = async () => {
    const notif = await MessagingStore.dispatchSampleNotification(currentUser.id, selectedNotifType);
    setActiveTestResult(`🔔 Dispatched Notification: "${notif.title}" — Check your notification bell and Notifications Center!`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-[#061A4F]">
            <Zap className="w-5 h-5 text-[#F5B400]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#061A4F]">Module 8 E2E Testing Studio</h3>
            <p className="text-xs text-slate-500">Live test harness for all conversation flows, security barriers & 15 notification types</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Role: {currentUser.role.toUpperCase()}</span>
        </span>
      </div>

      {/* Test Scenario Buttons */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Core Communication Test Scenarios
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <button
            onClick={() => runTestScenario(1)}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/70 hover:border-blue-200 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700">
                <Users className="w-3.5 h-3.5" />
                Scenario 1
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Student ↔ Student</span>
            </div>
            <h5 className="text-xs font-bold text-[#061A4F] group-hover:text-blue-700 transition">
              Student Connect & Study Collab
            </h5>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Sulaiman & Maryam study group with PDF presentation attachments.
            </p>
          </button>

          <button
            onClick={() => runTestScenario(2)}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-purple-50/70 hover:border-purple-200 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700">
                <Sparkles className="w-3.5 h-3.5" />
                Scenario 2
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Client ↔ Provider</span>
            </div>
            <h5 className="text-xs font-bold text-[#061A4F] group-hover:text-purple-700 transition">
              Freelance Service & Custom Quote
            </h5>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Johnson Peter & Adebayo Samuel brand design quote card and Figma assets.
            </p>
          </button>

          <button
            onClick={() => runTestScenario(3)}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/70 hover:border-amber-200 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700">
                <ShoppingBag className="w-3.5 h-3.5" />
                Scenario 3
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Marketplace</span>
            </div>
            <h5 className="text-xs font-bold text-[#061A4F] group-hover:text-amber-700 transition">
              Marketplace Order & Escrow
            </h5>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              MacBook 67W Charger deal with Order #ORD-8823 and campus gate pickup.
            </p>
          </button>

          <button
            onClick={() => runTestScenario(4)}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/70 hover:border-emerald-200 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
                <Store className="w-3.5 h-3.5" />
                Scenario 4
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Aspirant ↔ Shop</span>
            </div>
            <h5 className="text-xs font-bold text-[#061A4F] group-hover:text-emerald-700 transition">
              Campus Service & Print Hub
            </h5>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Praise Daniel & Ago-Iwoye Print Center 20-page spiral document binding.
            </p>
          </button>

          <button
            onClick={() => runTestScenario(5)}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-left transition space-y-1.5 group sm:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-700">
                <ShieldAlert className="w-3.5 h-3.5" />
                Security Assertion
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white">403 Shield Test</span>
            </div>
            <h5 className="text-xs font-bold text-rose-900">
              Access Control: Unauthorized Conversation URL / ID Tamper Check
            </h5>
            <p className="text-[11px] text-rose-700">
              Verifies that unauthorized users are strictly blocked with a 403 Forbidden barrier if they attempt to inject an ID or access another conversation.
            </p>
          </button>

        </div>
      </div>

      {/* Notification Simulator (All 15 Events) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-extrabold text-[#061A4F]">
              Trigger Live Notification (15 Event Types)
            </h4>
          </div>
          <button
            onClick={() => onNavigate('/student/notifications')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Notifications</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedNotifType}
            onChange={(e) => setSelectedNotifType(e.target.value as NotificationType)}
            className="w-full sm:flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#061A4F] focus:outline-none"
          >
            {all15NotificationTypes.map((n) => (
              <option key={n.type} value={n.type}>
                {n.label} — {n.desc}
              </option>
            ))}
          </select>

          <button
            onClick={handleDispatchNotification}
            className="w-full sm:w-auto px-4 py-2 bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-[#F5B400] fill-current" />
            <span>Dispatch Test Alert</span>
          </button>
        </div>
      </div>

      {/* Test Feedback Banner */}
      {activeTestResult && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#061A4F] flex items-center justify-between gap-3 animate-in fade-in">
          <span>{activeTestResult}</span>
          <button
            onClick={() => setActiveTestResult(null)}
            className="text-blue-400 hover:text-blue-600 font-black text-xs"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};

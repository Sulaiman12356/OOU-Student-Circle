import React, { useState, useEffect } from 'react';
import { AppNotification, NotificationType, UserProfile } from '../../types';
import { MessagingStore } from '../../services/messagingStore';
import { 
  Bell, 
  CheckCheck, 
  Briefcase, 
  MessageSquare, 
  ShieldCheck, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Filter, 
  Search, 
  CheckCircle2, 
  UserPlus, 
  Star, 
  Store, 
  AlertTriangle,
  Play,
  Plus
} from 'lucide-react';

interface NotificationCenterProps {
  currentUser: UserProfile;
  onNavigate: (path: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentUser,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testType, setTestType] = useState<NotificationType>('connection_accepted');

  useEffect(() => {
    // Initial fetch
    setNotifications(MessagingStore.getNotifications(currentUser.id));

    // Realtime subscription
    const unsubscribe = MessagingStore.subscribeNotifications((allNotifs) => {
      setNotifications(allNotifs.filter(n => n.userId === currentUser.id));
    });

    return () => unsubscribe();
  }, [currentUser.id]);

  const handleMarkAllRead = () => {
    MessagingStore.markAllNotificationsAsRead(currentUser.id);
  };

  const handleMarkSingleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    MessagingStore.markNotificationAsRead(id, currentUser.id);
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    MessagingStore.deleteNotification(id, currentUser.id);
  };

  const handleDispatchTest = () => {
    MessagingStore.dispatchSampleNotification(currentUser.id, testType);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    // 1. Category Tab Filter
    if (activeCategory === 'unread' && n.read) return false;
    if (activeCategory === 'orders' && n.category !== 'orders_escrow') return false;
    if (activeCategory === 'messages' && n.category !== 'messages') return false;
    if (activeCategory === 'jobs' && n.category !== 'jobs_proposals') return false;
    if (activeCategory === 'social' && n.category !== 'social_campus') return false;
    if (activeCategory === 'system' && n.category !== 'system_security') return false;

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.actorName && n.actorName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order_created':
      case 'order_status':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'payment_confirmed':
      case 'escrow_release':
      case 'quote_accepted':
        return <DollarSign className="w-4 h-4 text-[#F5B400]" />;
      case 'new_message':
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'new_service_request':
      case 'new_quote':
      case 'job_application':
      case 'job_shortlist':
      case 'proposal':
      case 'proposal_received':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'review':
      case 'review_received':
        return <Star className="w-4 h-4 text-[#F5B400] fill-current" />;
      case 'shop_request':
        return <Store className="w-4 h-4 text-emerald-600" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'admin_action':
      default:
        return <ShieldCheck className="w-4 h-4 text-[#061A4F]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Notifications & Activity Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding student connections, escrow payments, freelance quotes, and marketplace orders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" />
              <span>Mark all as read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Quick Action Strip */}
      <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-amber-50/50 p-4 rounded-3xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-[#061A4F]">Simulate Live Platform Event:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value as NotificationType)}
            className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="connection_accepted">Connection Accepted 🤝</option>
            <option value="payment_confirmed">Payment Confirmed in Escrow 🔒</option>
            <option value="new_quote">New Service Quote 💼</option>
            <option value="order_created">New Order Created 📦</option>
            <option value="review">5-Star Verified Review ⭐</option>
            <option value="job_shortlist">Shortlisted for Opportunity 🌟</option>
            <option value="shop_request">Campus Shop Print Order 🖨️</option>
            <option value="verification">Student ID Verified ✅</option>
          </select>

          <button
            onClick={handleDispatchTest}
            className="px-3 py-1.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
          >
            <Play className="w-3 h-3 text-[#F5B400] fill-current" />
            <span>Test Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'all' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveCategory('unread')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'unread' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveCategory('orders')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'orders' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Orders & Escrow
          </button>
          <button
            onClick={() => setActiveCategory('messages')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'messages' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveCategory('jobs')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'jobs' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Jobs & Quotes
          </button>
          <button
            onClick={() => setActiveCategory('social')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'social' ? 'bg-[#061A4F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Social & Connect
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
          />
        </div>

      </div>

      {/* Notification Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                MessagingStore.markNotificationAsRead(notif.id, currentUser.id);
                if (notif.link) onNavigate(notif.link);
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 transition cursor-pointer group ${
                notif.read ? 'hover:bg-slate-50/70' : 'bg-blue-50/40 hover:bg-blue-50/70'
              }`}
            >
              
              {/* Icon / Actor Photo */}
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5 relative">
                {notif.actorPhoto ? (
                  <img src={notif.actorPhoto} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  getNotificationIcon(notif.type)
                )}
                {!notif.read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs sm:text-sm ${notif.read ? 'font-bold text-slate-800' : 'font-black text-[#061A4F]'}`}>
                    {notif.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pt-1">
                  {notif.link ? (
                    <div className="text-[11px] font-bold text-[#061A4F] flex items-center gap-1 group-hover:text-blue-700">
                      <span>Take Action</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ) : <div />}

                  {/* Quick actions (mark read / delete) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {!notif.read && (
                      <button
                        onClick={(e) => handleMarkSingleRead(notif.id, e)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteNotification(notif.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-700">No notifications found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery ? 'No alerts match your search filters.' : 'When clients hire your services, accept quotes, or send messages, alerts will appear here.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

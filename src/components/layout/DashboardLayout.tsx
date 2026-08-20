import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../brand/OouLogo';
import { DataStore } from '../../services/dataStore';
import { MessagingStore } from '../../services/messagingStore';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  Send,
  MessageSquare,
  Bell,
  Star,
  Wallet,
  Settings,
  Users,
  ShieldCheck,
  FolderKanban,
  Tags,
  DollarSign,
  AlertTriangle,
  FileText,
  Sliders,
  Menu,
  X,
  LogOut,
  ChevronRight,
  PlusCircle,
  Search,
  ExternalLink,
  Shield,
  Store,
  ShoppingBag,
  MapPin
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  onNavigate
}) => {
  const { currentUser, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Reactive unread notifications & messages
  const [unreadNotifs, setUnreadNotifs] = useState<number>(() => 
    currentUser ? MessagingStore.getNotifications(currentUser.id).filter(n => !n.read).length : 0
  );
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(() => {
    if (!currentUser) return 0;
    const convs = MessagingStore.getConversationsForUser(currentUser.id);
    return convs.reduce((sum, c) => sum + (c.unreadCounts?.[currentUser.id] || 0), 0);
  });

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = MessagingStore.subscribeUnreadBadges(currentUser.id, ({ messages, notifications }) => {
      setUnreadMessagesCount(messages);
      setUnreadNotifs(notifications);
    });
    return () => unsubscribe();
  }, [currentUser?.id]);

  // Student Links
  const studentNavItems: NavItem[] = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Unified Orders & Escrow', path: '/student/orders', icon: ShoppingBag, highlight: true },
    { label: 'Jobs & Opportunities', path: '/student/jobs', icon: Briefcase },
    { label: 'Campus Services Hub', path: '/campus', icon: MapPin },
    { label: 'Campus Marketplace', path: '/marketplace', icon: Store },
    { label: 'Vendor Hub & Store', path: '/vendor/dashboard', icon: Store },
    { label: 'Campus Shop Dashboard', path: '/campus/shop/dashboard', icon: Store },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'My Services', path: '/student/services', icon: Sparkles },
    { label: 'My Proposals', path: '/student/proposals', icon: Send },
    { label: 'Messages', path: '/student/messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Reviews', path: '/student/reviews', icon: Star },
    { label: 'Earnings & Wallet', path: '/student/earnings', icon: Wallet },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  // Client Links
  const clientNavItems: NavItem[] = [
    { label: 'Overview', path: '/client/dashboard', icon: LayoutDashboard },
    { label: 'Orders & Transactions', path: '/client/orders', icon: ShoppingBag, highlight: true },
    { label: 'My Opportunities & Jobs', path: '/client/jobs', icon: Briefcase },
    { label: 'Post an Opportunity', path: '/client/jobs/new', icon: PlusCircle },
    { label: 'Campus Services Hub', path: '/campus', icon: MapPin },
    { label: 'Campus Marketplace', path: '/marketplace', icon: Store },
    { label: 'Discover Students', path: '/client/discover', icon: Search },
    { label: 'Browse Services', path: '/client/services', icon: Sparkles },
    { label: 'Proposals Received', path: '/client/proposals', icon: Send },
    { label: 'Messages', path: '/client/messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Notifications', path: '/client/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Client Reviews', path: '/client/reviews', icon: Star },
    { label: 'Settings', path: '/client/settings', icon: Settings },
  ];

  // Admin Links
  const adminNavItems: NavItem[] = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Opportunities Moderation', path: '/admin/jobs', icon: FolderKanban, highlight: true },
    { label: 'Campus Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Media Moderation', path: '/admin/media', icon: ShieldCheck },
    { label: 'Campus Services Hub', path: '/campus', icon: MapPin },
    { label: 'Marketplace Management', path: '/admin/marketplace', icon: Store },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Student Verification', path: '/admin/verification', icon: ShieldCheck },
    { label: 'Reports & Disputes', path: '/admin/reports', icon: AlertTriangle },
    { label: 'Trust & Safety Lab', path: '/admin/trust-test', icon: Shield },
    { label: 'Service Moderation', path: '/admin/services', icon: Sparkles },
    { label: 'Activity Logs', path: '/admin/activity', icon: FileText },
    { label: 'Platform Settings', path: '/admin/settings', icon: Sliders },
  ];

  const getNavItems = () => {
    if (currentUser?.role === 'admin') return adminNavItems;
    if (currentUser?.role === 'client') return clientNavItems;
    return studentNavItems;
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    if (currentUser?.role === 'admin') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-900 border border-purple-200">
          Admin Portal
        </span>
      );
    }
    if (currentUser?.role === 'client') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
          Client Account
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Student ({currentUser?.level || 'Undergraduate'})
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col md:flex-row text-slate-800">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#061A4F] text-white border-r border-[#0B2A6F] flex-shrink-0">
        
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-[#0B2A6F] flex items-center justify-between">
          <div onClick={() => onNavigate('/')} className="cursor-pointer">
            <OouLogo variant="dark" size="sm" showTagline={false} />
          </div>
          <button 
            onClick={() => onNavigate('/')}
            title="View Public Website"
            className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Snapshot */}
        <div className="p-4 border-b border-[#0B2A6F] bg-[#0B2A6F]/40 flex items-center gap-3">
          <img 
            src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
            alt={currentUser?.fullName || 'User'} 
            className="w-10 h-10 rounded-full object-cover border-2 border-[#F5B400]"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm text-white truncate">
              {currentUser?.fullName || 'Guest User'}
            </div>
            <div className="text-[11px] text-slate-300 truncate">
              {currentUser?.department || currentUser?.businessName || currentUser?.role}
            </div>
            <div className="mt-1">
              {getRoleBadge()}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#F5B400] text-[#061A4F] font-bold shadow-md'
                    : item.highlight
                    ? 'bg-[#0B2A6F] text-[#F5B400] hover:bg-[#0B2A6F]/80 border border-[#F5B400]/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#061A4F]' : item.highlight ? 'text-[#F5B400]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive ? 'bg-[#061A4F] text-white' : 'bg-[#F5B400] text-[#061A4F]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action & Logout footer */}
        <div className="p-3 border-t border-[#0B2A6F] space-y-2">
          {currentUser?.role === 'student' && (
            <button
              onClick={() => onNavigate('/student/services/new')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F5B400] text-[#061A4F] hover:bg-[#e0a400] text-xs font-bold rounded-lg shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Service</span>
            </button>
          )}

          {currentUser?.role === 'client' && (
            <button
              onClick={() => onNavigate('/client/jobs/new')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F5B400] text-[#061A4F] hover:bg-[#e0a400] text-xs font-bold rounded-lg shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-300 hover:text-rose-400 transition hover:bg-white/5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#061A4F] text-white px-4 py-3 flex items-center justify-between border-b border-[#0B2A6F] sticky top-0 z-30">
        <div onClick={() => onNavigate('/')} className="cursor-pointer">
          <OouLogo variant="dark" size="sm" showTagline={false} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin/notifications' : currentUser?.role === 'client' ? '/client/notifications' : '/student/notifications')}
            className="p-1.5 text-slate-300 hover:text-white relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#F5B400] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 flex flex-col justify-end">
          <div className="bg-[#061A4F] text-white w-full max-h-[85vh] rounded-t-2xl p-5 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B2A6F]">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#F5B400]" 
                />
                <div>
                  <div className="font-bold text-sm">{currentUser?.fullName}</div>
                  <div className="text-xs text-slate-300">{currentUser?.department || currentUser?.role}</div>
                </div>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                      isActive ? 'bg-[#F5B400] text-[#061A4F]' : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-[#F5B400] text-[#061A4F] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#0B2A6F] flex items-center justify-between">
              <button
                onClick={() => {
                  onNavigate('/');
                  setMobileSidebarOpen(false);
                }}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Landing Page</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileSidebarOpen(false);
                  onNavigate('/');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between h-16 bg-white border-b border-slate-200 px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#061A4F] capitalize">
              {currentPath.split('/')[2] ? currentPath.split('/')[2].replace('-', ' ') : 'Dashboard'}
            </h1>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-medium">
              OOU StudentCircle Marketplace
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications link */}
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin/notifications' : currentUser?.role === 'client' ? '/client/notifications' : '/student/notifications')}
              className="p-2 text-slate-500 hover:text-[#061A4F] hover:bg-slate-100 rounded-lg relative transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Messages link */}
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'client' ? '/client/messages' : '/student/messages')}
              className="p-2 text-slate-500 hover:text-[#061A4F] hover:bg-slate-100 rounded-lg relative transition"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F5B400] rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* User pill */}
            <div 
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin/settings' : currentUser?.role === 'client' ? '/client/profile' : '/student/profile')}
              className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-80 transition"
            >
              <img 
                src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-slate-200" 
              />
              <div className="text-left leading-none hidden lg:block">
                <div className="text-xs font-bold text-slate-800">{currentUser?.fullName}</div>
                <div className="text-[10px] text-slate-400 capitalize mt-0.5">{currentUser?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

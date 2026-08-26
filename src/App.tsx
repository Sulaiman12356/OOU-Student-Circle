import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ExploreServicesPage } from './pages/public/ExploreServicesPage';
import { StudentTalentPage } from './pages/public/StudentTalentPage';
import { FaqPage } from './pages/public/FaqPage';
import { ContactPage } from './pages/public/ContactPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { SafetyCenterPage } from './pages/public/SafetyCenterPage';
import { TrustAndSafetyTestPage } from './pages/trust/TrustAndSafetyTestPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentServicesPage } from './pages/student/StudentServicesPage';
import { StudentJobsBrowsePage } from './pages/student/StudentJobsBrowsePage';
import { StudentProposalsPage } from './pages/student/StudentProposalsPage';
import { StudentEarningsPage } from './pages/student/StudentEarningsPage';
import { StudentReviewsPage } from './pages/student/StudentReviewsPage';

// Client Pages
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { ClientPostJobPage } from './pages/client/ClientPostJobPage';
import { ClientJobsPage } from './pages/client/ClientJobsPage';
import { ClientProposalsReceivedPage } from './pages/client/ClientProposalsReceivedPage';
import { ClientReviewsPage } from './pages/client/ClientReviewsPage';
import { ClientProfilePage } from './pages/client/ClientProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVerificationQueuePage } from './pages/admin/AdminVerificationQueuePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminCampusLocationsPage } from './pages/admin/AdminCampusLocationsPage';
import { AdminMediaModerationPage } from './pages/admin/AdminMediaModerationPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminManagementPage } from './pages/admin/AdminManagementPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminShopsPage } from './pages/admin/AdminShopsPage';
import { AdminSecurityTestPage } from './pages/admin/AdminSecurityTestPage';
import { AdminSuperAdminPage } from './pages/admin/AdminSuperAdminPage';

// Shared Pages
import { MessagesPage } from './pages/common/MessagesPage';
import { NotificationsPage } from './pages/common/NotificationsPage';
import { SettingsPage } from './pages/common/SettingsPage';
import { TransactionsHubPage } from './pages/common/TransactionsHubPage';

// Marketplace Pages
import { MarketplacePage } from './components/marketplace/MarketplacePage';
import { VendorDashboard } from './components/marketplace/VendorDashboard';
import { CustomerOrdersView } from './components/marketplace/CustomerOrdersView';
import { AdminMarketplacePanel } from './components/admin/AdminMarketplacePanel';

// Campus Hub Pages
import { CampusHubPage } from './pages/campus/CampusHubPage';
import { CampusLocationZonesPage } from './pages/campus/CampusLocationZonesPage';
import { RegisterShopPage } from './pages/campus/RegisterShopPage';
import { ShopDashboardPage } from './pages/campus/ShopDashboardPage';
import { AspirantRegisterPage } from './pages/auth/AspirantRegisterPage';
import { AspirantDashboardPage } from './pages/aspirant/AspirantDashboardPage';
import { ProviderDashboardPage } from './pages/provider/ProviderDashboardPage';

// Student Connect Pages
import { StudentConnectPage } from './pages/connect/StudentConnectPage';

// Opportunities & Jobs
import { OpportunitiesBrowse } from './components/opportunities/OpportunitiesBrowse';

import { ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, role, updateUser } = useAuth();
  const { isAdminAuthenticated, adminProfile, isSuperAdmin } = useAdminAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleOpenDirectChat = (recipientId: string, recipientName: string) => {
    if (currentUser?.role === 'client') {
      setCurrentPath('/client/messages');
    } else {
      setCurrentPath('/student/messages');
    }
  };

  // Determine view rendering
  const renderRoute = () => {
    // 1. Auth routes (No navbar/footer chrome)
    if (currentPath === '/auth' || currentPath === '/login' || currentPath === '/auth/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/register' || currentPath === '/auth/register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (currentPath === '/auth/register-aspirant') {
      return <AspirantRegisterPage onNavigate={navigate} />;
    }

    // 2. Student Workspace routes (Wrapped in DashboardLayout)
    if (currentPath.startsWith('/student/')) {
      let content = <StudentDashboardPage onNavigate={navigate} />;
      if (currentPath === '/student/profile') {
        content = <StudentProfilePage />;
      } else if (currentPath === '/student/services') {
        content = <StudentServicesPage />;
      } else if (currentPath === '/student/services/new') {
        content = <StudentServicesPage initialCreateOpen={true} />;
      } else if (currentPath === '/student/jobs') {
        content = <StudentJobsBrowsePage onNavigate={navigate} onNavigateMessage={handleOpenDirectChat} />;
      } else if (currentPath === '/student/proposals') {
        content = <StudentProposalsPage onNavigate={navigate} />;
      } else if (currentPath === '/student/orders' || currentPath === '/student/transactions') {
        content = <TransactionsHubPage onNavigate={navigate} onOpenDirectChat={handleOpenDirectChat} />;
      } else if (currentPath === '/student/earnings') {
        content = <StudentEarningsPage />;
      } else if (currentPath === '/student/reviews') {
        content = <StudentReviewsPage />;
      } else if (currentPath === '/student/messages') {
        content = <MessagesPage onNavigate={navigate} />;
      } else if (currentPath === '/student/notifications') {
        content = <NotificationsPage currentUser={currentUser!} onNavigate={navigate} />;
      } else if (currentPath === '/student/settings') {
        content = <SettingsPage currentUser={currentUser!} onUpdateUser={updateUser} />;
      }

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
          {content}
        </DashboardLayout>
      );
    }

    // 3. Client Workspace routes (Wrapped in DashboardLayout)
    if (currentPath.startsWith('/client/')) {
      let content = <ClientDashboardPage onNavigate={navigate} />;
      if (currentPath === '/client/jobs/new') {
        content = <ClientPostJobPage onNavigate={navigate} />;
      } else if (currentPath === '/client/jobs') {
        content = <ClientJobsPage onNavigate={navigate} onNavigateMessage={handleOpenDirectChat} />;
      } else if (currentPath === '/client/proposals') {
        content = <ClientProposalsReceivedPage onNavigate={navigate} />;
      } else if (currentPath === '/client/orders' || currentPath === '/client/transactions') {
        content = <TransactionsHubPage onNavigate={navigate} onOpenDirectChat={handleOpenDirectChat} />;
      } else if (currentPath === '/client/discover') {
        content = <StudentTalentPage onNavigate={navigate} />;
      } else if (currentPath === '/client/services') {
        content = <ExploreServicesPage onNavigate={navigate} />;
      } else if (currentPath === '/client/messages') {
        content = <MessagesPage onNavigate={navigate} />;
      } else if (currentPath === '/client/notifications') {
        content = <NotificationsPage currentUser={currentUser!} onNavigate={navigate} />;
      } else if (currentPath === '/client/reviews') {
        content = <ClientReviewsPage currentUser={currentUser!} onNavigate={navigate} />;
      } else if (currentPath === '/client/profile') {
        content = <ClientProfilePage currentUser={currentUser!} onNavigate={navigate} />;
      } else if (currentPath === '/client/settings') {
        content = <SettingsPage currentUser={currentUser!} onUpdateUser={updateUser} />;
      }

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
          {content}
        </DashboardLayout>
      );
    }

    // 4. Admin Workspace routes
    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      const isAuthorized = isAdminAuthenticated || currentUser?.role === 'admin';
      
      if (!isAuthorized) {
        return (
          <div className="min-h-screen bg-[#040E29] text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#061A4F] p-8 rounded-3xl border border-rose-500/40 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/40 text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Admin Access Denied</h2>
                <p className="text-xs text-slate-300">
                  The requested administrative workspace requires verified administrator credentials.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full py-3 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black rounded-xl transition text-xs shadow-lg cursor-pointer"
                >
                  Sign In as Administrator
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl transition text-xs border border-white/10 cursor-pointer"
                >
                  Return to Student Marketplace
                </button>
              </div>
            </div>
          </div>
        );
      }

      let content = <AdminDashboardPage onNavigate={navigate} />;
      if (currentPath === '/admin/superadmin' || currentPath.startsWith('/admin/superadmin/')) {
        if (!isSuperAdmin) {
          content = (
            <div className="p-8 max-w-lg mx-auto text-center space-y-4 bg-white rounded-3xl border border-rose-200 shadow-sm mt-8">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-black text-[#061A4F]">Access denied. SuperAdmin permission required.</h2>
                <p className="text-xs text-slate-500">
                  This governance section is exclusively accessible to the platform Super Administrator.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-5 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Return to Admin Dashboard
              </button>
            </div>
          );
        } else {
          let initialTab: 'admins' | 'permissions' | 'security' | 'governance' = 'admins';
          if (currentPath === '/admin/superadmin/permissions') initialTab = 'permissions';
          else if (currentPath === '/admin/superadmin/security') initialTab = 'security';
          content = <AdminSuperAdminPage onNavigate={navigate} initialTab={initialTab} />;
        }
      } else if (currentPath === '/admin/analytics') {
        content = <AdminAnalyticsPage />;
      } else if (currentPath === '/admin/settings/administrators' || currentPath === '/admin/administrators') {
        content = <AdminManagementPage onNavigate={navigate} />;
      } else if (currentPath === '/admin/security-test' || currentPath === '/admin/security') {
        content = <AdminSecurityTestPage />;
      } else if (currentPath === '/admin/products') {
        content = <AdminProductsPage />;
      } else if (currentPath === '/admin/shops') {
        content = <AdminShopsPage />;
      } else if (currentPath === '/admin/disputes') {
        content = <AdminDisputesPage />;
      } else if (currentPath === '/admin/locations') {
        content = <AdminCampusLocationsPage />;
      } else if (currentPath === '/admin/media') {
        content = <AdminMediaModerationPage />;
      } else if (currentPath === '/admin/verification') {
        content = <AdminVerificationQueuePage />;
      } else if (currentPath === '/admin/users') {
        content = <AdminUsersPage />;
      } else if (currentPath === '/admin/services') {
        content = <AdminServicesPage onNavigate={navigate} />;
      } else if (currentPath === '/admin/jobs') {
        content = <AdminJobsPage />;
      } else if (currentPath === '/admin/categories') {
        content = <AdminCategoriesPage />;
      } else if (currentPath === '/admin/transactions' || currentPath === '/admin/orders') {
        content = <AdminTransactionsPage />;
      } else if (currentPath === '/admin/reports') {
        content = <AdminReportsPage />;
      } else if (currentPath === '/admin/trust-test' || currentPath === '/admin/trust-safety' || currentPath === '/admin/test-trust-safety') {
        content = <TrustAndSafetyTestPage />;
      } else if (currentPath === '/admin/activity' || currentPath === '/admin/activity-logs') {
        content = <AdminActivityPage />;
      } else if (currentPath === '/admin/settings') {
        content = <AdminSettingsPage />;
      } else if (currentPath === '/admin/marketplace') {
        content = <AdminMarketplacePanel />;
      } else if (currentPath === '/admin/messages') {
        content = <MessagesPage />;
      } else if (currentPath === '/admin/notifications') {
        content = <NotificationsPage currentUser={currentUser!} onNavigate={navigate} />;
      }

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
          {content}
        </DashboardLayout>
      );
    }

    // Generic Settings Route
    if (currentPath === '/settings') {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <SettingsPage currentUser={currentUser} onUpdateUser={updateUser} />
          </DashboardLayout>
        );
      }
      return <LoginPage onNavigate={navigate} />;
    }

    // 5. Vendor Hub Route (Embedded in DashboardLayout if logged in or standalone)
    if (currentPath === '/vendor' || currentPath.startsWith('/vendor/')) {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <VendorDashboard onNavigate={navigate} />
          </DashboardLayout>
        );
      }
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <VendorDashboard onNavigate={navigate} />
          </main>
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // Aspirant Workspace routes
    if (currentPath === '/aspirant' || currentPath.startsWith('/aspirant/')) {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <AspirantDashboardPage onNavigate={navigate} />
          </DashboardLayout>
        );
      }
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <AspirantDashboardPage onNavigate={navigate} />
          </main>
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // Service Provider Workspace routes
    if (currentPath === '/provider' || currentPath.startsWith('/provider/')) {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <ProviderDashboardPage onNavigate={navigate} />
          </DashboardLayout>
        );
      }
      return <LoginPage onNavigate={navigate} />;
    }

    // Campus Shop Dashboard routes
    if (currentPath === '/campus/shop-dashboard' || currentPath === '/campus/shop/dashboard') {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <ShopDashboardPage onNavigate={navigate} />
          </DashboardLayout>
        );
      }
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <ShopDashboardPage onNavigate={navigate} />
          </main>
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // 6. Unified Transactions and Orders Route
    if (currentPath === '/orders' || currentPath === '/transactions') {
      if (currentUser) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
            <TransactionsHubPage onNavigate={navigate} onOpenDirectChat={handleOpenDirectChat} />
          </DashboardLayout>
        );
      }
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <TransactionsHubPage onNavigate={navigate} onOpenDirectChat={handleOpenDirectChat} />
          </main>
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // Direct Services Routes
    if (currentPath === '/services/create' || currentPath === '/services/new') {
      if (currentUser) {
        return (
          <DashboardLayout currentPath="/student/services" onNavigate={navigate}>
            <StudentServicesPage initialCreateOpen={true} />
          </DashboardLayout>
        );
      }
      return <LoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/services' || currentPath === '/explore-services') {
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1">
            <ExploreServicesPage onNavigate={navigate} />
          </main>
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // 7. Public Marketplace, Campus Hub, Locations & Landing Routes (With Header & Footer)
    let publicContent = <LandingPage onNavigate={navigate} />;
    if (currentPath === '/student-connect' || currentPath === '/connect') {
      publicContent = (
        <StudentConnectPage 
          onNavigate={navigate} 
          onOpenDirectChat={handleOpenDirectChat}
          initialTab="explore"
        />
      );
    } else if (currentPath === '/student-connect/connections') {
      publicContent = (
        <StudentConnectPage 
          onNavigate={navigate} 
          onOpenDirectChat={handleOpenDirectChat}
          initialTab="connections"
        />
      );
    } else if (currentPath === '/student-connect/requests') {
      publicContent = (
        <StudentConnectPage 
          onNavigate={navigate} 
          onOpenDirectChat={handleOpenDirectChat}
          initialTab="requests"
        />
      );
    } else if (currentPath === '/student-connect/suggestions') {
      publicContent = (
        <StudentConnectPage 
          onNavigate={navigate} 
          onOpenDirectChat={handleOpenDirectChat}
          initialTab="suggestions"
        />
      );
    } else if (currentPath === '/opportunities' || currentPath === '/jobs') {
      publicContent = (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OpportunitiesBrowse 
            onNavigate={navigate} 
            onNavigateMessage={handleOpenDirectChat} 
          />
        </div>
      );
    } else if (currentPath === '/campus') {
      publicContent = <CampusHubPage onNavigate={navigate} />;
    } else if (currentPath === '/campus/locations' || currentPath === '/campus-zones') {
      publicContent = <CampusLocationZonesPage onNavigate={navigate} />;
    } else if (currentPath === '/campus/register-shop') {
      publicContent = <RegisterShopPage onNavigate={navigate} />;
    } else if (currentPath === '/campus/shop/dashboard') {
      publicContent = <ShopDashboardPage onNavigate={navigate} />;
    } else if (currentPath === '/marketplace') {
      publicContent = (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MarketplacePage 
            onNavigate={navigate} 
            onOpenDirectChat={handleOpenDirectChat} 
          />
        </div>
      );
    } else if (currentPath === '/about') {
      publicContent = <AboutPage onNavigate={navigate} />;
    } else if (currentPath === '/how-it-works') {
      publicContent = <HowItWorksPage onNavigate={navigate} />;
    } else if (currentPath === '/explore') {
      publicContent = <ExploreServicesPage onNavigate={navigate} />;
    } else if (currentPath === '/talent') {
      publicContent = <StudentTalentPage onNavigate={navigate} />;
    } else if (currentPath === '/faq') {
      publicContent = <FaqPage onNavigate={navigate} />;
    } else if (currentPath === '/contact') {
      publicContent = <ContactPage onNavigate={navigate} />;
    } else if (currentPath === '/terms') {
      publicContent = <TermsPage onNavigate={navigate} />;
    } else if (currentPath === '/privacy') {
      publicContent = <PrivacyPage onNavigate={navigate} />;
    } else if (currentPath === '/safety' || currentPath === '/safety-center' || currentPath === '/trust' || currentPath === '/trust-and-safety') {
      publicContent = <SafetyCenterPage onNavigate={navigate} />;
    } else if (currentPath === '/test-trust-safety' || currentPath === '/trust/test') {
      publicContent = (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TrustAndSafetyTestPage />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1">
          {publicContent}
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return (
    <div className="relative font-sans text-slate-900 antialiased min-h-screen selection:bg-[#F5B400] selection:text-[#061A4F]">
      {renderRoute()}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { OouLogo } from '../brand/OouLogo';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Opportunities', path: '/opportunities', badge: 'NEW' },
    { name: 'Student Connect', path: '/student-connect', badge: 'HOT' },
    { name: 'Services', path: '/explore' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Campus Hub', path: '/campus' },
    { name: 'Locations', path: '/campus/locations' },
    { name: 'About', path: '/about' }
  ];

  const getDashboardPath = () => {
    if (!currentUser) return '/auth/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'client') return '/client/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')} 
            className="cursor-pointer transition hover:opacity-95 flex-shrink-0"
          >
            <OouLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.path)}
                  className={`text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-[#061A4F] font-bold underline underline-offset-8 decoration-[#F5B400] decoration-2' 
                      : 'text-slate-600 hover:text-[#061A4F]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#F5B400] text-[#061A4F]">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Global Search Button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-semibold transition shadow-2xs"
                title="Search services, products, shops, and locations (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xl:inline">Quick Search...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            )}

            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate(getDashboardPath())}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#061A4F] text-white rounded-xl hover:bg-[#0B2A6F] shadow-sm transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#F5B400]" />
                  <span>Dashboard</span>
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <UserAvatar
                    name={currentUser.fullName}
                    photoUrl={currentUser.profilePhoto}
                    size="sm"
                  />
                  <button
                    onClick={() => logout()}
                    title="Log out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-slate-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/auth/login')}
                  className="px-4 py-2 text-xs font-bold text-[#061A4F] hover:text-[#0B2A6F] border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('/auth/register')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#061A4F] text-white rounded-xl hover:bg-[#0B2A6F] shadow-md transition group"
                >
                  <span>Join StudentCircle</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5B400] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => onNavigate(getDashboardPath())}
                className="px-3 py-1.5 text-xs font-bold bg-[#061A4F] text-white rounded-lg"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-[#061A4F] hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-semibold rounded-xl transition flex items-center justify-between ${
                  currentPath === link.path 
                    ? 'bg-slate-100 text-[#061A4F] font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F5B400] text-[#061A4F]">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold bg-[#061A4F] text-white rounded-xl"
                >
                  Open Dashboard ({currentUser.role})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('/auth/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-[#061A4F] border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('/auth/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold bg-[#061A4F] text-white rounded-xl shadow-sm"
                >
                  Join StudentCircle
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, GraduationCap, Briefcase, ChevronUp, ChevronDown, CheckCircle, Database } from 'lucide-react';

interface DemoRoleSwitcherProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, loginAsDemo, isFirebaseConfigured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      role: 'student' as UserRole,
      id: 'student-1',
      name: 'Sulaiman Onifade (Student)',
      desc: 'Computer Science, 400L (Verified)',
      icon: GraduationCap,
      path: '/student/dashboard',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      role: 'student' as UserRole,
      id: 'student-2',
      name: 'Adebayo Samuel (Student)',
      desc: 'Fine & Applied Arts, 300L (Designer)',
      icon: GraduationCap,
      path: '/student/dashboard',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      role: 'client' as UserRole,
      id: 'client-1',
      name: 'Johnson Peter (Client)',
      desc: 'Apex Brand Studio (Client)',
      icon: Briefcase,
      path: '/client/dashboard',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      role: 'admin' as UserRole,
      id: 'admin-1',
      name: 'Super Admin (Admin)',
      desc: 'OOU Verification & Moderation',
      icon: Shield,
      path: '/admin',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-80 max-w-[90vw] text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <div>
              <div className="text-xs font-bold text-[#061A4F] uppercase tracking-wider">
                Interactive Persona Switcher
              </div>
              <div className="text-[11px] text-slate-500">
                Switch roles instantly to test all user journeys
              </div>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${isFirebaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              <Database className="w-2.5 h-2.5" />
              {isFirebaseConfigured ? 'Live Firebase' : 'Active Store'}
            </span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {roles.map((item) => {
              const isActive = currentUser?.id === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    loginAsDemo(item.role, item.id);
                    onNavigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between border ${
                    isActive 
                      ? 'bg-[#061A4F] text-white border-[#061A4F] font-semibold' 
                      : 'hover:bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium truncate max-w-[170px]">{item.name}</div>
                      <div className={`text-[10px] ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {isActive && <CheckCircle className="w-4 h-4 text-[#F5B400] flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onNavigate('/');
                setIsOpen(false);
              }}
              className="text-[11px] text-[#061A4F] font-semibold hover:underline"
            >
              Public Landing Page
            </button>
            <button
              onClick={() => {
                onNavigate('/services');
                setIsOpen(false);
              }}
              className="text-[11px] text-slate-500 hover:text-[#061A4F]"
            >
              Explore Services
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white px-3.5 py-2 rounded-full shadow-lg border border-[#F5B400]/40 transition text-xs font-semibold"
        title="Switch demo persona (Student, Client, Admin)"
      >
        <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse"></span>
        <span>Role: <strong className="text-[#F5B400] capitalize">{currentUser?.role || 'Guest'}</strong></span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

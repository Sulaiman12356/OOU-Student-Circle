import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { TransactionEngineStore } from '../../services/transactionEngineStore';
import { TrustSafetyStore } from '../../services/trustSafetyStore';
import { getServicePrice, formatBudget } from '../../types';
import { 
  Briefcase, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Star, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Send, 
  ArrowRight, 
  DollarSign,
  Eye,
  Settings,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface ProviderDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ProviderDashboardPage: React.FC<ProviderDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const providerId = currentUser?.id || '';
  const myServices = currentUser ? DataStore.getServicesByStudent(providerId) : [];
  const myQuotes = currentUser ? TransactionEngineStore.getQuotesForUser(providerId) : [];
  const myOrders = currentUser ? TransactionEngineStore.getOrdersForUser(providerId).filter(o => o.sellerId === providerId) : [];
  const myReviews = currentUser ? TrustSafetyStore.getReviewsForUser(providerId) : [];
  const openRequests = TransactionEngineStore.getRequests().filter(r => r.status === 'pending');

  const pendingQuotes = myQuotes.filter(q => q.status === 'pending');
  const activeOrders = myOrders.filter(o => o.status === 'Processing' || o.status === 'Paid' || o.status === 'Confirmed' || o.status === 'Ready');
  const completedOrders = myOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered');

  const totalEarnings = currentUser?.totalEarnings || 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#040E29] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#F5B400]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-black uppercase tracking-wider">
                Service Provider Studio
              </span>
              {currentUser?.isVerified ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Provider
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Verification Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome, {currentUser?.fullName?.split(' ')[0] || 'Provider'}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage your services, client requests, quotes, active contracts, and escrow payments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/student/services/new')}
              className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-black rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Service</span>
            </button>
            <button
              onClick={() => onNavigate('/orders')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Client Orders Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Escrow Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            ₦{totalEarnings.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{completedOrders.length} completed orders</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Contracts</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Funded in platform escrow
          </div>
        </div>

        {/* Published Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live Services</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {myServices.length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            {myQuotes.length} quotes submitted
          </div>
        </div>

        {/* Client Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Satisfaction</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <Star className="w-4 h-4 fill-[#F5B400]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F] flex items-center gap-1">
            <span>{currentUser?.rating ? currentUser.rating.toFixed(1) : '0.0'}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Based on {currentUser?.reviewsCount || myReviews.length || 0} reviews
          </div>
        </div>

      </div>

      {/* Main Grid: My Services & Open Client Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My Published Services */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">My Service Listings</h2>
            <button
              onClick={() => onNavigate('/student/services')}
              className="text-xs font-bold text-[#061A4F] hover:underline cursor-pointer"
            >
              Manage All
            </button>
          </div>

          {myServices.length > 0 ? (
            <div className="space-y-3">
              {myServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={service.coverImage || service.coverPhoto || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80'}
                      alt={service.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#061A4F] truncate">{service.title}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {service.category} • Starts at ₦{getServicePrice(service).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          {service.status || 'Active'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ★ {(service.rating || 5.0).toFixed(1)} ({service.reviewsCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('/student/services')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-[#061A4F] hover:text-white text-[#061A4F] font-bold text-xs rounded-lg transition flex-shrink-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Services Published Yet</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Create your first service listing to showcase your skills to campus clients.
              </p>
              <button
                onClick={() => onNavigate('/student/services/new')}
                className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Create First Service
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Open Client Requests / Bids */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">Open Client Hire Requests</h2>
            <button
              onClick={() => onNavigate('/orders')}
              className="text-xs font-bold text-[#061A4F] hover:underline cursor-pointer"
            >
              View Orders Hub
            </button>
          </div>

          {openRequests.length > 0 ? (
            <div className="space-y-3">
              {openRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#061A4F] line-clamp-1">{req.title}</h4>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ₦{(req.budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{req.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Client: {req.buyer?.name || 'OOU Client'}</span>
                    <button
                      onClick={() => onNavigate('/orders')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Submit Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Open Requests Right Now</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Clients post custom project requests here. You will receive notifications when new matching jobs arrive.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

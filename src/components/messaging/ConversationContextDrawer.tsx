import React from 'react';
import { Conversation, ConversationContext, UserProfile } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag, 
  Briefcase, 
  Store, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  Lock, 
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';

interface ConversationContextDrawerProps {
  conversation: Conversation;
  currentUser: UserProfile;
  onNavigate?: (path: string) => void;
  onSendQuoteRequest?: () => void;
}

export const ConversationContextDrawer: React.FC<ConversationContextDrawerProps> = ({
  conversation,
  currentUser,
  onNavigate,
  onSendQuoteRequest
}) => {
  const context = conversation.context;
  const otherParticipantId = conversation.participants.find(id => id !== currentUser.id) || conversation.participants[0];
  const otherParticipant = conversation.participantDetails[otherParticipantId];

  return (
    <div className="w-80 border-l border-slate-200 bg-slate-50/50 flex flex-col h-full overflow-y-auto divide-y divide-slate-200/80">
      
      {/* Partner Info Summary */}
      <div className="p-5 bg-white text-center space-y-3">
        <div className="relative inline-block">
          <img
            src={otherParticipant?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
            alt={otherParticipant?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm mx-auto"
          />
          {otherParticipant?.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white" title="Verified Campus Identity">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#061A4F] flex items-center justify-center gap-1">
            <span>{otherParticipant?.name}</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {otherParticipant?.departmentOrCompany || (otherParticipant?.role === 'client' ? 'Campus Enterprise' : 'OOU Student')}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#061A4F]/5 text-[#061A4F]">
            {otherParticipant?.role}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online Now
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Escrow Guarded
          </span>
        </div>
      </div>

      {/* Associated Context Details (Service, Marketplace, Order, Job, Campus Shop) */}
      {context && (
        <div className="p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Attached Context
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5B400]/15 text-[#061A4F]">
              {conversation.type?.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Service Context */}
          {conversation.type === 'service' && context.serviceTitle && (
            <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 space-y-3">
              {context.serviceCoverImage && (
                <img
                  src={context.serviceCoverImage}
                  alt={context.serviceTitle}
                  className="w-full h-24 rounded-xl object-cover border border-slate-200"
                />
              )}
              <div>
                <h4 className="text-xs font-bold text-[#061A4F] leading-snug line-clamp-2">
                  {context.serviceTitle}
                </h4>
                {context.serviceCategory && (
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    Category: {context.serviceCategory}
                  </span>
                )}
              </div>

              {context.servicePrice && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                  <span className="text-[11px] text-slate-500">Service Fee</span>
                  <span className="text-xs font-black text-[#061A4F]">
                    ₦{context.servicePrice.toLocaleString()}
                  </span>
                </div>
              )}

              {onNavigate && (
                <button
                  onClick={() => onNavigate(`/explore`)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-[#061A4F] border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Service</span>
                </button>
              )}
            </div>
          )}

          {/* Marketplace Item Context */}
          {conversation.type === 'marketplace' && context.productTitle && (
            <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 space-y-3">
              {context.productImage && (
                <img
                  src={context.productImage}
                  alt={context.productTitle}
                  className="w-full h-24 rounded-xl object-cover border border-slate-200"
                />
              )}
              <div>
                <h4 className="text-xs font-bold text-[#061A4F] leading-snug line-clamp-2">
                  {context.productTitle}
                </h4>
                {context.productCondition && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {context.productCondition}
                  </span>
                )}
              </div>

              {context.productPrice && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                  <span className="text-[11px] text-slate-500">Listed Price</span>
                  <span className="text-xs font-black text-[#061A4F]">
                    ₦{context.productPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {onNavigate && (
                <button
                  onClick={() => onNavigate(`/marketplace`)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-[#061A4F] border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  <span>View in Marketplace</span>
                </button>
              )}
            </div>
          )}

          {/* Order Details Context */}
          {context.orderId && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Order #{context.orderId}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {context.orderStatus || 'Escrow Funded'}
                </span>
              </div>
              
              {context.orderAmount && (
                <div className="text-xs flex items-center justify-between font-medium text-emerald-800">
                  <span>Secured in Escrow</span>
                  <span className="font-extrabold">₦{context.orderAmount.toLocaleString()}</span>
                </div>
              )}

              {onNavigate && (
                <button
                  onClick={() => onNavigate(`/student/orders`)}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Track Escrow Order
                </button>
              )}
            </div>
          )}

          {/* Job Context */}
          {conversation.type === 'job' && context.jobTitle && (
            <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#061A4F]">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>{context.jobTitle}</span>
              </div>
              {context.jobBudget && (
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Project Budget</span>
                  <span className="font-extrabold text-[#061A4F]">₦{context.jobBudget.toLocaleString()}</span>
                </div>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate(`/opportunities`)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-[#061A4F] border border-slate-200 rounded-xl text-xs font-bold transition"
                >
                  View Job Brief
                </button>
              )}
            </div>
          )}

          {/* Campus Shop Context */}
          {conversation.type === 'campus_service' && context.shopName && (
            <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#061A4F]">
                <Store className="w-4 h-4 text-[#F5B400]" />
                <span>{context.shopName}</span>
              </div>
              {context.serviceTitle && (
                <p className="text-xs text-slate-600">{context.serviceTitle}</p>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate(`/campus`)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-[#061A4F] border border-slate-200 rounded-xl text-xs font-bold transition"
                >
                  Visit Campus Hub
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* Campus Safety Notice & Escrow Rule */}
      <div className="p-5 space-y-3 bg-slate-50 text-xs">
        <div className="flex items-start gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-[#061A4F]">Campus Escrow Protection</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Always agree to terms and process payments through StudentCircle Escrow. Funds are only released when you verify delivery.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-200">
          <MapPin className="w-4 h-4 text-[#F5B400] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-[#061A4F]">Safe Physical Meeting Zones</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Meet in verified campus locations: ICT Center, Main Campus Library Quad, or Mini Campus Gate.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

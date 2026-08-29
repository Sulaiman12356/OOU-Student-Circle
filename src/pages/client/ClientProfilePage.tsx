import React from 'react';
import { UserProfile } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { Building, MapPin, Mail, Phone, Calendar, ShieldCheck, Briefcase, ExternalLink, Edit2 } from 'lucide-react';

interface ClientProfilePageProps {
  currentUser: UserProfile;
  onNavigate: (path: string) => void;
}

export const ClientProfilePage: React.FC<ClientProfilePageProps> = ({ currentUser, onNavigate }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">Company / Client Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your public client identity and hiring credentials displayed to OOU student freelancers.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/settings')}
          className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Edit2 className="w-3.5 h-3.5 text-[#F5B400]" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <UserAvatar
            name={currentUser.businessName || currentUser.fullName}
            photoUrl={currentUser.profilePhoto}
            size="xl"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#061A4F]">{currentUser.businessName || currentUser.fullName}</h2>
              {currentUser.isVerified && (
                <ShieldCheck className="w-5 h-5 text-blue-600" title="Verified Employer" />
              )}
            </div>
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold uppercase text-[10px]">
                {currentUser.businessCategory || 'Hiring Client'}
              </span>
              <span>•</span>
              <span>Contact: {currentUser.fullName}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
              <span className="font-bold text-slate-800">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone / WhatsApp</span>
              <span className="font-bold text-slate-800">{currentUser.phoneNumber || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
              <span className="font-bold text-slate-800">{currentUser.location || 'Ago-Iwoye Main Campus'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Member Since</span>
              <span className="font-bold text-slate-800">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {currentUser.shortBio && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase">About the Organization</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {currentUser.shortBio}
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  AdminProfile, 
  AdminPermission, 
  AdminRole, 
  AdminStatus,
  SecurityEvent,
  ALL_ADMIN_PERMISSIONS, 
  SUPER_ADMIN_PERMISSIONS
} from '../../types/admin';
import { AdminService, PlatformLiveStats } from '../../services/adminService';
import { UserAvatar } from '../../components/common/UserAvatar';
import { 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ShieldAlert, 
  Clock, 
  KeyRound, 
  Edit3, 
  UserX, 
  UserCheck, 
  Sparkles,
  ArrowLeft,
  Activity,
  Shield,
  Sliders,
  Users,
  RefreshCw,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';

interface AdminSuperAdminPageProps {
  onNavigate?: (path: string) => void;
  initialTab?: 'admins' | 'permissions' | 'security' | 'governance';
}

export const AdminSuperAdminPage: React.FC<AdminSuperAdminPageProps> = ({ 
  onNavigate,
  initialTab = 'admins'
}) => {
  const { adminProfile, isSuperAdmin, logoutAdmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'admins' | 'permissions' | 'security' | 'governance'>(initialTab);
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [liveStats, setLiveStats] = useState<PlatformLiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'deactivated'>('all');

  // Create Admin Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('ADMIN');
  const [newStatus, setNewStatus] = useState<AdminStatus>('active');
  const [sendInvitation, setSendInvitation] = useState(true);
  const [newDepartment, setNewDepartment] = useState('Campus Operations');
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([
    'users.view',
    'users.verify',
    'services.view',
    'services.moderate',
    'marketplace.view',
    'marketplace.moderate',
    'orders.view',
    'transactions.view',
    'reports.manage',
    'disputes.manage'
  ]);
  
  // Edit Permissions Modal State
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminList, events, stats] = await Promise.all([
        AdminService.listAdministrators(),
        AdminService.getSecurityEvents(30),
        AdminService.getLivePlatformStats()
      ]);
      setAdmins(adminList);
      setSecurityEvents(events);
      setLiveStats(stats);
    } catch (err) {
      console.error('Error loading SuperAdmin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Strict SuperAdmin enforcement
  if (!isSuperAdmin) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-5 bg-white rounded-3xl border border-rose-200 shadow-sm mt-12">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#061A4F]">Access Denied: SuperAdmin Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            This module contains root infrastructure governance, administrator provisioning, and zero-trust security events. Access is restricted to authorized Super Administrators.
          </p>
        </div>
        {onNavigate && (
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/admin/dashboard')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Return to Standard Admin Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg('Please provide the administrator full name and email address.');
      return;
    }

    setActionLoading(true);
    try {
      const generatedUid = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      await AdminService.createAdministrator(adminProfile, {
        uid: generatedUid,
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        phoneNumber: newPhone.trim(),
        profilePhoto: newPhoto.trim() || undefined,
        role: newRole,
        status: newStatus,
        sendInvitation,
        permissions: newRole === 'SUPER_ADMIN' ? SUPER_ADMIN_PERMISSIONS : selectedPermissions,
        department: newDepartment
      });

      setSuccessMsg(`Administrator account for ${newName} provisioned successfully in Firestore${sendInvitation ? ' and invitation email sent' : ''}.`);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewPhoto('');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create administrator.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (admin: AdminProfile) => {
    if (!adminProfile) return;
    if (admin.uid === adminProfile.uid) {
      alert('You cannot deactivate your own administrator account.');
      return;
    }

    const isDeactivating = admin.status === 'active';
    try {
      if (isDeactivating) {
        await AdminService.deactivateAdministrator(adminProfile, admin.uid, admin.email);
        setSuccessMsg(`Admin ${admin.name} deactivated.`);
      } else {
        await AdminService.reactivateAdministrator(adminProfile, admin.uid, admin.email);
        setSuccessMsg(`Admin ${admin.name} reactivated.`);
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update administrator status.');
    }
  };

  const handleSendResetLink = async (admin: AdminProfile) => {
    if (!adminProfile) return;
    setActionLoading(true);
    try {
      const res = await AdminService.sendPasswordResetForAdmin(adminProfile, admin.email);
      if (res.success) {
        setSuccessMsg(res.message || `Password reset link dispatched to ${admin.email}`);
      } else {
        alert(res.error || 'Failed to send reset link.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveAdmin = async (admin: AdminProfile) => {
    if (!adminProfile) return;
    if (admin.uid === adminProfile.uid) {
      alert('You cannot remove your own administrator account.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to remove administrator ${admin.name} (${admin.email})? This action will revoke all portal permissions.`);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await AdminService.removeAdministrator(adminProfile, admin.uid, admin.email);
      if (res.success) {
        setSuccessMsg(`Administrator ${admin.name} removed.`);
        await loadData();
      } else {
        alert(res.error || 'Failed to remove admin.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile || !editingAdmin) return;
    setActionLoading(true);
    try {
      await AdminService.updateAdminPermissions(
        adminProfile, 
        editingAdmin.uid, 
        editingAdmin.name, 
        editingAdmin.permissions
      );
      setSuccessMsg(`Permissions updated for ${editingAdmin.name}.`);
      setEditingAdmin(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update permissions.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.department && a.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* SuperAdmin Executive Header */}
      <div className="bg-[#061A4F] text-white p-6 sm:p-8 rounded-3xl border border-[#F5B400]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F5B400]/10 to-transparent pointer-events-none blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B400]/20 border border-[#F5B400]/40 text-[#F5B400] text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUPERADMINISTRATION COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Governance & Access Control
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Root control center for managing platform administrators, granular role-based permissions, security audit trails, and zero-trust authentication policies.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-black rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision New Admin</span>
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* SuperAdmin KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Authorized Admins</div>
            <div className="text-xl font-black text-white mt-0.5">{admins.length}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Active Staff</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {admins.filter(a => a.status === 'active').length}
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Total Platform Users</div>
            <div className="text-xl font-black text-[#F5B400] mt-0.5">
              {liveStats?.totalUsers || 0}
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Security Alerts</div>
            <div className="text-xl font-black text-cyan-300 mt-0.5">
              {securityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'admins'
              ? 'bg-[#061A4F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Administrators ({admins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'permissions'
              ? 'bg-[#061A4F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>RBAC Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#061A4F] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security Events & Zero-Trust Audit</span>
        </button>
      </div>

      {/* TAB 1: ADMINISTRATORS LIST */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admins by name, email, department..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              >
                <option value="all">All Administrators</option>
                <option value="active">Active Staff</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Administrator</th>
                    <th className="py-3.5 px-4">Role Tier</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned Permissions</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-[#061A4F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <span>Querying Firestore administrators...</span>
                      </td>
                    </tr>
                  ) : filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No administrators found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => {
                      const isSuper = admin.role === 'SUPER_ADMIN' || admin.role === 'super_admin';
                      return (
                        <tr key={admin.uid} className="hover:bg-slate-50/80 transition">
                          
                          {/* User info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={admin.name}
                                photoUrl={admin.profilePhoto}
                                size="sm"
                              />
                              <div>
                                <div className="font-bold text-[#061A4F] flex items-center gap-1.5">
                                  <span>{admin.name}</span>
                                  {isSuper && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-[#F5B400]/20 text-[#061A4F] text-[9px] font-black border border-[#F5B400]/40">
                                      SUPER_ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-400 text-[11px]">{admin.email}</div>
                                {admin.department && (
                                  <div className="text-[10px] text-slate-500 font-semibold">{admin.department}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#061A4F]">
                              {isSuper ? 'SUPER_ADMIN' : 'ADMIN'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              admin.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {admin.status}
                            </span>
                          </td>

                          {/* Permissions */}
                          <td className="py-3.5 px-4">
                            {isSuper ? (
                              <span className="text-[11px] font-bold text-[#061A4F] flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#F5B400]" />
                                <span>Full Root Access ({SUPER_ADMIN_PERMISSIONS.length})</span>
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {admin.permissions?.slice(0, 3).map(p => (
                                  <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-semibold">
                                    {p}
                                  </span>
                                ))}
                                {(admin.permissions?.length || 0) > 3 && (
                                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-bold">
                                    +{admin.permissions.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Last Active */}
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{admin.lastActivityAt ? new Date(admin.lastActivityAt).toLocaleDateString() : 'Never'}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingAdmin(admin)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                                title="Edit Permissions"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleSendResetLink(admin)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                                title="Send Password Reset / Invitation Link"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>
                              
                              {!isSuper && (
                                <>
                                  <button
                                    onClick={() => handleToggleStatus(admin)}
                                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                                      admin.status === 'active' 
                                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                    }`}
                                    title={admin.status === 'active' ? 'Deactivate Admin' : 'Reactivate Admin'}
                                  >
                                    {admin.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                  </button>

                                  <button
                                    onClick={() => handleRemoveAdmin(admin)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                                    title="Remove Admin Account"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRANULAR RBAC PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-[#061A4F]">OOU StudentCircle RBAC Matrix</h3>
              <p className="text-xs text-slate-500">
                Detailed catalog of all granular privileges enforced by backend Firestore security rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_ADMIN_PERMISSIONS.map(perm => (
                <div key={perm.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#061A4F] border border-blue-100">
                      {perm.category}
                    </span>
                    <code className="text-[10px] font-mono text-slate-500">{perm.key}</code>
                  </div>
                  <h4 className="text-xs font-black text-[#061A4F]">{perm.label}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{perm.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ZERO-TRUST SECURITY EVENTS */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#061A4F]">Zero-Trust Security Events</h3>
                <p className="text-xs text-slate-500">
                  Real-time immutable log of admin sign-ins, failed attempts, privilege escalations, and status toggles.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {securityEvents.length} Recorded Events
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {securityEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No security events recorded yet.
                </div>
              ) : (
                securityEvents.map(event => (
                  <div key={event.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        event.severity === 'high' || event.severity === 'critical'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : event.severity === 'medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#061A4F]">{event.description}</span>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            event.severity === 'high' || event.severity === 'critical'
                              ? 'bg-rose-100 text-rose-700'
                              : event.severity === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {event.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Target Account: <span className="font-semibold text-slate-600">{event.email}</span> • Event: <code>{event.type}</code>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE ADMINISTRATOR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">Provision Administrator Account</h3>
                  <p className="text-[11px] text-slate-400">Assign role tier and granular privileges</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Administrator Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Adeola Balogun"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Administrator Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin.moderator@ooustudentcircle.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Account Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AdminStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    <option value="active">Active</option>
                    <option value="invited">Invited (Pending Setup)</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Role Tier</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    <option value="ADMIN">ADMIN (Staff & Moderator)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Platform Owner)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Department / Unit</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Identity & Safety"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              {/* Email Invitation Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={sendInvitation}
                    onChange={(e) => setSendInvitation(e.target.checked)}
                    className="w-4 h-4 text-[#061A4F] rounded"
                  />
                  <span>Dispatch Setup / Password Reset Email Invitation</span>
                </label>
                <p className="text-[10px] text-slate-500 mt-1 pl-6">
                  Sends an automated Firebase credential access link directly to the administrator's email.
                </p>
              </div>

              {/* Permissions Checklist */}
              {newRole !== 'SUPER_ADMIN' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Granular Role Permissions</label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions(ALL_ADMIN_PERMISSIONS.filter(p => !p.key.startsWith('admins.')).map(p => p.key))}
                        className="text-[#061A4F] font-bold hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions([])}
                        className="text-slate-500 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                      <span className="text-slate-400">({selectedPermissions.length} active)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {ALL_ADMIN_PERMISSIONS.filter(p => !p.key.startsWith('admins.')).map(perm => {
                      const isChecked = selectedPermissions.includes(perm.key);
                      return (
                        <label
                          key={perm.key}
                          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition ${
                            isChecked ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100 border border-transparent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedPermissions(selectedPermissions.filter(p => p !== perm.key));
                              } else {
                                setSelectedPermissions([...selectedPermissions, perm.key]);
                              }
                            }}
                            className="w-3.5 h-3.5 text-[#061A4F] rounded mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#061A4F] text-[11px] block">{perm.label}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">{perm.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {actionLoading ? 'Provisioning...' : 'Confirm Provisioning'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#061A4F]">Modify Admin Permissions</h3>
                <p className="text-[11px] text-slate-400">{editingAdmin.name} ({editingAdmin.email})</p>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-4 text-xs">
              
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Assigned RBAC Privileges</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_ADMIN_PERMISSIONS.filter(p => !p.key.startsWith('admins.')).map(perm => {
                    const isChecked = editingAdmin.permissions?.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const current = editingAdmin.permissions || [];
                            if (isChecked) {
                              setEditingAdmin({
                                ...editingAdmin,
                                permissions: current.filter(p => p !== perm.key)
                              });
                            } else {
                              setEditingAdmin({
                                ...editingAdmin,
                                permissions: [...current, perm.key]
                              });
                            }
                          }}
                          className="w-3.5 h-3.5 text-[#061A4F] rounded mt-0.5"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#061A4F] text-[11px] block">{perm.label}</span>
                          <span className="text-[10px] text-slate-500 block leading-tight">{perm.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Save Privileges'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

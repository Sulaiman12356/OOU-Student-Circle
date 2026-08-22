import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  AdminProfile, 
  AdminPermission, 
  AdminRole, 
  ALL_ADMIN_PERMISSIONS, 
  SUPER_ADMIN_EMAIL 
} from '../../types/admin';
import { AdminService } from '../../services/adminService';
import { 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  ShieldAlert, 
  Clock, 
  KeyRound, 
  Trash2, 
  Edit3, 
  UserX, 
  UserCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AdminManagementPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminManagementPage: React.FC<AdminManagementPageProps> = ({ onNavigate }) => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();

  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  
  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('admin');
  const [newDepartment, setNewDepartment] = useState('Campus Moderation');
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([
    'users.read',
    'services.moderate',
    'products.moderate',
    'orders.view'
  ]);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Modal
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    const list = await AdminService.listAdministrators();
    setAdmins(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4 bg-white rounded-3xl border border-rose-200 shadow-sm mt-8">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#061A4F]">Access Restricted: Super Administrator Only</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Provisioning and managing administrator roles requires primary platform ownership authorization ({SUPER_ADMIN_EMAIL}).
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('/admin')}
            className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    );
  }

  const handleTogglePermission = (perm: AdminPermission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newName || !newEmail) {
      setErrorMsg('Please provide the administrator name and email.');
      return;
    }

    setActionLoading(true);
    try {
      const tempUid = `admin-${Date.now()}`;
      await AdminService.createAdministrator(adminProfile, {
        uid: tempUid,
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        permissions: newRole === 'super_admin' ? ALL_ADMIN_PERMISSIONS.map(p => p.key) : selectedPermissions,
        department: newDepartment
      });

      setSuccessMsg(`Administrator ${newName} provisioned successfully.`);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setSelectedPermissions(['users.read', 'services.moderate', 'products.moderate', 'orders.view']);
      await fetchAdmins();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create administrator.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (admin: AdminProfile) => {
    if (!adminProfile) return;
    if (admin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('The root Super Administrator cannot be suspended.');
      return;
    }

    const newStatus = admin.status === 'active' ? 'suspended' : 'active';
    await AdminService.updateAdministrator(adminProfile, admin.uid, { status: newStatus });
    await fetchAdmins();
  };

  const handleSaveEditPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile || !editingAdmin) return;
    setActionLoading(true);
    try {
      await AdminService.updateAdministrator(adminProfile, editingAdmin.uid, {
        permissions: editingAdmin.permissions,
        role: editingAdmin.role
      });
      setEditingAdmin(null);
      await fetchAdmins();
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
    <div className="space-y-6">
      
      {/* Toast Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('/admin/settings')}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-2xl font-extrabold text-[#061A4F]">Administrator Governance & RBAC</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Super Administrator console for managing authorized platform moderators, staff credentials, and role permissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md flex-shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#F5B400]" />
          <span>Provision New Administrator</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
          >
            <option value="all">All Administrators</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Role & Status</th>
                <th className="py-3.5 px-4">Assigned Permissions</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#061A4F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading authorized administrators...</span>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No administrators found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.uid} className="hover:bg-slate-50/80 transition">
                    
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={admin.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                          alt={admin.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#061A4F] flex items-center gap-1.5">
                            <span>{admin.name}</span>
                            {admin.role === 'super_admin' && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#F5B400]/20 text-[#061A4F] text-[9px] font-extrabold border border-[#F5B400]/40">
                                Super Admin
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

                    {/* Role & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          admin.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {admin.status}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Added {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    {/* Permissions tags */}
                    <td className="py-3.5 px-4">
                      {admin.role === 'super_admin' ? (
                        <span className="text-[11px] font-bold text-[#061A4F] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                          <span>Full Platform Access ({ALL_ADMIN_PERMISSIONS.length})</span>
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {admin.permissions.slice(0, 3).map(p => (
                            <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-semibold">
                              {p}
                            </span>
                          ))}
                          {admin.permissions.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-bold">
                              +{admin.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Last active */}
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
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Edit Permissions"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {admin.role !== 'super_admin' && (
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            className={`p-1.5 rounded-lg transition ${
                              admin.status === 'active' 
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }`}
                            title={admin.status === 'active' ? 'Suspend Admin' : 'Reactivate Admin'}
                          >
                            {admin.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMINISTRATOR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#061A4F]">Provision Administrator</h3>
                  <p className="text-[11px] text-slate-400">Assign role and granular RBAC permissions</p>
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
                  placeholder="e.g. Samuel Adeleke"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="adeleke.moderator@ooustudentcircle.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Role Tier</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    <option value="admin">Platform Moderator / Admin</option>
                    <option value="super_admin">Super Administrator</option>
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

              {/* Permissions Checklist */}
              {newRole !== 'super_admin' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Granular Role Permissions</label>
                    <span className="text-[10px] text-slate-400">{selectedPermissions.length} selected</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {ALL_ADMIN_PERMISSIONS.filter(p => p.key !== 'admins.manage').map(perm => {
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
                            onChange={() => handleTogglePermission(perm.key)}
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
                  className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white font-bold rounded-xl flex items-center gap-2 shadow-md"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#061A4F]">Modify Admin Permissions</h3>
                <p className="text-[11px] text-slate-400">{editingAdmin.name} ({editingAdmin.email})</p>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPermissions} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Role Tier</label>
                <select
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                >
                  <option value="admin">Platform Moderator / Admin</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>

              {editingAdmin.role !== 'super_admin' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Assigned RBAC Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {ALL_ADMIN_PERMISSIONS.filter(p => p.key !== 'admins.manage').map(perm => {
                      const isChecked = editingAdmin.permissions.includes(perm.key);
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
                                setEditingAdmin({
                                  ...editingAdmin,
                                  permissions: editingAdmin.permissions.filter(p => p !== perm.key)
                                });
                              } else {
                                setEditingAdmin({
                                  ...editingAdmin,
                                  permissions: [...editingAdmin.permissions, perm.key]
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
              )}

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
                  className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white font-bold rounded-xl flex items-center gap-2 shadow-md"
                >
                  {actionLoading ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

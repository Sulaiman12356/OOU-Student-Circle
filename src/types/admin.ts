export type AdminRole = 'admin' | 'super_admin';

export type AdminStatus = 'active' | 'suspended' | 'deactivated';

export type AdminPermission = 
  | 'users.read'
  | 'users.manage'
  | 'services.moderate'
  | 'products.moderate'
  | 'jobs.moderate'
  | 'shops.manage'
  | 'orders.view'
  | 'transactions.view'
  | 'reports.manage'
  | 'disputes.manage'
  | 'analytics.view'
  | 'settings.manage'
  | 'admins.manage';

export interface AdminProfile {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  lastLoginAt: string;
  createdBy: string; // 'system_bootstrap' | creator admin uid
  profilePhoto?: string;
  permissions: AdminPermission[];
  lastActivityAt?: string;
  phoneNumber?: string;
  department?: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'service' | 'product' | 'job' | 'shop' | 'order' | 'transaction' | 'report' | 'dispute' | 'setting' | 'admin' | 'verification' | 'system';
  targetId: string;
  description: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export const ALL_ADMIN_PERMISSIONS: { key: AdminPermission; label: string; description: string; category: string }[] = [
  { key: 'users.read', label: 'View Users', description: 'Browse and inspect user profiles and verification documents', category: 'User Management' },
  { key: 'users.manage', label: 'Manage Users', description: 'Verify, suspend, and reactivate student and client accounts', category: 'User Management' },
  { key: 'services.moderate', label: 'Moderate Services', description: 'Approve, reject, or flag student service listings', category: 'Moderation' },
  { key: 'products.moderate', label: 'Moderate Products', description: 'Inspect and moderate campus marketplace items', category: 'Moderation' },
  { key: 'jobs.moderate', label: 'Moderate Jobs & SIWES', description: 'Review opportunities and job postings', category: 'Moderation' },
  { key: 'shops.manage', label: 'Manage Campus Shops', description: 'Approve and audit campus vendor kiosks and stores', category: 'Marketplace' },
  { key: 'orders.view', label: 'View Orders', description: 'Audit campus orders and delivery tracking', category: 'Commerce' },
  { key: 'transactions.view', label: 'View Financials', description: 'Inspect escrow balances, payouts, and revenue streams', category: 'Commerce' },
  { key: 'reports.manage', label: 'Manage Reports', description: 'Investigate incident reports and trust violations', category: 'Safety' },
  { key: 'disputes.manage', label: 'Resolve Disputes', description: 'Arbitrate escrow conflicts and issue refunds/releases', category: 'Safety' },
  { key: 'analytics.view', label: 'View Analytics', description: 'Access aggregate platform KPIs and telemetry trends', category: 'Insights' },
  { key: 'settings.manage', label: 'Platform Settings', description: 'Configure platform fees, campuses, and global policies', category: 'Governance' },
  { key: 'admins.manage', label: 'Manage Administrators', description: 'Create and assign permissions to other admins (Super Admin only)', category: 'Governance' },
];

export const SUPER_ADMIN_EMAIL = 'ipesolasulaiman@gmail.com';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'super_admin' | 'admin';

export type AdminStatus = 'active' | 'suspended' | 'deactivated';

export type AdminPermission = 
  // User Governance
  | 'users.view'
  | 'users.read'
  | 'users.manage'
  | 'users.verify'
  | 'users.suspend'
  
  // Services & Providers
  | 'services.view'
  | 'services.moderate'
  | 'services.verify'
  
  // Marketplace & Shops
  | 'marketplace.view'
  | 'marketplace.moderate'
  | 'marketplace.verify'
  | 'products.moderate'
  | 'shops.view'
  | 'shops.verify'
  | 'shops.manage'
  
  // Jobs & Opportunities
  | 'jobs.moderate'
  | 'categories.manage'
  
  // Transactions & Commerce
  | 'transactions.view'
  | 'orders.view'
  | 'disputes.manage'
  | 'reports.manage'
  
  // Communications & Content
  | 'messages.moderate'
  | 'content.manage'
  
  // System Insights & Platform Governance
  | 'analytics.view'
  | 'activity_logs.view'
  | 'settings.manage'
  | 'verification_rules.manage'
  | 'announcements.manage'
  | 'security.events.view'
  | 'admins.manage'
  | 'admins.create'
  | 'admins.deactivate'
  | 'admins.reactivate'
  | 'admins.permissions';

export interface AdminProfile {
  uid: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'super_admin' | 'admin';
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
  adminName?: string;
  action: string;
  targetType: 'user' | 'service' | 'product' | 'job' | 'shop' | 'vendor' | 'order' | 'transaction' | 'report' | 'dispute' | 'setting' | 'admin' | 'verification' | 'system' | 'security';
  targetId: string;
  description: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'failed_admin_login' | 'successful_admin_login' | 'privilege_escalation_attempt' | 'unauthorized_route_access' | 'admin_status_change' | 'superadmin_bootstrap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  email: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export const ALL_ADMIN_PERMISSIONS: { key: AdminPermission; label: string; description: string; category: string }[] = [
  // User Management
  { key: 'users.view', label: 'View Users', description: 'Browse and inspect student and client accounts and portfolios', category: 'User Management' },
  { key: 'users.verify', label: 'Verify Users', description: 'Accredit student IDs, Matric numbers, and admission letters', category: 'User Management' },
  { key: 'users.suspend', label: 'Suspend & Ban Users', description: 'Temporarily or permanently disable violating accounts', category: 'User Management' },
  { key: 'users.manage', label: 'Manage All Users', description: 'Full administrative control over user accounts', category: 'User Management' },

  // Service Moderation
  { key: 'services.view', label: 'View Services', description: 'Inspect published student gig listings and portfolio samples', category: 'Services' },
  { key: 'services.moderate', label: 'Moderate Services', description: 'Approve, reject, or request revisions on service listings', category: 'Services' },
  { key: 'services.verify', label: 'Verify Service Providers', description: 'Accredit verified student badges for top providers', category: 'Services' },

  // Marketplace & Shops
  { key: 'marketplace.view', label: 'View Marketplace', description: 'Inspect vendor stalls, catalogs, and listings', category: 'Marketplace' },
  { key: 'marketplace.moderate', label: 'Moderate Products', description: 'Approve or remove physical campus marketplace products', category: 'Marketplace' },
  { key: 'marketplace.verify', label: 'Verify Marketplace Vendors', description: 'Verify student merchant stores and inventory', category: 'Marketplace' },
  { key: 'shops.view', label: 'View Campus Shops', description: 'Inspect on-ground campus print kiosks and hubs', category: 'Campus Hubs' },
  { key: 'shops.verify', label: 'Verify Campus Shops', description: 'Accredit verified physical shop credentials and locations', category: 'Campus Hubs' },
  { key: 'shops.manage', label: 'Manage Campus Shops', description: 'Control campus shop listings and operating hours', category: 'Campus Hubs' },

  // Opportunities & Content
  { key: 'jobs.moderate', label: 'Moderate Jobs & SIWES', description: 'Review, approve, and moderate client job postings', category: 'Opportunities' },
  { key: 'categories.manage', label: 'Manage Categories', description: 'Create and organize service, product, and job taxonomies', category: 'Taxonomy' },
  { key: 'content.manage', label: 'Manage Platform Content', description: 'Update platform announcements, guides, and FAQs', category: 'Content' },
  { key: 'messages.moderate', label: 'Moderate Communications', description: 'Review reported chat channels and communication violations', category: 'Safety' },

  // Commerce & Arbitration
  { key: 'transactions.view', label: 'View Financials & Escrow', description: 'Audit platform escrow balances, commission payouts, and orders', category: 'Finance' },
  { key: 'orders.view', label: 'View Orders', description: 'Inspect delivery status, item fulfillment, and customer invoices', category: 'Finance' },
  { key: 'disputes.manage', label: 'Arbitrate Disputes', description: 'Resolve buyer-seller escrow conflicts, refunds, and releases', category: 'Safety' },
  { key: 'reports.manage', label: 'Manage Reports', description: 'Investigate platform incident reports and safety tickets', category: 'Safety' },

  // Platform Governance & Insights
  { key: 'analytics.view', label: 'View Analytics', description: 'Access aggregate platform KPIs, telemetry, and revenue metrics', category: 'Insights' },
  { key: 'activity_logs.view', label: 'View Activity Logs', description: 'Inspect immutable administrative audit trails', category: 'Governance' },
  { key: 'settings.manage', label: 'Manage Platform Settings', description: 'Configure commission rates, campus zones, and maintenance mode', category: 'Governance' },
  { key: 'verification_rules.manage', label: 'Manage Verification Rules', description: 'Adjust matriculation and student credential requirements', category: 'Governance' },
  { key: 'announcements.manage', label: 'Manage Announcements', description: 'Broadcast campus-wide banners and system updates', category: 'Governance' },
  { key: 'security.events.view', label: 'View Security Events', description: 'Audit failed logins, privilege changes, and security logs', category: 'Security' },

  // SuperAdmin Only
  { key: 'admins.manage', label: 'Manage Administrators', description: 'Comprehensive SuperAdmin control of administrative staff', category: 'SuperAdmin' },
  { key: 'admins.create', label: 'Create Admin Accounts', description: 'Provision new platform moderator and staff credentials', category: 'SuperAdmin' },
  { key: 'admins.deactivate', label: 'Deactivate Admin Accounts', description: 'Suspend or revoke administrative portal access', category: 'SuperAdmin' },
  { key: 'admins.reactivate', label: 'Reactivate Admin Accounts', description: 'Restore suspended administrative credentials', category: 'SuperAdmin' },
  { key: 'admins.permissions', label: 'Modify Admin Permissions', description: 'Granularly assign and revoke RBAC permissions', category: 'SuperAdmin' },
];

export const SUPER_ADMIN_PERMISSIONS: AdminPermission[] = ALL_ADMIN_PERMISSIONS.map(p => p.key);

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermission[] = [
  'users.view',
  'users.verify',
  'services.view',
  'services.moderate',
  'marketplace.view',
  'marketplace.moderate',
  'shops.view',
  'orders.view',
  'transactions.view',
  'reports.manage',
  'disputes.manage',
  'analytics.view',
  'activity_logs.view'
];

export const SUPER_ADMIN_EMAIL = 'ipesolasulaiman@gmail.com';

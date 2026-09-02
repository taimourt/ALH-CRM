export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'AGENT'
  | 'MARKETING'
  | 'ACCOUNTS'
  | 'VIEWER';

export type PermissionAction =
  | 'view_financials'
  | 'edit_leads'
  | 'delete_leads'
  | 'assign_leads'
  | 'manage_properties'
  | 'manage_users'
  | 'process_payments'
  | 'view_reports'
  | 'export_data';

const ROLE_PERMISSIONS: Record<Role, PermissionAction[]> = {
  SUPER_ADMIN: [
    'view_financials',
    'edit_leads',
    'delete_leads',
    'assign_leads',
    'manage_properties',
    'manage_users',
    'process_payments',
    'view_reports',
    'export_data',
  ],
  ADMIN: [
    'view_financials',
    'edit_leads',
    'delete_leads',
    'assign_leads',
    'manage_properties',
    'process_payments',
    'view_reports',
    'export_data',
  ],
  MANAGER: [
    'view_financials',
    'edit_leads',
    'assign_leads',
    'manage_properties',
    'manage_users',
    'process_payments',
    'view_reports',
    'export_data',
  ],
  AGENT: ['edit_leads', 'manage_properties'],
  MARKETING: ['edit_leads', 'export_data'],
  ACCOUNTS: ['view_financials', 'process_payments', 'view_reports', 'export_data'],
  VIEWER: [],
};

export function hasPermission(role: Role, action: PermissionAction): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

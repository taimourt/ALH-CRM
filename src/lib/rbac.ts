import { prisma } from './db';

export type PermissionString =
  | 'leads.view'
  | 'leads.create'
  | 'leads.edit'
  | 'leads.delete'
  | 'leads.assign'
  | 'leads.export'
  | 'properties.view'
  | 'properties.create'
  | 'properties.edit'
  | 'properties.delete'
  | 'properties.export'
  | 'deals.view'
  | 'deals.create'
  | 'deals.edit'
  | 'deals.delete'
  | 'payments.view'
  | 'payments.create'
  | 'payments.edit'
  | 'payments.delete'
  | 'commissions.view'
  | 'commissions.create'
  | 'commissions.edit'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'reports.view'
  | 'reports.export'
  | 'settings.manage'
  | 'ai.use';

export const ALL_PERMISSIONS: PermissionString[] = [
  'leads.view',
  'leads.create',
  'leads.edit',
  'leads.delete',
  'leads.assign',
  'leads.export',
  'properties.view',
  'properties.create',
  'properties.edit',
  'properties.delete',
  'properties.export',
  'deals.view',
  'deals.create',
  'deals.edit',
  'deals.delete',
  'payments.view',
  'payments.create',
  'payments.edit',
  'payments.delete',
  'commissions.view',
  'commissions.create',
  'commissions.edit',
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'reports.view',
  'reports.export',
  'settings.manage',
  'ai.use',
];

export const DEFAULT_ROLE_PRESETS: Record<string, PermissionString[]> = {
  SUPER_ADMIN: [...ALL_PERMISSIONS],
  ADMIN: ALL_PERMISSIONS.filter((p) => p !== 'settings.manage' && p !== 'users.create' && p !== 'users.delete'),
  MANAGER: [
    'leads.view',
    'leads.create',
    'leads.edit',
    'leads.assign',
    'leads.export',
    'properties.view',
    'properties.create',
    'properties.edit',
    'deals.view',
    'deals.create',
    'deals.edit',
    'payments.view',
    'commissions.view',
    'users.view',
    'users.create',
    'users.edit',
    'reports.view',
    'reports.export',
    'ai.use',
  ],
  SALES_AGENT: [
    'leads.view',
    'leads.create',
    'leads.edit',
    'properties.view',
    'deals.view',
    'deals.create',
    'ai.use',
  ],
  SENIOR_AGENT: [
    'leads.view',
    'leads.create',
    'leads.edit',
    'leads.assign',
    'properties.view',
    'properties.create',
    'deals.view',
    'deals.create',
    'deals.edit',
    'ai.use',
  ],
  MARKETING: ['leads.view', 'leads.create', 'leads.export', 'properties.view', 'reports.view'],
  ACCOUNTS: [
    'payments.view',
    'payments.create',
    'payments.edit',
    'commissions.view',
    'commissions.create',
    'reports.view',
  ],
  VIEWER: ['leads.view', 'properties.view', 'deals.view', 'reports.view'],
};

// Route to required permissions mapping for client and middleware access guards
export const ROUTE_PERMISSION_MAP: Record<string, PermissionString | PermissionString[]> = {
  '/leads': 'leads.view',
  '/customers': ['leads.view', 'deals.view'],
  '/properties': 'properties.view',
  '/societies': 'properties.view',
  '/deals': 'deals.view',
  '/site-visits': ['leads.view', 'deals.view'],
  '/agents': 'users.view',
  '/communications': 'leads.view',
  '/documents': ['properties.view', 'deals.view'],
  '/payments': 'payments.view',
  '/commissions': 'commissions.view',
  '/marketing': ['reports.view', 'leads.export'],
  '/analytics': 'reports.view',
  '/ai-assistant': 'ai.use',
  '/settings': 'settings.manage',
  '/settings/users': 'users.view',
  '/settings/roles': 'settings.manage',
  '/settings/teams': 'settings.manage',
  '/settings/email': 'settings.manage',
  '/settings/integrations': 'settings.manage',
  '/settings/audit-logs': 'settings.manage',
};

export async function getRolePermissionsFromDB(roleNameOrCode: string): Promise<PermissionString[]> {
  const normalized = (roleNameOrCode || 'SALES_AGENT').toUpperCase().replace(/\s+/g, '_');
  if (normalized === 'SUPER_ADMIN') {
    return [...ALL_PERMISSIONS];
  }

  try {
    const roleRecord = await prisma.role.findFirst({
      where: {
        OR: [
          { name: { equals: roleNameOrCode, mode: 'insensitive' } },
          { name: { equals: roleNameOrCode.replace(/_/g, ' '), mode: 'insensitive' } },
          { name: { equals: normalized, mode: 'insensitive' } },
        ],
      },
    });

    if (roleRecord?.permissions) {
      const parsed = JSON.parse(roleRecord.permissions);
      if (Array.isArray(parsed)) {
        return parsed as PermissionString[];
      }
    }
  } catch (e) {
    console.error('Error fetching role permissions from DB:', e);
  }

  return DEFAULT_ROLE_PRESETS[normalized] || DEFAULT_ROLE_PRESETS.SALES_AGENT;
}

export function hasPermission(
  userRole: string,
  permission: PermissionString,
  activePermissions?: string[]
): boolean {
  if (userRole === 'SUPER_ADMIN') return true;

  if (activePermissions && Array.isArray(activePermissions)) {
    return activePermissions.includes(permission);
  }

  const normalized = (userRole || 'SALES_AGENT').toUpperCase().replace(/\s+/g, '_');
  const preset = DEFAULT_ROLE_PRESETS[normalized] || DEFAULT_ROLE_PRESETS.SALES_AGENT;
  return preset.includes(permission);
}

export type RecordAccessScope = 'OWN' | 'TEAM' | 'DEPARTMENT' | 'ALL';

export function getRecordScopeForRole(role: string): RecordAccessScope {
  const normalized = (role || 'SALES_AGENT').toUpperCase().replace(/\s+/g, '_');
  switch (normalized) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
    case 'ACCOUNTS':
      return 'ALL';
    case 'MANAGER':
      return 'TEAM';
    case 'SALES_AGENT':
    case 'SENIOR_AGENT':
      return 'OWN';
    default:
      return 'OWN';
  }
}

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PermissionString, ROUTE_PERMISSION_MAP, DEFAULT_ROLE_PRESETS } from '@/lib/rbac';

export interface RBACContextValue {
  user: any | null;
  role: string;
  permissions: string[];
  loading: boolean;
  hasPermission: (permission: PermissionString) => boolean;
  canAccessRoute: (pathname: string) => boolean;
  refreshPermissions: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAgent: boolean;
}

const RBACContext = createContext<RBACContextValue>({
  user: null,
  role: '',
  permissions: [],
  loading: true,
  hasPermission: () => false,
  canAccessRoute: () => true,
  refreshPermissions: async () => {},
  isSuperAdmin: false,
  isAdmin: false,
  isManager: false,
  isAgent: false,
});

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_role')?.toUpperCase().replace(/\s+/g, '_') || '';
    }
    return '';
  });
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          const userRole = (data.user.role || 'SALES_AGENT').toUpperCase().replace(/\s+/g, '_');
          setRole(userRole);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_role', userRole);
          }

          // Get live dynamic permissions from API or fallback to role preset
          const userPerms =
            Array.isArray(data.user.permissions) && data.user.permissions.length > 0
              ? data.user.permissions
              : DEFAULT_ROLE_PRESETS[userRole] || DEFAULT_ROLE_PRESETS.SALES_AGENT;

          setPermissions(userPerms);
          return;
        }
      }
      // If unauthenticated or SSR fallback
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
      if (storedRole) {
        const normRole = storedRole.toUpperCase().replace(/\s+/g, '_');
        setRole(normRole);
        setPermissions(DEFAULT_ROLE_PRESETS[normRole] || DEFAULT_ROLE_PRESETS.SALES_AGENT);
      }
    } catch (err) {
      console.error('Failed to fetch RBAC user permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthUser();
  }, [fetchAuthUser]);

  const hasPermission = useCallback(
    (permission: PermissionString): boolean => {
      const normRole = (role || '').toUpperCase().replace(/\s+/g, '_');
      if (normRole === 'SUPER_ADMIN') return true;
      if (!permissions || permissions.length === 0) {
        const preset = DEFAULT_ROLE_PRESETS[normRole] || DEFAULT_ROLE_PRESETS.SALES_AGENT;
        return preset.includes(permission);
      }
      return permissions.includes(permission);
    },
    [role, permissions]
  );

  const canAccessRoute = useCallback(
    (pathname: string): boolean => {
      const normRole = (role || '').toUpperCase().replace(/\s+/g, '_');
      if (normRole === 'SUPER_ADMIN') return true;

      // Find exact or prefix match in ROUTE_PERMISSION_MAP
      let requiredPerms = ROUTE_PERMISSION_MAP[pathname];
      if (!requiredPerms) {
        const matchingKey = Object.keys(ROUTE_PERMISSION_MAP).find(
          (k) => pathname === k || pathname.startsWith(`${k}/`)
        );
        if (matchingKey) requiredPerms = ROUTE_PERMISSION_MAP[matchingKey];
      }

      if (!requiredPerms) return true; // Default allowed for unmapped public pages

      if (Array.isArray(requiredPerms)) {
        return requiredPerms.some((p) => hasPermission(p));
      }
      return hasPermission(requiredPerms);
    },
    [role, hasPermission]
  );

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isManager = role === 'MANAGER';
  const isAgent = role === 'SALES_AGENT' || role === 'SENIOR_AGENT';

  return (
    <RBACContext.Provider
      value={{
        user,
        role,
        permissions,
        loading,
        hasPermission,
        canAccessRoute,
        refreshPermissions: fetchAuthUser,
        isSuperAdmin,
        isAdmin,
        isManager,
        isAgent,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}

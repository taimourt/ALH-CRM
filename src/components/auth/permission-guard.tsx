'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useRBAC } from '@/contexts/rbac-context';
import { PermissionString } from '@/lib/rbac';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PermissionGuardProps {
  permission?: PermissionString | PermissionString[];
  moduleName?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  moduleName = 'this section',
  fallback,
  children,
}: PermissionGuardProps) {
  const { hasPermission, role, loading, isSuperAdmin } = useRBAC();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
        Verifying security permissions...
      </div>
    );
  }

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (!permission) {
    return <>{children}</>;
  }

  const isAuthorized = Array.isArray(permission)
    ? permission.some((p) => hasPermission(p))
    : hasPermission(permission);

  if (!isAuthorized) {
    if (fallback) return <>{fallback}</>;

    const requiredStr = Array.isArray(permission) ? permission.join(' or ') : permission;

    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 animate-in fade-in duration-200">
        <Card className="max-w-md w-full p-6 text-center space-y-4 border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/10">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Access Restricted (403 Forbidden)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your account does not have permission to access <strong>{moduleName}</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Your Current Role:</span>
              <Badge variant="purple" className="text-[10px] uppercase font-bold">
                {role.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Required Permission:</span>
              <span className="font-mono text-[10px] text-rose-600 font-bold">{requiredStr}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-2">
            <Link href="/leads">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to My Work (Leads)
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

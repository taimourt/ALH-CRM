'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/leads?tab=buyers');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
      Loading Contacts & Verified Buyers Hub...
    </div>
  );
}

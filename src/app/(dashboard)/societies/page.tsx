'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SocietiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/properties?tab=societies');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
      Loading Society Master Projects Hub...
    </div>
  );
}

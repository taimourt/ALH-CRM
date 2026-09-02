'use client';

import React from 'react';
import { Megaphone, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/lib/utils';

export default function MarketingPage() {
  const campaigns = [
    { id: '1', name: 'Facebook DHA Phase 8 Plot Campaign', channel: 'Facebook Ads', spend: 120000, leads: 18, costPerLead: 'PKR 6,666', status: 'ACTIVE' },
    { id: '2', name: 'Zameen Featured Listing Banner', channel: 'Zameen.com', spend: 85000, leads: 12, costPerLead: 'PKR 7,083', status: 'ACTIVE' },
    { id: '3', name: 'Park View City Installments Campaign', channel: 'Instagram Ads', spend: 60000, leads: 9, costPerLead: 'PKR 6,666', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-brand-600" /> Marketing & Lead Campaigns
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ad campaign attribution, spend analytics, and lead acquisition costs.
        </p>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5">Campaign Name</th>
              <th className="p-3.5">Ad Channel</th>
              <th className="p-3.5">Ad Spend</th>
              <th className="p-3.5">Leads Generated</th>
              <th className="p-3.5">Cost Per Lead</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{c.name}</td>
                <td className="p-3.5">
                  <Badge variant="purple">{c.channel}</Badge>
                </td>
                <td className="p-3.5 font-semibold">{formatPKR(c.spend)}</td>
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{c.leads} Leads</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{c.costPerLead}</td>
                <td className="p-3.5">
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'outline'}>{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

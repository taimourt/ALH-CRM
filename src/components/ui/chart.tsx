'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export interface RevenueChartProps {
  data?: { month: string; sales: number; token: number }[];
}

const DEFAULT_REVENUE_DATA = [
  { month: 'Jan', sales: 12.5, token: 1.2 },
  { month: 'Feb', sales: 18.0, token: 2.1 },
  { month: 'Mar', sales: 15.4, token: 1.8 },
  { month: 'Apr', sales: 24.5, token: 3.2 },
  { month: 'May', sales: 28.0, token: 3.8 },
  { month: 'Jun', sales: 34.0, token: 4.5 },
];

export function RevenueChart({ data = DEFAULT_REVENUE_DATA }: RevenueChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="M" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            name="Sales (PKR Crore)"
            stroke="#22c55e"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#salesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface LeadFunnelChartProps {
  data?: { stage: string; count: number }[];
}

export function LeadFunnelChart({ data }: LeadFunnelChartProps) {
  const defaultFunnelData = [
    { stage: 'New Leads', count: 12 },
    { stage: 'Contacted', count: 8 },
    { stage: 'Qualified', count: 6 },
    { stage: 'Site Visit', count: 4 },
    { stage: 'Token Paid', count: 3 },
    { stage: 'Closed Won', count: 2 },
  ];

  const funnelData = data && data.length > 0 ? data : defaultFunnelData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" name="Leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface LeadSourceItem {
  source: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  closed: number;
  conversionRate: number;
  salesVolume: number;
}

export interface LeadSourceChartProps {
  data: LeadSourceItem[];
}

export function LeadSourceDonutChart({ data }: LeadSourceChartProps) {
  const chartData = data.filter((d) => d.count > 0);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-slate-400 text-xs">
        No lead source data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value} Leads (${item?.payload?.percentage || 0}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

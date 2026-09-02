'use client';

import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Plus,
  MapPin,
  User,
  Clock,
  CheckCircle,
  MessageSquare,
  Flame,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { VisitFeedbackModal } from '@/components/site-visits/visit-feedback-modal';
import { formatDate } from '@/lib/utils';

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);

  async function fetchVisits() {
    setLoading(true);
    try {
      const res = await fetch(`/api/site-visits?status=${filterStatus}`);
      if (res.ok) setVisits(await res.json());
    } catch (err) {
      console.error('Fetch visits error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisits();
  }, [filterStatus]);

  const handleStatusChange = async (visitId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/site-visits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: visitId, status: newStatus }),
      });
      if (res.ok) fetchVisits();
    } catch (err) {
      console.error('Update visit status error:', err);
    }
  };

  const statusVariants: Record<string, 'purple' | 'success' | 'warning' | 'danger' | 'info'> = {
    SCHEDULED: 'purple',
    CONFIRMED: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger',
    NO_SHOW: 'warning',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-brand-600" /> Site Visit Manager & Feedback Collector
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule site inspections, track agent assignments, and collect client post-visit feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="ALL">All Visit Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </Select>
        </div>
      </div>

      {/* Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading && (
          <div className="col-span-full p-12 text-center text-xs text-slate-400">
            Loading site visits...
          </div>
        )}

        {!loading &&
          visits.map((v) => (
            <Card key={v.id} className="p-5 space-y-3 hover:border-brand-500/50 transition-all bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[v.status] || 'purple'}>
                    {v.status}
                  </Badge>
                  {v.interestLevel && (
                    <Badge variant={v.interestLevel === 'HOT' ? 'danger' : 'warning'} className="text-[10px]">
                      <Flame className="w-3 h-3 mr-1" /> {v.interestLevel} Interest
                    </Badge>
                  )}
                </div>

                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-brand-500" /> {formatDate(v.scheduledAt)}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Client: {v.lead?.name} ({v.lead?.phone})
                </h3>
                <p className="text-xs text-brand-600 font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {v.property?.title || '10 Marla Plot DHA Phase 8'}
                </p>
              </div>

              {/* Feedback box */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>
                  <strong>Assigned Agent:</strong> {v.agent?.name}
                </div>
                {v.customerFeedback && (
                  <div>
                    <strong>Customer Feedback:</strong> "{v.customerFeedback}"
                  </div>
                )}
                {v.nextAction && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                    <strong>Next Action:</strong> {v.nextAction}
                  </div>
                )}
              </div>

              {/* Status Update & Collect Feedback Trigger */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Select
                  value={v.status}
                  onChange={(e) => handleStatusChange(v.id, e.target.value)}
                  className="text-[11px] h-7 w-36 bg-transparent"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </Select>

                <Button
                  size="sm"
                  onClick={() => setSelectedVisit(v)}
                  className="text-xs gap-1 py-1 h-7 bg-brand-600 text-white font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Collect Feedback
                </Button>
              </div>
            </Card>
          ))}
      </div>

      {/* Collect Feedback Modal */}
      <VisitFeedbackModal
        visit={selectedVisit}
        isOpen={!!selectedVisit}
        onClose={() => setSelectedVisit(null)}
        onSuccess={fetchVisits}
      />
    </div>
  );
}

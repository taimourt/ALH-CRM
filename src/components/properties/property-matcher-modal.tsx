'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/lib/utils';

export interface PropertyMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
  onSelectProperty?: (property: any) => void;
}

export function PropertyMatcherModal({
  isOpen,
  onClose,
  lead,
  onSelectProperty,
}: PropertyMatcherModalProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      fetchMatches();
    }
  }, [isOpen, lead]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead?.id, preferences: lead }),
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Match error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Property Matcher Engine • ${lead?.name || 'Lead Preferences'}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Lead Preference Summary */}
        <Card className="p-3 bg-purple-950/20 border-purple-500/30 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-purple-400">
            <Sparkles className="w-4 h-4" /> Lead Criteria Filter
          </div>
          <div className="text-slate-300">
            Prefers <strong>{lead?.preferredSize || '10 Marla'}</strong> in{' '}
            <strong>{lead?.preferredSociety || 'DHA Phase 8'}</strong> • Max Budget:{' '}
            <strong className="text-emerald-400">{formatPKR(lead?.budgetMax || 20000000)}</strong>
          </div>
        </Card>

        {loading && (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            Calculating inventory match scores for client requirements...
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No active properties match the specified criteria.
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {matches.map((item, idx) => {
              const p = item.property;
              return (
                <Card
                  key={p.id || idx}
                  className="p-4 hover:border-brand-500/50 transition-all space-y-2 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {p.title}
                    </span>
                    <Badge
                      variant={item.score >= 80 ? 'success' : item.score >= 50 ? 'warning' : 'info'}
                      className="font-bold text-xs"
                    >
                      {item.score}% Match Score
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {p.society?.name || p.city} • Plot #{p.plotNumber || 'N/A'} • {p.size}{' '}
                      {p.sizeUnit}
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    Demand: {formatPKR(p.demandPrice)}
                  </div>

                  {/* Match reasons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Match Factors:
                    </div>
                    {item.reasons.map((reason: string, rIdx: number) => (
                      <div
                        key={rIdx}
                        className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {onSelectProperty && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelectProperty(p);
                          onClose();
                        }}
                        className="text-xs gap-1 py-1 h-7"
                      >
                        View & Recommend <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

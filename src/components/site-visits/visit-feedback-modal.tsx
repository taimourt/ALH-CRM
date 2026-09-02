'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Input, Select } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';

export interface VisitFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: any;
  onSuccess?: () => void;
}

export function VisitFeedbackModal({
  isOpen,
  onClose,
  visit,
  onSuccess,
}: VisitFeedbackModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState('COMPLETED');
  const [interestLevel, setInterestLevel] = useState('HOT');
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [nextAction, setNextAction] = useState('');

  useEffect(() => {
    if (visit) {
      setStatus(visit.status || 'COMPLETED');
      setInterestLevel(visit.interestLevel || 'HOT');
      setCustomerFeedback(visit.customerFeedback || '');
      setNextAction(visit.nextAction || '');
    }
  }, [visit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visit) return;

    setLoading(true);
    try {
      const res = await fetch('/api/site-visits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: visit.id,
          status,
          interestLevel,
          customerFeedback,
          nextAction,
        }),
      });

      if (res.ok) {
        toast('Feedback Recorded', `Updated site visit feedback for ${visit.lead?.name}.`, 'success');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast('Update Error', 'Could not save feedback.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Server connection failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Collect Visit Feedback • ${visit?.lead?.name || 'Client'}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <p className="text-slate-500">
          Property Target: <strong>{visit?.property?.title}</strong>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Visit Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </Select>

          <Select
            label="Client Interest Level *"
            value={interestLevel}
            onChange={(e) => setInterestLevel(e.target.value)}
          >
            <option value="HOT">Hot (Ready to Token)</option>
            <option value="WARM">Warm (Evaluating Options)</option>
            <option value="COLD">Cold (Not Interested)</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Customer Feedback Notes *
          </label>
          <textarea
            rows={3}
            value={customerFeedback}
            onChange={(e) => setCustomerFeedback(e.target.value)}
            placeholder="e.g. Client loved plot dimensions and frontage. Requested seller discount meeting."
            className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <Input
          label="Recommended Next Action *"
          placeholder="e.g. Schedule negotiation meeting with seller for Tuesday 4 PM."
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} className="bg-brand-600 text-white font-semibold">
            Save Visit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
}

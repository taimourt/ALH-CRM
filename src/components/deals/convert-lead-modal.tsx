'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Input, Select } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { formatPKR } from '@/lib/utils';

export interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
  onSuccess?: () => void;
}

export function ConvertLeadModal({
  isOpen,
  onClose,
  lead,
  onSuccess,
}: ConvertLeadModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [agreedAmount, setAgreedAmount] = useState('18500000');
  const [tokenAmount, setTokenAmount] = useState('500000');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableProperties();
    }
  }, [isOpen]);

  const fetchAvailableProperties = async () => {
    try {
      const res = await fetch('/api/properties?status=AVAILABLE');
      if (res.ok) {
        const data = await res.json();
        const props = data.properties || [];
        setProperties(props);
        if (props.length > 0) {
          setSelectedPropertyId(props[0].id);
          setAgreedAmount(props[0].demandPrice.toString());
        }
      }
    } catch (err) {
      console.error('Fetch available properties error:', err);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !selectedPropertyId) {
      toast('Selection Required', 'Please select a target property.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          amount: agreedAmount,
          tokenAmount,
        }),
      });

      if (res.ok) {
        toast('Lead Converted to Deal!', `Successfully converted ${lead.name} into an active Deal.`, 'success');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast('Conversion Error', 'Could not convert lead to deal.', 'error');
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
      title={`Convert Lead to Deal • ${lead?.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleConvert} className="space-y-4 text-xs">
        <p className="text-slate-500">
          Converting this lead will create an active Deal record and customer profile in the pipeline.
        </p>

        <Select
          label="Target Property *"
          value={selectedPropertyId}
          onChange={(e) => {
            setSelectedPropertyId(e.target.value);
            const found = properties.find((p) => p.id === e.target.value);
            if (found) setAgreedAmount(found.demandPrice.toString());
          }}
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.size} {p.sizeUnit}) — {formatPKR(p.demandPrice)}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Agreed Deal Amount (PKR) *"
            type="number"
            value={agreedAmount}
            onChange={(e) => setAgreedAmount(e.target.value)}
          />

          <Input
            label="Token Money Paid (PKR)"
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} className="bg-brand-600 text-white font-semibold">
            Convert Lead to Active Deal
          </Button>
        </div>
      </form>
    </Modal>
  );
}

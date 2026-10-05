'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { submitWebsiteLead, extractUTMParameters } from '@/lib/lead-service';
import { trackEvent } from '@/lib/analytics';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export type LeadModalMode =
  | 'EXACT_PRICE'
  | 'CHECK_AVAILABILITY'
  | 'FIND_SIMILAR'
  | 'BOOK_SITE_VISIT'
  | 'TALK_AGENT'
  | 'INVESTMENT_ANALYSIS'
  | 'PAYMENT_PLAN'
  | 'WHATSAPP_DETAILS';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: LeadModalMode;
  propertyTitle?: string;
  propertyId?: string;
  societyName?: string;
  societySlug?: string;
  price?: number;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  mode,
  propertyTitle,
  propertyId,
  societyName,
  societySlug,
  price,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const modeTitles: Record<LeadModalMode, string> = {
    EXACT_PRICE: 'Request Exact Real Rate & Title Status',
    CHECK_AVAILABILITY: 'Check Plot Inventory Availability',
    FIND_SIMILAR: 'Find Similar Off-Market Properties',
    BOOK_SITE_VISIT: 'Schedule Site Inspection Visit',
    TALK_AGENT: 'Connect with Principal Advisor',
    INVESTMENT_ANALYSIS: 'Request Custom Investment Report',
    PAYMENT_PLAN: 'Receive Verified Installment Schedule',
    WHATSAPP_DETAILS: 'Get WhatsApp Property Blueprint',
  };

  const modeDescriptions: Record<LeadModalMode, string> = {
    EXACT_PRICE: `Request unlisted transaction price and Registry deed verification for ${propertyTitle || societyName || 'this property'}.`,
    CHECK_AVAILABILITY: `Confirm immediate availability and plot allocation status for ${propertyTitle || societyName}.`,
    FIND_SIMILAR: `Receive 3 alternative plot options in ${societyName || 'Wah Cantt / Islamabad'} matching this price point.`,
    BOOK_SITE_VISIT: `Book an in-person site inspection with our civil engineering desk in Wah Cantt.`,
    TALK_AGENT: `Speak directly with Managing Director Asad Ali regarding high-value land acquisition.`,
    INVESTMENT_ANALYSIS: `Get a 3-year projected capital gains and rental yield assessment report.`,
    PAYMENT_PLAN: `Get official breakdown of down payment, monthly installments, and transfer fee schedule.`,
    WHATSAPP_DETAILS: `Receive complete high-resolution map, plot photos, and title documents on WhatsApp.`,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const utm = extractUTMParameters();

    try {
      await submitWebsiteLead({
        name,
        phone,
        email,
        requirement: modeTitles[mode],
        propertyId,
        societyId: societySlug,
        budget: price,
        notes: `${modeDescriptions[mode]} | Additional Notes: ${notes}`,
        ...utm,
      });

      trackEvent('lead_created', {
        mode,
        propertyTitle,
        societyName,
        price,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
      alert('Unable to submit request. Please try contacting via WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title={modeTitles[mode] || 'Property Enquiry'}>
      {isSuccess ? (
        <div className="text-center py-6">
          <CheckCircle2 className="w-12 h-12 text-[#000000] mx-auto mb-3" />
          <h3 className="text-base font-bold uppercase text-[#000000] font-mono mb-2">
            Inquiry Registered
          </h3>
          <p className="text-xs text-[#666666] font-sans leading-relaxed mb-6">
            Your request for <strong className="text-[#000000]">{propertyTitle || societyName || 'real estate'}</strong> has been assigned to our Wah Cantt advisory desk. Our team will reach out via WhatsApp/Phone shortly.
          </p>
          <Button onClick={handleReset} variant="primary" size="sm" className="w-full">
            Close & Return
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <p className="text-xs text-[#666666] leading-relaxed mb-2 font-mono">
            {modeDescriptions[mode]}
          </p>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ch. Muhammad Akram"
              className="w-full border border-[#000000] p-3 text-xs text-[#000000] rounded-none focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 321 8004186"
              className="w-full border border-[#000000] p-3 text-xs text-[#000000] rounded-none focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="akram@example.com"
              className="w-full border border-[#000000] p-3 text-xs text-[#000000] rounded-none focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
              Specific Instructions / Questions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify preferred plot location, installment requirements, or timeline..."
              className="w-full border border-[#000000] p-3 text-xs text-[#000000] rounded-none focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Request...' : modeTitles[mode]}
          </Button>

          <div className="text-center pt-2">
            <a
              href={`https://wa.me/923218004186?text=${encodeURIComponent(
                `Hello Asad Land Holdings, I am requesting details for: ${propertyTitle || societyName || 'Property Enquiry'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#666666] hover:text-[#000000]"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Or Connect via WhatsApp Directly
            </a>
          </div>
        </form>
      )}
    </Modal>
  );
};

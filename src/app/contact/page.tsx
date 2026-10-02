'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Button } from '@/components/website/Button';
import { SignatureAccent } from '@/components/website/SignatureAccent';
import { MapPin, Phone, Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const whatsappUrl = 'https://wa.me/923005123456?text=Hello%20Asad%20Land%20Holdings,%20I%20am%20reaching%20out%20from%20the%20contact%20page.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Contact & Head Office' }]} />

      <SectionHeading
        eyebrow="Direct Communication Desk"
        title="Contact Asad Land Holdings"
        subtitle="Visit our Wah Cantt head office on Main GT Road or send a direct inquiry to our principal investment advisors."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="border border-[#000000] p-8 bg-[#FEFEFE]">
            <h2 className="text-xl font-bold uppercase text-[#000000] font-mono mb-6 pb-3 border-b border-[#E5E5E5]">
              Property & Advisory Inquiry Form
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#F4F4F4] border border-[#000000] text-center my-6">
                <CheckCircle2 className="w-12 h-12 text-[#000000] mx-auto mb-4" />
                <h3 className="text-lg font-bold uppercase text-[#000000] font-mono mb-2">
                  Inquiry Received Successfully
                </h3>
                <p className="text-xs text-[#666666] font-sans max-w-md mx-auto leading-relaxed">
                  Thank you for contacting Asad Land Holdings. Principal Managing Director Asad Ali will review your request and connect via WhatsApp/Phone within 2 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="primary" size="sm" className="mt-6">
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase text-[#666666] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ch. Muhammad Akram"
                      className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#666666] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 5123456"
                      className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase text-[#666666] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="akram@example.com"
                      className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#666666] mb-1">Inquiry Service</label>
                    <select className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none">
                      <option>Plot Purchase (Wah Cantt / B-17 / Faisal Hills)</option>
                      <option>Plot Sale / Market Valuation Assessment</option>
                      <option>Turnkey Villa Construction Inquiry</option>
                      <option>Commercial Property & Rental Yield</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#666666] mb-1">Inquiry Details / Preferred Society</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify plot size (e.g. 10 Marla in Kohistan Enclave Block A), budget horizon, or construction timeline..."
                    className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none font-sans"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Submit Direct Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Head Office Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#000000] p-6 bg-[#FEFEFE] font-mono text-xs">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#000000] mb-4 pb-2 border-b border-[#E5E5E5]">
              Wah Cantt Head Office Location
            </h3>

            <ul className="space-y-4 text-[#444444]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#000000] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#000000] block">Main Office Address:</strong>
                  <span>Main GT Road, Near Kohistan Enclave Gate, Wah Cantt, Punjab 47040</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#000000] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#000000] block">Phone Direct Line:</strong>
                  <a href="tel:+923005123456" className="hover:underline">+92 300 5123456</a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#000000] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#000000] block">Official Email:</strong>
                  <a href="mailto:info@asadlandholdings.com" className="hover:underline">info@asadlandholdings.com</a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#000000] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#000000] block">Office Hours:</strong>
                  <span>Mon – Sat: 09:00 AM – 07:00 PM (Sunday Closed)</span>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 bg-[#000000] text-[#FEFEFE] font-bold uppercase tracking-wider text-xs"
              >
                <MessageSquare className="w-4 h-4 fill-[#FEFEFE]" /> Instant WhatsApp Hotline
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#F4F4F4] border border-[#E5E5E5]">
            <SignatureAccent name="Asad Ali" title="Real Estate on Real Rates" />
          </div>
        </div>
      </div>
    </div>
  );
}

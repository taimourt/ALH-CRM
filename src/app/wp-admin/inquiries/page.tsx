'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Filter,
} from 'lucide-react';

export default function WPAdminInquiriesPage() {
  const { inquiries, markInquiryStatus, deleteInquiry } = useCMS();
  const [currentTab, setCurrentTab] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (currentTab === 'unread' && inq.status !== 'unread') return false;
      if (currentTab === 'read' && inq.status !== 'read') return false;
      if (currentTab === 'replied' && inq.status !== 'replied') return false;
      return true;
    });
  }, [inquiries, currentTab]);

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'replied') => {
    await markInquiryStatus(id, status);
    setNotice(`Inquiry status changed to ${status}.`);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete inquiry from ${name}?`)) {
      await deleteInquiry(id);
      setNotice(`Inquiry from ${name} deleted.`);
      setTimeout(() => setNotice(null), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <h1 className="text-2xl font-normal text-[#1d2327]">Website Inquiries & Leads</h1>
        <div className="text-xs text-[#646970]">
          Total Leads: <strong className="text-[#1d2327]">{inquiries.length}</strong>
        </div>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs text-[#646970]">
        <button
          onClick={() => setCurrentTab('all')}
          className={`hover:text-[#2271b1] ${
            currentTab === 'all' ? 'text-[#1d2327] font-bold' : ''
          }`}
        >
          All ({inquiries.length})
        </button>
        <span>|</span>
        <button
          onClick={() => setCurrentTab('unread')}
          className={`hover:text-[#2271b1] ${
            currentTab === 'unread' ? 'text-[#1d2327] font-bold text-[#d63638]' : ''
          }`}
        >
          Unread ({inquiries.filter((i) => i.status === 'unread').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setCurrentTab('read')}
          className={`hover:text-[#2271b1] ${
            currentTab === 'read' ? 'text-[#1d2327] font-bold' : ''
          }`}
        >
          Read ({inquiries.filter((i) => i.status === 'read').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setCurrentTab('replied')}
          className={`hover:text-[#2271b1] ${
            currentTab === 'replied' ? 'text-[#1d2327] font-bold text-[#00a32a]' : ''
          }`}
        >
          Replied ({inquiries.filter((i) => i.status === 'replied').length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327]">
              <th className="p-3 font-semibold">Lead Contact</th>
              <th className="p-3 font-semibold">Subject & Message</th>
              <th className="p-3 font-semibold">Related Property / Source</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#646970]">
                  No inquiries found in this view.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => {
                const cleanPhone = inq.phone.replace(/[^0-9+]/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                  `Hello ${inq.name}, thank you for contacting Asad Land Holdings regarding "${inq.subject}". How can we assist you today?`
                )}`;

                return (
                  <tr
                    key={inq.id}
                    className={`hover:bg-[#f6f7f7] transition-colors ${
                      inq.status === 'unread' ? 'bg-[#fcf8e3]/40 font-medium' : ''
                    }`}
                  >
                    <td className="p-3 text-[#1d2327]">
                      <div className="font-bold text-sm">{inq.name}</div>
                      <div className="text-[11px] text-[#2271b1] font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {inq.phone}
                      </div>
                      {inq.email && (
                        <div className="text-[11px] text-[#646970] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {inq.email}
                        </div>
                      )}
                    </td>

                    <td className="p-3 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-[#1d2327]">{inq.subject}</div>
                      <p className="text-[#646970] text-xs mt-1 whitespace-pre-wrap">{inq.message}</p>
                    </td>

                    <td className="p-3 text-[#2c3338]">
                      {inq.propertyTitle ? (
                        <div className="text-[#2271b1] font-semibold">
                          {inq.propertyTitle}
                        </div>
                      ) : (
                        <span className="text-[#646970] italic">General Inquiry</span>
                      )}
                      <div className="text-[10px] text-[#646970] uppercase mt-0.5">
                        Source: {inq.source.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="p-3">
                      {inq.status === 'unread' && (
                        <span className="inline-flex items-center gap-1 text-[#d63638] font-bold bg-[#fbeaea] px-2 py-0.5 rounded">
                          Unread
                        </span>
                      )}
                      {inq.status === 'read' && (
                        <span className="inline-flex items-center gap-1 text-[#646970] bg-[#f0f0f1] px-2 py-0.5 rounded">
                          Read
                        </span>
                      )}
                      {inq.status === 'replied' && (
                        <span className="inline-flex items-center gap-1 text-[#00a32a] font-bold bg-[#e7f7ed] px-2 py-0.5 rounded">
                          Replied
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-[#646970] whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}{' '}
                      <span className="text-[10px]">{new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap space-x-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => markInquiryStatus(inq.id, 'replied')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25d366] text-white rounded font-semibold text-xs hover:bg-[#20bd5a] transition-colors"
                        title="Open WhatsApp chat with prefilled message"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Reply WhatsApp
                      </a>

                      {inq.status === 'unread' ? (
                        <button
                          onClick={() => handleStatusChange(inq.id, 'read')}
                          className="text-[#2271b1] hover:underline"
                        >
                          Mark Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(inq.id, 'unread')}
                          className="text-[#646970] hover:underline"
                        >
                          Mark Unread
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(inq.id, inq.name)}
                        className="text-[#d63638] hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

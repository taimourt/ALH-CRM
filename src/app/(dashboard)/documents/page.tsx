'use client';

import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  Download,
  ShieldCheck,
  MapPin,
  FileCheck,
  Eye,
  Plus,
  Search,
  Printer,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers,
  Upload,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';

export default function DocumentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'MAPS' | 'TEMPLATES' | 'KYC'>('MAPS');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // New Document Upload State
  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'SOCIETY_MAP',
    society: 'Kohistan Enclave',
    fileSize: '3.5 MB',
  });

  const societyMaps = [
    {
      id: 'm1',
      title: 'Kohistan Enclave Sector B & Executive Block Master Layout Map.pdf',
      society: 'Kohistan Enclave',
      category: 'Master Layout Plan',
      authority: 'TMA & RDA Approved',
      size: '5.4 MB',
      date: 'Aug 28, 2026',
      downloadUrl: '#',
      description: 'High-definition vectorized layout map showing residential 5, 10 Marla & 1 Kanal plot demarcations.',
    },
    {
      id: 'm2',
      title: 'New City Paradise 250ft Main Boulevard & Commercial Broadway Map.pdf',
      society: 'New City Paradise',
      category: 'Commercial Master Plan',
      authority: 'PHATA Approved',
      size: '6.8 MB',
      date: 'Aug 24, 2026',
      downloadUrl: '#',
      description: 'Master plan highlighting 4-Lane Motorway Interchange access and waterfront commercial boulevard.',
    },
    {
      id: 'm3',
      title: 'DHA Islamabad Phase 2 Sector J & Giga Mall Corridor Map.pdf',
      society: 'DHA Phase 2',
      category: 'Sector Demarcation',
      authority: 'Defence Housing Authority',
      size: '4.2 MB',
      date: 'Aug 15, 2026',
      downloadUrl: '#',
      description: 'Complete sector map showing developed streets, parks, mosques, and commercial hub.',
    },
    {
      id: 'm4',
      title: 'Official RDA NOC Approval Notification - Kohistan Enclave.pdf',
      society: 'Kohistan Enclave',
      category: 'Government NOC Dossier',
      authority: 'Rawalpindi Development Authority',
      size: '2.1 MB',
      date: 'Jul 30, 2026',
      downloadUrl: '#',
      description: 'Official verified NOC letter issued by RDA confirming full layout and utility clearance.',
    },
  ];

  const legalTemplates = [
    {
      id: 't1',
      title: 'Real Estate Token Money Agreement & Booking Contract Form',
      type: 'Stamp Paper Agreement',
      usage: 'Used when buyer pays initial token / down payment for plot reservation.',
      content: `AGREEMENT FOR ADVANCE TOKEN MONEY

This agreement is executed on this ______ day of ____________, 2026 at Islamabad, by and between:
FIRST PARTY (Seller/Agency): ASAD LAND HOLDINGS (Authorized Sales Partner)
SECOND PARTY (Purchaser): Mr./Ms. ____________________, CNIC: __________________

WHEREAS the First Party has agreed to sell and the Second Party has agreed to purchase the following property:
1. Property Description: Plot No. _______, Block _______, Sector _______
2. Housing Society: ____________________
3. Plot Size: _________ Marla / Kanal
4. Total Agreed Price: PKR __________________
5. Token / Advance Received: PKR __________________ (Paid via Cheque/Online: ______________)
6. Balance Payment Due Date: __________________

TERMS & CONDITIONS:
1. If the buyer fails to pay the balance installment within the stipulated date, the token money shall be forfeited as per standard real estate rules.
2. The seller guarantees clear legal title and no encumbrances.

Signatures:
First Party (Seller/Agency): _______________    Second Party (Buyer): _______________
Witness 1: ___________________                 Witness 2: ___________________`,
    },
    {
      id: 't2',
      title: 'Plot File Transfer Undertaking & Indemnity Bond',
      type: 'Society Transfer Affidavit',
      usage: 'Legal affidavit submitted to society management during plot ownership transfer.',
      content: `UNDERTAKING & INDEMNITY BOND FOR PLOT TRANSFER

I, _________________________, S/O _________________________, 
CNIC No. _________________________, Resident of _____________________________________________
do hereby solemnly affirm and declare on oath as under:

1. That I am the lawful allottee/transferee of Plot No. _______, Block _______, measuring _______ Marla in ____________________.
2. That I have transferred all ownership rights, title, and interest of the said property in favor of _________________________, CNIC _________________________.
3. That no dispute, litigation, or court stay order exists against the said plot.
4. That I indemnify the Society Management and Asad Land Holdings against any future third-party claims.

Deponent: _______________________
CNIC: __________________________
Date: __________________________`,
    },
    {
      id: 't3',
      title: 'Physical Possession Handover & Demarcation Certificate',
      type: 'Possession Certificate',
      usage: 'Signed upon physical site inspection and boundary pillar handover to the buyer.',
      content: `POSSESSION & DEMARCATION HANDOVER CERTIFICATE

Date: ___________________
Property: Plot # ________, Block ________, ____________________

We hereby certify that physical possession and demarcation boundary pillars of the above-mentioned plot have been inspected and handed over to the purchaser:

Purchaser Name: __________________________
CNIC: ___________________________________
Inspected By (ALH Officer): _________________

All utilities (Electricity line, Sui Gas, Water Connection, Road Access) have been verified in operational condition.

Buyer Signature: _______________________   Officer Signature: _______________________`,
    },
  ];

  const clientKycDocs = [
    {
      id: 'k1',
      clientName: 'Hassan Raza',
      cnic: '37405-1234567-1',
      property: 'Kohistan Enclave Sector B Plot 104',
      docType: 'NADRA CNIC Verified Copy.pdf',
      status: 'VERIFIED',
      date: 'Aug 20, 2026',
    },
    {
      id: 'k2',
      clientName: 'Chaudhry Nisar',
      cnic: '37405-9988776-5',
      property: 'New City Paradise Commercial 5 Marla',
      docType: 'FBR Tax Filer Certificate & CNIC.pdf',
      status: 'VERIFIED',
      date: 'Aug 22, 2026',
    },
    {
      id: 'k3',
      clientName: 'Major (R) Tariq Mehmood',
      cnic: '61101-4455667-3',
      property: 'DHA Phase 2 Sector J Plot 55',
      docType: 'Nominee / Next of Kin Affidavit.pdf',
      status: 'PENDING_DOCS',
      date: 'Aug 25, 2026',
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) {
      toast('Required', 'Please enter document title.', 'error');
      return;
    }
    toast('Document Registered', `Added "${newDoc.name}" to the legal vault.`, 'success');
    setUploadModalOpen(false);
    setNewDoc({ name: '', category: 'SOCIETY_MAP', society: 'Kohistan Enclave', fileSize: '3.5 MB' });
  };

  const handlePrintTemplate = (template: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${template.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 30px; }
              .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #059669; }
              .subtitle { font-size: 12px; color: #666; margin-top: 5px; }
              pre { font-family: Arial, sans-serif; white-space: pre-wrap; font-size: 14px; line-height: 1.8; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">ASAD LAND HOLDINGS</div>
              <div class="subtitle">Official Real Estate Legal Documentation & Forms Repository</div>
            </div>
            <pre>${template.content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderArchive className="w-6 h-6 text-brand-600" /> Documents & Society Legal Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 border border-brand-500/20">
              Approved Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central repository for RDA/CDA approved society layout maps, stamp paper agreements, client KYC files, and transfer affidavits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> + Register New Document
          </Button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Tab 1: Society Maps */}
          <button
            onClick={() => setActiveTab('MAPS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'MAPS'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Master Society Maps & NOCs</span>
            <Badge variant="info" className="text-[10px] px-1.5 py-0 h-4">
              {societyMaps.length} Files
            </Badge>
          </button>

          {/* Tab 2: Legal Templates */}
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'TEMPLATES'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Stamp Paper & Legal Templates</span>
            <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
              {legalTemplates.length} Forms
            </Badge>
          </button>

          {/* Tab 3: Client KYC */}
          <button
            onClick={() => setActiveTab('KYC')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'KYC'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Client KYC & Allotments</span>
            <Badge variant="purple" className="text-[10px] px-1.5 py-0 h-4">
              {clientKycDocs.length} Verified
            </Badge>
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-64 px-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, society..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-brand-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🗺️ TAB 1: SOCIETY MASTER LAYOUT MAPS & NOCs */}
      {/* ========================================================================= */}
      {activeTab === 'MAPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {societyMaps
            .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()) || m.society.toLowerCase().includes(search.toLowerCase()))
            .map((map) => (
              <Card key={map.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-brand-500/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <Badge variant="purple" className="text-[10px]">
                          {map.society}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">{map.size}</span>
                      </div>
                    </div>
                    <Badge variant="success">{map.authority}</Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{map.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{map.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Verified: {map.date}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast('Opening Master Layout', `Loading high-resolution map for ${map.society}...`, 'info');
                      }}
                      className="gap-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-600" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        toast('Download Started', `Downloading ${map.title}...`, 'success');
                      }}
                      className="bg-brand-600 hover:bg-brand-500 text-white gap-1 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Map
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📑 TAB 2: LEGAL TEMPLATES & STAMP PAPERS */}
      {/* ========================================================================= */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-800/40">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Standard Pakistani Real Estate Legal Contract Templates
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Ready-to-print legal drafts for advance token money, plot transfer undertakings, and demarcation certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {legalTemplates
              .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase()))
              .map((template) => (
                <Card key={template.id} className="p-5 space-y-3 border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">{template.type}</Badge>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{template.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{template.usage}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDoc(template)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-600" /> View Form Draft
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePrintTemplate(template)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs font-semibold"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Legal Form
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 max-h-24 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                    <pre className="whitespace-pre-wrap">{template.content.slice(0, 300)}...</pre>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🗂️ TAB 3: CLIENT KYC & ALLOTMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'KYC' && (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Buyer Full Name</th>
                <th className="p-3.5">NADRA CNIC</th>
                <th className="p-3.5">Associated Property Allotment</th>
                <th className="p-3.5">KYC Document File</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clientKycDocs
                .filter((k) => k.clientName.toLowerCase().includes(search.toLowerCase()) || k.cnic.includes(search) || k.property.toLowerCase().includes(search.toLowerCase()))
                .map((kyc) => (
                  <tr key={kyc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{kyc.clientName}</td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">{kyc.cnic}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">🏡 {kyc.property}</td>
                    <td className="p-3.5 font-mono text-brand-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> {kyc.docType}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={kyc.status === 'VERIFIED' ? 'success' : 'warning'}>
                        {kyc.status === 'VERIFIED' ? '✅ Verified CNIC' : '⏳ Pending Copy'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast('KYC Document', `Opening ${kyc.docType}...`, 'info');
                        }}
                        className="gap-1 text-[11px] h-7"
                      >
                        <Download className="w-3 h-3" /> View KYC
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* ➕ MODAL: REGISTER NEW DOCUMENT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Register Legal Document in Vault"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <Input
            label="Document Title *"
            required
            value={newDoc.name}
            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
            placeholder="e.g. Kohistan Enclave Sector C Master Map.pdf"
          />

          <Select
            label="Document Category"
            value={newDoc.category}
            onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
          >
            <option value="SOCIETY_MAP">Master Society Layout Map</option>
            <option value="NOC_CERTIFICATE">Government NOC Approval Certificate</option>
            <option value="LEGAL_AFFIDAVIT">Stamp Paper Legal Form</option>
            <option value="CLIENT_KYC">Client CNIC / KYC Verification</option>
          </Select>

          <Select
            label="Associated Housing Scheme"
            value={newDoc.society}
            onChange={(e) => setNewDoc({ ...newDoc, society: e.target.value })}
          >
            <option value="Kohistan Enclave">Kohistan Enclave</option>
            <option value="New City Paradise">New City Paradise</option>
            <option value="DHA Phase 2">DHA Phase 2</option>
            <option value="Bahria Town Phase 8">Bahria Town Phase 8</option>
          </Select>

          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1 cursor-pointer hover:border-brand-500 transition-colors">
            <Upload className="w-6 h-6 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Choose PDF file or drag & drop</p>
            <p className="text-[11px] text-slate-400">PDF, PNG, JPG up to 25MB</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white font-semibold">
              Save to Legal Vault
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 📄 MODAL: PREVIEW LEGAL TEMPLATE */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || 'Legal Template'}
        maxWidth="lg"
      >
        {selectedDoc && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap leading-relaxed">{selectedDoc.content}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Asad Land Holdings Official Form</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedDoc(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => handlePrintTemplate(selectedDoc)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

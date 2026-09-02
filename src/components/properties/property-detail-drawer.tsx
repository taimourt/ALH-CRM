'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  FileText,
  Image as ImageIcon,
  User,
  Phone,
  DollarSign,
  Download,
  CheckCircle,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { SideDrawer } from '../ui/side-drawer';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs } from '../ui/tabs';
import { formatPKR, formatDate } from '@/lib/utils';

export interface PropertyDetailDrawerProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (property: any) => void;
}

export function PropertyDetailDrawer({
  property,
  isOpen,
  onClose,
  onEdit,
}: PropertyDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  if (!property) return null;

  // Parse gallery images JSON
  let gallery: string[] = [];
  try {
    gallery = property.galleryImages
      ? JSON.parse(property.galleryImages)
      : [property.images || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'];
  } catch (err) {
    gallery = [property.images || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'];
  }

  // Parse documents JSON
  let docs: any[] = [];
  try {
    docs = property.documents
      ? JSON.parse(property.documents)
      : [
          { name: `Allotment Letter Plot ${property.plotNumber || '142'}.pdf`, category: 'Allotment', size: '2.4 MB' },
          { name: `CNIC ${property.ownerName || 'Owner'} Copy.pdf`, category: 'KYC', size: '1.2 MB' },
        ];
  } catch (err) {
    docs = [
      { name: `Allotment Letter Plot ${property.plotNumber || '142'}.pdf`, category: 'Allotment', size: '2.4 MB' },
    ];
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'gallery', label: 'Image Gallery', icon: <ImageIcon className="w-4 h-4 text-purple-500" />, count: gallery.length },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4 text-brand-600" />, count: docs.length },
  ];

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={property.title}
      description={`Property ID: ${property.id.substring(0, 8)} • Plot #${property.plotNumber || 'N/A'}`}
      width="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="success">{property.status}</Badge>
              <Badge variant="purple">
                {property.size} {property.sizeUnit}
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-300">
                {property.propertyType?.replace('_', ' ')}
              </Badge>
            </div>

            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(property)}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Listing
              </Button>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-xs text-slate-400">Demand Price</div>
              <div className="text-2xl font-extrabold text-brand-400">
                {formatPKR(property.demandPrice)}
              </div>
            </div>

            {property.marketPrice && (
              <div className="text-right">
                <div className="text-xs text-slate-400">Market Price</div>
                <div className="text-sm font-semibold text-slate-300">
                  {formatPKR(property.marketPrice)}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tab Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Plot Location Details */}
            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" /> Location & Specifications
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Society:</span>{' '}
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {property.society?.name || property.city}
                  </strong>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Sector / Phase:</span>{' '}
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {property.sector || 'Phase 1'}
                  </strong>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Block Name:</span>{' '}
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {property.block || 'Block A'}
                  </strong>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Street Name:</span>{' '}
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {property.street || 'Street 12'}
                  </strong>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Plot #:</span>{' '}
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {property.plotNumber || '142'}
                  </strong>
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400">Commission Rate:</span>{' '}
                  <strong className="text-brand-600 block">{property.commissionRate}%</strong>
                </div>
              </div>
            </Card>

            {/* Owner & Agent Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-500" /> Property Owner Info
                </h4>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-slate-400">Owner Name:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {property.ownerName || 'Malik Zafar'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>{' '}
                    <strong className="font-mono">{property.ownerPhone || '03001112233'}</strong>
                  </div>
                </div>
              </Card>

              <Card className="p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-500" /> Assigned Agent
                </h4>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-slate-400">Agent Name:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {property.agent?.name || 'Hamza Chaudhry'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Agent Phone:</span>{' '}
                    <strong className="font-mono">{property.agent?.phone || '03339876543'}</strong>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Property Description
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {property.description ||
                  'Prime residential plot in high demand sector. Fully paid allotment file with NOC clear and ready for instant transfer.'}
              </p>
            </Card>
          </div>
        )}

        {/* TAB 2: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryImage(imgUrl)}
                  className="relative h-32 rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 group"
                >
                  <img
                    src={imgUrl}
                    alt={`Property view ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    Preview Fullsize
                  </div>
                </div>
              ))}
            </div>

            {/* Fullsize image preview lightbox modal */}
            {selectedGalleryImage && (
              <div
                className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
                onClick={() => setSelectedGalleryImage(null)}
              >
                <img
                  src={selectedGalleryImage}
                  alt="Full preview"
                  className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            {docs.map((doc, idx) => (
              <Card key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Category: {doc.category} • {doc.size}
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="gap-1 text-xs py-1 h-7">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SideDrawer>
  );
}

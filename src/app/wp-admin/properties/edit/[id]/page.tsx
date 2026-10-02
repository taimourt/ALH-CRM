'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import { CMSProperty } from '@/lib/cms-types';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Flame,
} from 'lucide-react';

export default function WPAdminEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { properties, updateProperty, deleteProperty } = useCMS();

  const existingProp = properties.find((p) => p.id === propertyId);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [society, setSociety] = useState('Kohistan Enclave');
  const [sectorBlock, setSectorBlock] = useState('Sector A');
  const [city, setCity] = useState('Wah Cantt');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<CMSProperty['propertyType']>('RESIDENTIAL_PLOT');
  const [sizeMarla, setSizeMarla] = useState(10);
  const [demandPrice, setDemandPrice] = useState(16500000);
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [image, setImage] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [nocStatus, setNocStatus] = useState('');
  const [devStatus, setDevStatus] = useState('');
  const [possessionStatus, setPossessionStatus] = useState<'AVAILABLE' | 'UPCOMING' | 'UNKNOWN'>('AVAILABLE');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHotInvestment, setIsHotInvestment] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (existingProp) {
      setTitle(existingProp.title);
      setSlug(existingProp.slug);
      setSociety(existingProp.society);
      setSectorBlock(existingProp.sectorBlock || '');
      setCity(existingProp.city);
      setLocation(existingProp.location);
      setPropertyType(existingProp.propertyType);
      setSizeMarla(existingProp.sizeMarla);
      setDemandPrice(existingProp.demandPrice);
      setDescription(existingProp.description);
      setFeaturesInput(existingProp.features.join(', '));
      setImage(existingProp.image);
      setGalleryInput(existingProp.gallery.join('\n'));
      setNocStatus(existingProp.nocStatus);
      setDevStatus(existingProp.devStatus);
      setPossessionStatus(existingProp.possessionStatus || 'AVAILABLE');
      setIsFeatured(!!existingProp.isFeatured);
      setIsHotInvestment(!!existingProp.isHotInvestment);
      setAgentName(existingProp.agentName || 'Asad Ali');
      setAgentPhone(existingProp.agentPhone || '+92 300 5123456');
      setStatus(existingProp.status);
    }
  }, [existingProp]);

  if (!existingProp) {
    return (
      <div className="p-8 text-center text-xs text-[#646970] bg-white rounded border border-[#c3c4c7]">
        Property listing not found. <Link href="/wp-admin/properties" className="text-[#2271b1] underline">Back to Listings</Link>
      </div>
    );
  }

  const handleUpdate = async (saveStatus?: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please enter a property title.');
      return;
    }

    setIsSaving(true);
    try {
      const targetStatus = saveStatus || status;
      const features = featuresInput
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const gallery = galleryInput
        .split('\n')
        .map((g) => g.trim())
        .filter(Boolean);

      await updateProperty(propertyId, {
        title,
        slug: slug.trim() || existingProp.slug,
        society,
        sectorBlock,
        city,
        location,
        propertyType,
        sizeMarla: Number(sizeMarla),
        sizeSqFt: Number(sizeMarla) * 225,
        demandPrice: Number(demandPrice),
        marketPrice: Number(demandPrice),
        pricePerSqFt: Math.round(Number(demandPrice) / (Number(sizeMarla) * 225)),
        pricePerMarla: Math.round(Number(demandPrice) / Number(sizeMarla)),
        description,
        features,
        image,
        gallery: gallery.length > 0 ? gallery : [image],
        nocStatus,
        devStatus,
        possessionStatus,
        isFeatured,
        isHotInvestment,
        agentName,
        agentPhone,
        status: targetStatus,
      });

      setStatus(targetStatus);
      setNotice('Property listing updated successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update listing.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Move listing "${title}" to trash?`)) {
      await deleteProperty(propertyId);
      router.push('/wp-admin/properties');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/wp-admin/properties"
            className="p-1.5 text-[#646970] hover:text-[#1d2327] hover:bg-[#dcdcde] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-normal text-[#1d2327]">Edit Property Listing</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/properties/${existingProp.slug}`}
            target="_blank"
            className="px-3 py-1.5 text-xs font-semibold text-[#2271b1] bg-white border border-[#2271b1] rounded hover:bg-[#f0f6fc] transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" /> View on Live Site
          </Link>
          <button
            type="button"
            onClick={() => handleUpdate()}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2271b1] border border-[#2271b1] rounded hover:bg-[#135e96] transition-colors"
          >
            {isSaving ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Main 2-Column Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1d2327] uppercase mb-1">Listing Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold px-3 py-2 bg-white border border-[#c3c4c7] rounded focus:border-[#2271b1] outline-none text-[#1d2327]"
              required
            />
          </div>

          {/* Slug */}
          <div className="text-xs text-[#646970] flex items-center gap-2 bg-white px-3 py-1.5 border border-[#dcdcde] rounded">
            <span>
              <strong>Permalink:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/properties/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="px-1.5 py-0.5 border border-[#c3c4c7] rounded text-xs font-mono text-[#2271b1] outline-none"
            />
          </div>

          {/* Pricing & Size Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase border-b border-[#f0f0f1] pb-2">
              Price & Dimension Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Demand Price (PKR)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={demandPrice}
                  onChange={(e) => setDemandPrice(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
                <span className="text-[11px] text-[#00a32a] font-semibold mt-1 block">
                  = PKR {(demandPrice / 100000).toFixed(1)} Lac ({(demandPrice / 10000000).toFixed(2)} Cr)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Size (in Marla)
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={sizeMarla}
                  onChange={(e) => setSizeMarla(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
                <span className="text-[11px] text-[#646970] mt-1 block">
                  ~{sizeMarla * 225} sq ft
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as CMSProperty['propertyType'])}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded bg-white"
                >
                  <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                  <option value="COMMERCIAL_PLOT">Commercial Plot</option>
                  <option value="HOUSE_VILLA">House / Villa</option>
                  <option value="PLAZA_BUILDING">Commercial Plaza</option>
                  <option value="APARTMENT">Apartment / Flat</option>
                  <option value="FARMHOUSE">Farmhouse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Society Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase border-b border-[#f0f0f1] pb-2">
              Society & Location Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Society Name</label>
                <input
                  type="text"
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Sector / Block / Plot #</label>
                <input
                  type="text"
                  value={sectorBlock}
                  onChange={(e) => setSectorBlock(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Street Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase border-b border-[#f0f0f1] pb-2">
              Description & Highlights
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                Bullet Features (Comma Separated)
              </label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>
          </div>

          {/* Media & Gallery Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-4">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase border-b border-[#f0f0f1] pb-2">
              Featured Image & Gallery URLs
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">Main Cover Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                Gallery Image URLs (One per line)
              </label>
              <textarea
                rows={3}
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                className="w-full p-2.5 text-xs font-mono border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Meta */}
        <div className="space-y-4">
          {/* Publish Meta Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Publish
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="px-2 py-1 border border-[#8c8f94] rounded bg-white text-xs font-semibold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Featured Listing:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span>Pin to Home</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Hot Deal:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHotInvestment}
                    onChange={(e) => setIsHotInvestment(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-[#d63638] font-bold">Hot Deal</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs text-[#d63638] hover:underline"
                >
                  Move to trash
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate()}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-[#2271b1] text-white font-semibold rounded hover:bg-[#135e96] transition-colors"
                >
                  {isSaving ? 'Updating...' : 'Update Listing'}
                </button>
              </div>
            </div>
          </div>

          {/* Legal & NOC */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Legal & Verification
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-[#646970] mb-1">NOC Approval Status</label>
                <input
                  type="text"
                  value={nocStatus}
                  onChange={(e) => setNocStatus(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Possession Status</label>
                <select
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value as 'AVAILABLE' | 'UPCOMING' | 'UNKNOWN')}
                  className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded bg-white"
                >
                  <option value="AVAILABLE">Immediate Possession Available</option>
                  <option value="UPCOMING">Upcoming Possession (Under 12 Mo)</option>
                  <option value="UNKNOWN">Future Development Phase</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assigned Agent */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Assigned Consultant
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Direct Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

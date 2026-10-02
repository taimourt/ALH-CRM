'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function WPAdminPropertiesPage() {
  const { properties, deleteProperty } = useCMS();
  const [currentTab, setCurrentTab] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSociety, setSelectedSociety] = useState<string>('ALL');
  const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const societies = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.society));
    return Array.from(set);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (currentTab === 'published' && p.status !== 'published') return false;
      if (currentTab === 'draft' && p.status !== 'draft') return false;
      if (selectedSociety !== 'ALL' && p.society !== selectedSociety) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.society.toLowerCase().includes(q) ||
          (p.sectorBlock && p.sectorBlock.toLowerCase().includes(q)) ||
          p.propertyType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [properties, currentTab, selectedSociety, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPropIds(filteredProperties.map((p) => p.id));
    } else {
      setSelectedPropIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPropIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete listing "${title}"?`)) {
      await deleteProperty(id);
      setNotice(`Listing "${title}" deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPropIds.length === 0) return;
    if (confirm(`Move ${selectedPropIds.length} listings to trash?`)) {
      for (const id of selectedPropIds) {
        await deleteProperty(id);
      }
      setSelectedPropIds([]);
      setNotice(`${selectedPropIds.length} listings deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Title & Add New Button */}
      <div className="flex items-center gap-3 border-b border-[#c3c4c7] pb-3">
        <h1 className="text-2xl font-normal text-[#1d2327]">Properties & Listings</h1>
        <Link
          href="/wp-admin/properties/new"
          className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] bg-white rounded hover:bg-[#2271b1] hover:text-white transition-colors"
        >
          Add New Listing
        </Link>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-[#646970]">
          <button
            onClick={() => setCurrentTab('all')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'all' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            All <span className="text-[#646970]">({properties.length})</span>
          </button>
          <span>|</span>
          <button
            onClick={() => setCurrentTab('published')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'published' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            Published{' '}
            <span className="text-[#646970]">
              ({properties.filter((p) => p.status === 'published').length})
            </span>
          </button>
          <span>|</span>
          <button
            onClick={() => setCurrentTab('draft')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'draft' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            Drafts{' '}
            <span className="text-[#646970]">
              ({properties.filter((p) => p.status === 'draft').length})
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1">
          <input
            type="search"
            placeholder="Search Properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-2.5 py-1 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 border border-[#c3c4c7] rounded flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value === 'delete') handleBulkDelete();
            }}
            defaultValue=""
            className="text-xs px-2 py-1 border border-[#8c8f94] rounded bg-white"
          >
            <option value="" disabled>Bulk actions</option>
            <option value="delete">Move to Trash</option>
          </select>
          <button
            onClick={handleBulkDelete}
            disabled={selectedPropIds.length === 0}
            className="px-2.5 py-1 bg-[#f6f7f7] border border-[#dcdcde] text-[#2c3338] rounded hover:bg-[#f0f0f1] disabled:opacity-40"
          >
            Apply
          </button>

          <select
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
            className="text-xs px-2 py-1 border border-[#8c8f94] rounded bg-white"
          >
            <option value="ALL">All Societies</option>
            {societies.map((soc) => (
              <option key={soc} value={soc}>{soc}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#646970]">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'listing' : 'listings'}
        </div>
      </div>

      {/* WordPress Table */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327]">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredProperties.length > 0 &&
                    selectedPropIds.length === filteredProperties.length
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="p-3 font-semibold w-16">Image</th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Society & Sector</th>
              <th className="p-3 font-semibold">Size</th>
              <th className="p-3 font-semibold">Demand Price</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#646970]">
                  No property listings found. <Link href="/wp-admin/properties/new" className="text-[#2271b1] underline">Add a listing now</Link>.
                </td>
              </tr>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = selectedPropIds.includes(prop.id);

                return (
                  <tr
                    key={prop.id}
                    className={`hover:bg-[#f6f7f7] group transition-colors ${
                      isSelected ? 'bg-[#f0f6fc]' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(prop.id)}
                        className="rounded"
                      />
                    </td>

                    <td className="p-3">
                      <div className="w-12 h-9 bg-slate-200 rounded overflow-hidden relative border border-[#dcdcde]">
                        <img
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=200&auto=format&fit=crop'}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-[#1d2327]">
                        <Link
                          href={`/wp-admin/properties/edit/${prop.id}`}
                          className="hover:text-[#2271b1] text-sm"
                        >
                          {prop.title}
                        </Link>
                        {prop.status === 'draft' && (
                          <span className="text-[#646970] font-normal ml-2">— Draft</span>
                        )}
                        {prop.isHotInvestment && (
                          <span className="inline-flex items-center gap-0.5 text-[#d63638] text-[10px] font-bold ml-2 bg-[#fbeaea] px-1 rounded">
                            <Flame className="w-2.5 h-2.5" /> HOT
                          </span>
                        )}
                      </div>

                      {/* WordPress Hover Action Row */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/wp-admin/properties/edit/${prop.id}`}
                          className="text-[#2271b1] hover:underline"
                        >
                          Edit
                        </Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <button
                          onClick={() => handleDelete(prop.id, prop.title)}
                          className="text-[#d63638] hover:underline"
                        >
                          Trash
                        </button>
                        <span className="text-[#c3c4c7]">|</span>
                        <Link
                          href={`/properties/${prop.slug}`}
                          target="_blank"
                          className="text-[#2271b1] hover:underline flex items-center gap-0.5"
                        >
                          View Listing <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </td>

                    <td className="p-3 text-[#2c3338]">
                      <div>{prop.society}</div>
                      <div className="text-[11px] text-[#646970]">{prop.sectorBlock || 'Sector A'} · {prop.city}</div>
                    </td>

                    <td className="p-3 font-semibold text-[#1d2327]">
                      {prop.sizeMarla} Marla
                    </td>

                    <td className="p-3 text-[#1d2327] font-semibold">
                      PKR {(prop.demandPrice / 100000).toFixed(1)} Lac
                      {prop.demandPrice >= 10000000 && (
                        <div className="text-[10px] text-[#646970]">
                          ({(prop.demandPrice / 10000000).toFixed(2)} Crore)
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {prop.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-[#00a32a] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#dba617] font-semibold">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-[#646970]">
                      <div>{prop.agentName || 'Asad Ali'}</div>
                      <div className="text-[10px]">{prop.agentPhone || '+92 300 5123456'}</div>
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

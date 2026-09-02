'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  Calculator,
  Grid,
  List,
  Filter,
  Sparkles,
  MapPin,
  X,
  UserCheck,
  Landmark,
  Layers,
  ShieldCheck,
  DollarSign,
  FileText,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { SideDrawer } from '@/components/ui/side-drawer';
import { PropertyCard } from '@/components/properties/property-card';
import { PropertyDetailDrawer } from '@/components/properties/property-detail-drawer';
import { CreateEditPropertyModal } from '@/components/properties/create-edit-property-modal';
import { PropertyMatcherModal } from '@/components/properties/property-matcher-modal';
import { formatPKR, convertLandSize } from '@/lib/utils';
import { useRBAC } from '@/contexts/rbac-context';

function PropertiesPageContent() {
  const { user, hasPermission } = useRBAC();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab')?.toUpperCase();
  const defaultTab = tabParam === 'SOCIETIES' ? 'SOCIETIES' : tabParam === 'COMPARISON' ? 'COMPARISON' : 'INVENTORY';

  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'SOCIETIES' | 'COMPARISON'>(defaultTab);
  const [properties, setProperties] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canListProperties =
    user?.role !== 'SALES_AGENT' &&
    user?.role !== 'AGENT' &&
    (hasPermission('properties.create') || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN');

  // Search & Filter States for Inventory
  const [searchQuery, setSearchQuery] = useState('');
  const [parsedQueryInfo, setParsedQueryInfo] = useState<any>(null);
  const [filterType, setFilterType] = useState('ALL');
  const [filterSociety, setFilterSociety] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterBlock, setFilterBlock] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Drawer & Modals
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<any | null>(null);
  const [matcherModalOpen, setMatcherModalOpen] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);

  // Society Master Installment Calculator Modal
  const [selectedSocPlan, setSelectedSocPlan] = useState<any | null>(null);
  const [planPlotSize, setPlanPlotSize] = useState<'5_MARLA' | '10_MARLA' | '1_KANAL'>('10_MARLA');

  // Land Unit Converter states
  const [calcSize, setCalcSize] = useState<number>(10);
  const [calcUnit, setCalcUnit] = useState<'MARLA' | 'KANAL' | 'SQFT' | 'SQYDS'>('MARLA');

  async function fetchProperties() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterType !== 'ALL') params.append('type', filterType);
      if (filterSociety !== 'ALL') params.append('society', filterSociety);
      if (filterBlock !== 'ALL') params.append('block', filterBlock);

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
        setParsedQueryInfo(data.parsedQuery);
      }
    } catch (err) {
      console.error('Fetch properties error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSocieties() {
    try {
      const res = await fetch('/api/societies');
      if (res.ok) setSocieties(await res.json());
    } catch (err) {
      console.error('Fetch societies error:', err);
    }
  }

  useEffect(() => {
    fetchSocieties();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType, filterSociety, filterStatus, filterBlock]);

  const handleDeactivate = async (prop: any) => {
    if (!confirm(`Are you sure you want to deactivate ${prop.title}?`)) return;
    try {
      const res = await fetch(`/api/properties/${prop.id}`, { method: 'DELETE' });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error('Deactivate error:', err);
    }
  };

  const converted = convertLandSize(calcSize, calcUnit);

  const sampleQueries = [
    '10 marla plot Kohistan Enclave under 1.5 crore',
    '1 kanal boulevard plot DHA Phase 2',
    '5 marla file New City Paradise',
    'Commercial shop Bahria Town Phase 8',
  ];

  // Master Society Installment Calculations
  const getInstallmentDetails = () => {
    let basePrice = 16000000; // 10 Marla default
    if (planPlotSize === '5_MARLA') basePrice = 8500000;
    if (planPlotSize === '1_KANAL') basePrice = 32000000;

    const downPayment = Math.round(basePrice * 0.2);
    const possessionAmount = Math.round(basePrice * 0.1);
    const remainingInstallments = basePrice - downPayment - possessionAmount;
    const quarterlyAmount = Math.round(remainingInstallments / 12);

    return {
      totalPrice: basePrice,
      downPayment,
      possessionAmount,
      quarterlyAmount,
      totalInstallments: 12,
      duration: '3 Years (Quarterly)',
    };
  };

  const installmentData = getInstallmentDetails();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-600" /> Properties & Projects Master Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 border border-brand-500/20">
              Inventory & Schemes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete inventory catalog of residential plots, commercial files, master society approvals, and installment calculators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCalcModalOpen(true)}
            className="gap-1.5 text-xs text-slate-700 dark:text-slate-200"
          >
            <Calculator className="w-3.5 h-3.5 text-brand-600" /> Land Unit Converter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMatcherModalOpen(true)}
            className="gap-1.5 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Lead Matcher
          </Button>

          {canListProperties && (
            <Button
              size="sm"
              onClick={() => {
                setPropertyToEdit(null);
                setCreateModalOpen(true);
              }}
              className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> + List Property
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 SEGMENTED NAVIGATION TABS (UNIFIED INVENTORY & SOCIETIES) */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Tab 1: Available Plot Inventory */}
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'INVENTORY'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Available Plot Inventory</span>
            <Badge variant="info" className="text-[10px] px-1.5 py-0 h-4">
              {properties.length} Units
            </Badge>
          </button>

          {/* Tab 2: Master Societies & Schemes */}
          <button
            onClick={() => setActiveTab('SOCIETIES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'SOCIETIES'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Master Societies & Project Profiles</span>
            <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
              {societies.length || 4} Schemes
            </Badge>
          </button>

          {/* Tab 3: Society Comparison Matrix */}
          <button
            onClick={() => setActiveTab('COMPARISON')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'COMPARISON'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Project Comparison Matrix</span>
          </button>
        </div>

        {activeTab === 'INVENTORY' && (
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-brand-500/10 text-brand-600' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-brand-500/10 text-brand-600' : 'text-slate-400'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🏡 TAB 1: AVAILABLE PLOT INVENTORY & LISTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6">
          {/* Advanced Natural Language Search Box */}
          <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200">
                Natural Language Advanced Search Engine
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try typing: "10 marla plot Kohistan Enclave under 1.5 crore" or plot numbers...'
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 outline-hidden focus:border-brand-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Query parsing pill tags */}
            {parsedQueryInfo && (parsedQueryInfo.size || parsedQueryInfo.societyName || parsedQueryInfo.maxPrice) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-400">Parsed Query Filters:</span>
                {parsedQueryInfo.size && (
                  <Badge variant="purple">
                    Size: {parsedQueryInfo.size} {parsedQueryInfo.sizeUnit}
                  </Badge>
                )}
                {parsedQueryInfo.societyName && (
                  <Badge variant="success">Society: {parsedQueryInfo.societyName}</Badge>
                )}
                {parsedQueryInfo.maxPrice && (
                  <Badge variant="info">Max Price: {formatPKR(parsedQueryInfo.maxPrice)}</Badge>
                )}
                {parsedQueryInfo.propertyType && (
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    Type: {parsedQueryInfo.propertyType}
                  </Badge>
                )}
              </div>
            )}

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center">Example Searches:</span>
              {sampleQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(sq)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-brand-900/40 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-colors"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </Card>

          {/* Multi-Attribute Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
              <Filter className="w-4 h-4 text-brand-600" /> Filters:
            </div>

            <Select
              value={filterSociety}
              onChange={(e) => setFilterSociety(e.target.value)}
              className="w-48 text-xs h-8"
            >
              <option value="ALL">All Housing Societies</option>
              {societies.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
              {!societies.some((s) => s.name === 'Kohistan Enclave') && (
                <option value="Kohistan Enclave">Kohistan Enclave</option>
              )}
              {!societies.some((s) => s.name === 'New City Paradise') && (
                <option value="New City Paradise">New City Paradise</option>
              )}
            </Select>

            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-44 text-xs h-8"
            >
              <option value="ALL">All Property Types</option>
              <option value="RESIDENTIAL_PLOT">Residential Plot</option>
              <option value="COMMERCIAL_PLOT">Commercial Plot</option>
              <option value="HOUSE_VILLA">House / Villa</option>
              <option value="PLOT_FILE">Plot File</option>
            </Select>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-36 text-xs h-8"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="TOKEN_PAID">Token Paid</option>
              <option value="SOLD">Sold</option>
            </Select>
          </div>

          {/* Results Grid / List */}
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">
              Loading inventory listings...
            </div>
          ) : properties.length === 0 ? (
            <Card className="p-12 text-center text-slate-400 space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                No matching properties found
              </h3>
              <p className="text-xs">Try clearing filters or search query to view all available listings.</p>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={(p) => setSelectedProperty(p)}
                  onEdit={(p) => {
                    setPropertyToEdit(p);
                    setCreateModalOpen(true);
                  }}
                  onDelete={(p) => handleDeactivate(p)}
                />
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Property / Unit</th>
                    <th className="p-3.5">Society & Block</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5">Demand Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {properties.map((prop) => (
                    <tr
                      key={prop.id}
                      onClick={() => setSelectedProperty(prop)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{prop.title}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {prop.society?.name || prop.societyName || 'Kohistan Enclave'} • {prop.block || 'Block A'}
                      </td>
                      <td className="p-3.5 font-semibold">
                        {prop.size} {prop.sizeUnit || 'Marla'}
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-emerald-600">
                        {formatPKR(prop.demandPrice)}
                      </td>
                      <td className="p-3.5">
                        <Badge variant={prop.status === 'AVAILABLE' ? 'success' : 'purple'}>
                          {prop.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right font-semibold text-brand-600 hover:underline">
                        View Details →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏛️ TAB 2: MASTER SOCIETIES & DEVELOPMENT SCHEMES */}
      {/* ========================================================================= */}
      {activeTab === 'SOCIETIES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {societies.map((soc) => (
              <Card
                key={soc.id}
                className="overflow-hidden hover:shadow-xl hover:border-brand-500/50 transition-all flex flex-col group bg-white dark:bg-slate-900"
              >
                {/* Header Image */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={soc.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                    alt={soc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge variant="purple" className="shadow-md">
                      {soc.nocStatus || 'CDA Approved'}
                    </Badge>
                    <Badge variant="success" className="shadow-md">
                      {soc.devStatus || '100% Developed'}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">{soc.name}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" /> {soc.location} ({soc.city})
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {soc.description || 'Premier housing scheme offering prime plot inventory.'}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Master Sectors & Blocks:</span>
                        <strong className="text-slate-900 dark:text-slate-100">
                          {soc.blocks || 'Block A, Block B, Executive Block'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Average Demand Range:</span>
                        <strong className="text-emerald-600 font-mono font-bold">
                          {formatPKR(soc.priceRangeMin || 4500000)} — {formatPKR(soc.priceRangeMax || 35000000)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Developer / Authority:</span>
                        <strong className="text-slate-700 dark:text-slate-300">
                          {soc.developer || 'Authorized Private Development'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setFilterSociety(soc.name);
                        setActiveTab('INVENTORY');
                      }}
                      className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      Browse {soc.name} Inventory →
                    </button>

                    <Button
                      size="sm"
                      onClick={() => setSelectedSocPlan(soc)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1"
                    >
                      <Calculator className="w-3.5 h-3.5" /> 3-Year Payment Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚖️ TAB 3: PROJECT COMPARISON MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'COMPARISON' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-950 text-white border border-brand-800/30">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" /> Society Investment & Legal Comparison Matrix
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Side-by-side evaluation of legal NOC approvals, development completion status, average price per Marla, and possession timelines.
            </p>
          </div>

          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Housing Scheme</th>
                  <th className="p-3.5">Legal NOC Status</th>
                  <th className="p-3.5">Development Progress</th>
                  <th className="p-3.5">Avg. 10 Marla Demand</th>
                  <th className="p-3.5">Key Utilities & Amenities</th>
                  <th className="p-3.5">Possession Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Kohistan Enclave (Wah / Taxila)
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success">TMA & RDA Approved</Badge>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600">100% Fully Developed</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    PKR 1.4 - 1.8 Crore
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    Sui Gas, Underground Electricity, Main GT Road
                  </td>
                  <td className="p-3.5">
                    <span className="text-emerald-600 font-bold">Immediate Allotment</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    New City Paradise (M-1 Motorway)
                  </td>
                  <td className="p-3.5">
                    <Badge variant="purple">PHATA Approved</Badge>
                  </td>
                  <td className="p-3.5 font-semibold text-blue-600">Rapid Development (Phase 1)</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    PKR 95 Lac - 1.25 Crore
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    250ft Main Boulevard, 4-Lane Motorway Interchange
                  </td>
                  <td className="p-3.5">
                    <span className="text-amber-600 font-bold">1.5 Years Possession</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    DHA Phase 2 (Islamabad)
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success">Defence Housing Authority</Badge>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600">100% Mature & Inhabited</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    PKR 2.8 - 3.8 Crore
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    Giga Mall, Jacaranda Club, World-class Security
                  </td>
                  <td className="p-3.5">
                    <span className="text-emerald-600 font-bold">Immediate Registry</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📐 MODAL: 3-YEAR INSTALLMENT PLAN CALCULATOR */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!selectedSocPlan}
        onClose={() => setSelectedSocPlan(null)}
        title={`Official Payment Schedule: ${selectedSocPlan?.name || 'Project'}`}
      >
        {selectedSocPlan && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Select Plot Size:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setPlanPlotSize('5_MARLA')}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
                    planPlotSize === '5_MARLA' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  5 Marla
                </button>
                <button
                  onClick={() => setPlanPlotSize('10_MARLA')}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
                    planPlotSize === '10_MARLA' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  10 Marla
                </button>
                <button
                  onClick={() => setPlanPlotSize('1_KANAL')}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
                    planPlotSize === '1_KANAL' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  1 Kanal
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Plot Value</span>
                <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100 text-base">
                  {formatPKR(installmentData.totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">20% Down Payment (Booking)</span>
                <span className="font-bold font-mono text-emerald-600 text-sm">
                  {formatPKR(installmentData.downPayment)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">12 Quarterly Installments</span>
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
                  {formatPKR(installmentData.quarterlyAmount)} / quarter
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">10% On Possession</span>
                <span className="font-bold font-mono text-brand-600">
                  {formatPKR(installmentData.possessionAmount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedSocPlan(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setSelectedSocPlan(null);
                  setFilterSociety(selectedSocPlan.name);
                  setActiveTab('INVENTORY');
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold"
              >
                Browse Matching Inventory
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modals & Drawers */}
      <PropertyDetailDrawer
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onEdit={() => {
          setPropertyToEdit(selectedProperty);
          setSelectedProperty(null);
          setCreateModalOpen(true);
        }}
      />

      <CreateEditPropertyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        propertyToEdit={propertyToEdit}
        onSuccess={() => {
          setCreateModalOpen(false);
          fetchProperties();
        }}
      />

      <PropertyMatcherModal
        isOpen={matcherModalOpen}
        onClose={() => setMatcherModalOpen(false)}
      />

      {/* Unit Converter Modal */}
      <Modal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
        title="Pakistani Land Unit Converter"
      >
        <div className="space-y-4 text-xs">
          <div className="flex gap-2">
            <Input
              label="Value"
              type="number"
              value={calcSize}
              onChange={(e) => setCalcSize(parseFloat(e.target.value) || 0)}
            />
            <Select
              label="Unit"
              value={calcUnit}
              onChange={(e) => setCalcUnit(e.target.value as any)}
            >
              <option value="MARLA">Marla (225 sqft)</option>
              <option value="KANAL">Kanal (20 Marla)</option>
              <option value="SQFT">Square Feet</option>
              <option value="SQYDS">Square Yards (Guz)</option>
            </Select>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5 font-mono text-xs border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500">Marla:</span>
              <strong>{converted.marla} Marla</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kanal:</span>
              <strong>{converted.kanal} Kanal</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Square Feet:</span>
              <strong>{converted.sqft} sq ft</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Square Yards (Guz):</span>
              <strong>{converted.sqyds} sq yds</strong>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Properties & Projects Hub...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}

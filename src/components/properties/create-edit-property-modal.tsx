'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Input, Select } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { Home, Building2, Bed, Bath, Layers, Sparkles } from 'lucide-react';

export interface CreateEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: any;
  onSuccess?: () => void;
  societies?: any[];
  agents?: any[];
}

export function CreateEditPropertyModal({
  isOpen,
  onClose,
  propertyToEdit,
  onSuccess,
  societies = [],
  agents = [],
}: CreateEditPropertyModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    plotNumber: '',
    block: 'Block A',
    sector: 'Sector 1',
    street: 'Street 12',
    propertyType: 'HOUSE',
    size: '10',
    sizeUnit: 'MARLA',
    demandPrice: '32500000',
    marketPrice: '31000000',
    status: 'AVAILABLE',
    city: 'Wah Cantt',
    societyName: 'Kohistan Enclave',
    ownerName: '',
    ownerPhone: '',
    agentId: '',
    commissionRate: '1.0',
    description: '',
    // House & Villa Specific Attributes
    bedrooms: '5',
    bathrooms: '6',
    storeys: 'Double Storey',
    furnishedStatus: 'Brand New (Semi-Furnished)',
    houseCondition: 'Brand New Construction',
  });

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        title: propertyToEdit.title || '',
        plotNumber: propertyToEdit.plotNumber || '',
        block: propertyToEdit.block || 'Block A',
        sector: propertyToEdit.sector || 'Sector 1',
        street: propertyToEdit.street || 'Street 12',
        propertyType: propertyToEdit.propertyType || 'HOUSE',
        size: propertyToEdit.size?.toString() || '10',
        sizeUnit: propertyToEdit.sizeUnit || 'MARLA',
        demandPrice: propertyToEdit.demandPrice?.toString() || '32500000',
        marketPrice: propertyToEdit.marketPrice?.toString() || '31000000',
        status: propertyToEdit.status || 'AVAILABLE',
        city: propertyToEdit.city || 'Wah Cantt',
        societyName: propertyToEdit.society?.name || 'Kohistan Enclave',
        ownerName: propertyToEdit.ownerName || '',
        ownerPhone: propertyToEdit.ownerPhone || '',
        agentId: propertyToEdit.agentId || '',
        commissionRate: propertyToEdit.commissionRate?.toString() || '1.0',
        description: propertyToEdit.description || '',
        bedrooms: '5',
        bathrooms: '6',
        storeys: 'Double Storey',
        furnishedStatus: 'Brand New (Semi-Furnished)',
        houseCondition: 'Brand New Construction',
      });
    } else {
      setFormData({
        title: '',
        plotNumber: '',
        block: 'Block A',
        sector: 'Sector 1',
        street: 'Street 12',
        propertyType: 'HOUSE',
        size: '10',
        sizeUnit: 'MARLA',
        demandPrice: '32500000',
        marketPrice: '31000000',
        status: 'AVAILABLE',
        city: 'Wah Cantt',
        societyName: societies[0]?.name || 'Kohistan Enclave',
        ownerName: '',
        ownerPhone: '',
        agentId: '',
        commissionRate: '1.0',
        description: '',
        bedrooms: '5',
        bathrooms: '6',
        storeys: 'Double Storey',
        furnishedStatus: 'Brand New (Semi-Furnished)',
        houseCondition: 'Brand New Construction',
      });
    }
  }, [propertyToEdit, isOpen, societies]);

  const isHouseOrBuilding =
    formData.propertyType.includes('HOUSE') ||
    formData.propertyType === 'VILLA' ||
    formData.propertyType === 'FARMHOUSE' ||
    formData.propertyType === 'APARTMENT' ||
    formData.propertyType === 'PENTHOUSE' ||
    formData.propertyType === 'COMMERCIAL_BUILDING';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.demandPrice) {
      toast('Required Fields Missing', 'Please enter property title and demand price.', 'error');
      return;
    }

    setLoading(true);
    try {
      const url = propertyToEdit ? `/api/properties/${propertyToEdit.id}` : '/api/properties';
      const method = propertyToEdit ? 'PATCH' : 'POST';

      // Build enriched description if house details present
      let enrichedDescription = formData.description;
      if (isHouseOrBuilding && !formData.description) {
        enrichedDescription = `${formData.storeys} ${formData.propertyType.replace(/_/g, ' ')} featuring ${formData.bedrooms} Master Bedrooms, ${formData.bathrooms} Luxury Baths, Designer Kitchen, Imported Fittings. Condition: ${formData.houseCondition}. ${formData.furnishedStatus}.`;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: enrichedDescription,
        }),
      });

      if (res.ok) {
        toast(
          propertyToEdit ? 'Property Updated' : 'Property Listed',
          `Successfully saved "${formData.title}".`,
          'success'
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast('Failed to save property', 'Check input values and try again.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not connect to server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const defaultSocieties = [
    'Kohistan Enclave',
    'New City (Phase 2 & Paradise)',
    'DHA Islamabad-Rawalpindi',
    'Bahria Town Islamabad / Rawalpindi',
    'Gulberg Greens Islamabad',
    'Park View City',
    'Eighteen Islamabad',
    'Faisal Hills',
    'Faisal Town',
    'Top City-1',
    'Multi Gardens B-17',
  ];

  const societyOptions = Array.from(
    new Set([...societies.map((s) => s.name), ...defaultSocieties])
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={propertyToEdit ? 'Edit Property Listing' : 'List New Property / House'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        <Input
          label="Property / House Title *"
          placeholder="e.g. 10 Marla Brand New Modern Designer House"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select
            label="Property Category"
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
          >
            <optgroup label="🏠 Houses & Constructed Villas">
              <option value="HOUSE">House / Villa</option>
              <option value="DOUBLE_STOREY_HOUSE">Double Storey House</option>
              <option value="SINGLE_STOREY_HOUSE">Single Storey House</option>
              <option value="TRIPLE_STOREY_HOUSE">Triple Storey House</option>
              <option value="VILLA">Luxury Villa / Mansion</option>
              <option value="FARMHOUSE">Luxury Agro Farmhouse</option>
              <option value="APARTMENT">Luxury Apartment / Flat</option>
              <option value="PENTHOUSE">Penthouse</option>
            </optgroup>
            <optgroup label="📐 Plots & Land">
              <option value="RESIDENTIAL_PLOT">Residential Plot</option>
              <option value="COMMERCIAL_PLOT">Commercial Plot</option>
              <option value="COMMERCIAL_BUILDING">Commercial Plaza</option>
              <option value="SHOP">Commercial Shop</option>
              <option value="FILE">Plot / Installment File</option>
            </optgroup>
          </Select>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="TOKEN">Token Paid</option>
            <option value="SOLD">Sold</option>
            <option value="INACTIVE">Inactive</option>
          </Select>

          <Input
            label="Size Value"
            type="number"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />

          <Select
            label="Size Unit"
            value={formData.sizeUnit}
            onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value })}
          >
            <option value="MARLA">Marla</option>
            <option value="KANAL">Kanal</option>
            <option value="SQFT">Sq Ft</option>
            <option value="SQYDS">Sq Yds</option>
          </Select>
        </div>

        {/* Dynamic House & Villa Details Card */}
        {isHouseOrBuilding && (
          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Home className="w-4 h-4" /> Constructed House & Villa Specifications
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Select
                label="Bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              >
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5 Bedrooms</option>
                <option value="6">6 Bedrooms</option>
                <option value="7">7+ Bedrooms</option>
              </Select>

              <Select
                label="Bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              >
                <option value="2">2 Baths</option>
                <option value="3">3 Baths</option>
                <option value="4">4 Baths</option>
                <option value="5">5 Baths</option>
                <option value="6">6 Baths</option>
                <option value="7">7+ Baths</option>
              </Select>

              <Select
                label="Floors / Storeys"
                value={formData.storeys}
                onChange={(e) => setFormData({ ...formData, storeys: e.target.value })}
              >
                <option value="Double Storey">Double Storey</option>
                <option value="Single Storey">Single Storey</option>
                <option value="Triple Storey">Triple Storey</option>
                <option value="Basement + Ground + 1st">Basement + Ground + 1st</option>
              </Select>

              <Select
                label="Furnishing"
                value={formData.furnishedStatus}
                onChange={(e) => setFormData({ ...formData, furnishedStatus: e.target.value })}
              >
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Select
            label="Housing Society *"
            value={formData.societyName}
            onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
          >
            {societyOptions.map((soc) => (
              <option key={soc} value={soc}>
                {soc}
              </option>
            ))}
          </Select>

          <Input
            label="House / Plot Number"
            placeholder="e.g. 24-B or House 112"
            value={formData.plotNumber}
            onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
          />

          <Input
            label="Block / Sector"
            placeholder="e.g. Executive Block / Sector C"
            value={formData.block}
            onChange={(e) => setFormData({ ...formData, block: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Demand Price (PKR) *"
            placeholder="e.g. 32500000"
            value={formData.demandPrice}
            onChange={(e) => setFormData({ ...formData, demandPrice: e.target.value })}
          />

          <Input
            label="Market Assessment (PKR)"
            placeholder="e.g. 31000000"
            value={formData.marketPrice}
            onChange={(e) => setFormData({ ...formData, marketPrice: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Owner / Seller Name"
            placeholder="e.g. Malik Jahangir"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          />

          <Input
            label="Owner Contact Phone"
            placeholder="03001234567"
            value={formData.ownerPhone}
            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Property Description & Key Highlights
          </label>
          <textarea
            className="w-full h-24 p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 outline-none"
            placeholder="Describe key features (e.g. Solid ash wood doors, Spanish tiles, solar system installed, wide boulevard, park facing)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            {propertyToEdit ? 'Save Changes' : 'Publish Listing'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

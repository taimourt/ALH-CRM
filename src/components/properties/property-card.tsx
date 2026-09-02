import React from 'react';
import { MapPin, UserCheck, Eye, Edit3, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/lib/utils';

export interface PropertyCardProps {
  property: any;
  onSelect: (property: any) => void;
  onEdit?: (property: any) => void;
  onDelete?: (property: any) => void;
}

export function PropertyCard({ property, onSelect, onEdit, onDelete }: PropertyCardProps) {
  const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'purple' | 'danger'> = {
    AVAILABLE: 'success',
    RESERVED: 'warning',
    TOKEN: 'purple',
    SOLD: 'danger',
    INACTIVE: 'info',
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:border-brand-500/50 transition-all flex flex-col group bg-white dark:bg-slate-900">
      {/* Image header */}
      <div
        className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
        onClick={() => onSelect(property)}
      >
        <img
          src={
            property.images ||
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={statusVariants[property.status] || 'success'} className="shadow-md text-[10px]">
            {property.status}
          </Badge>
          <Badge variant="purple" className="shadow-md text-[10px]">
            {property.size} {property.sizeUnit}
          </Badge>
          <Badge variant="outline" className="shadow-md bg-slate-900/80 text-white border-none text-[10px]">
            {property.propertyType?.replace('_', ' ')}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-xs text-white font-extrabold text-sm shadow-md">
          {formatPKR(property.demandPrice)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5 cursor-pointer" onClick={() => onSelect(property)}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {property.society?.name || property.city} • Plot #{property.plotNumber || 'N/A'}{' '}
              {property.block ? `(${property.block})` : ''}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {property.description || 'Prime location Pakistani real estate plot ready for instant possession.'}
        </p>

        {/* Footer info & actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate">{property.agent?.name || 'Unassigned Agent'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(property)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View Property Details & Gallery"
            >
              <Eye className="w-4 h-4" />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Listing"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Deactivate Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

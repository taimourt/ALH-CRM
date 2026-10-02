'use client';

import React from 'react';
import { ArchitecturalLine } from './ArchitecturalLine';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Real-Rate Listings Found',
  description = 'There are no active property listings matching your exact search criteria. Contact our advisory desk for unlisted off-market plots.',
  actionText = 'Clear Filters',
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-12 text-center border border-[#E5E5E5] bg-[#FEFEFE] my-8 ${className}`}>
      <ArchitecturalLine className="max-w-md mx-auto mb-6" size="md" />

      <h3 className="text-xl font-bold uppercase tracking-tight text-[#000000] mb-2 font-sans">
        {title}
      </h3>

      <p className="text-xs text-[#666666] max-w-lg mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

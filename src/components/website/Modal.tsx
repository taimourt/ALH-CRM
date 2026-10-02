'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ArchitecturalLine } from './ArchitecturalLine';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/70 backdrop-blur-sm">
      <div className="bg-[#FEFEFE] border border-[#000000] w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F4F4F4]">
          <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-[#000000]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E5E5E5] text-[#000000] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        <div className="px-6 pb-4">
          <ArchitecturalLine size="sm" />
        </div>
      </div>
    </div>
  );
};

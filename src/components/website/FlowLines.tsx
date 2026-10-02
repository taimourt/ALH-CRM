'use client';

import React from 'react';

interface FlowLinesProps {
  className?: string;
  opacity?: number;
  variant?: 'subtle' | 'hero' | 'footer' | 'accent';
}

export const FlowLines: React.FC<FlowLinesProps> = ({
  className = '',
  opacity = 0.4,
  variant = 'subtle',
}) => {
  const strokeColor = variant === 'hero' ? '#222222' : '#666666';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full min-h-[300px] min-w-[800px]"
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Architectural Wave Line 1 */}
        <path
          d="M-100 120 C 300 40, 600 240, 1000 80 C 1250 -20, 1500 160, 1600 100"
          stroke={strokeColor}
          strokeWidth="0.75"
          strokeDasharray="4 4"
        />
        {/* Architectural Wave Line 2 (Parallel flow) */}
        <path
          d="M-100 150 C 280 70, 620 270, 980 110 C 1230 10, 1480 190, 1600 130"
          stroke={strokeColor}
          strokeWidth="0.5"
        />
        {/* Architectural Wave Line 3 (Sweeping base line) */}
        <path
          d="M-50 280 C 350 200, 750 350, 1150 220 C 1350 150, 1520 290, 1650 250"
          stroke="#BDBDBD"
          strokeWidth="0.5"
        />
        {/* Fine cross-hatch accent line */}
        <path
          d="M-100 80 Q 500 320, 1550 40"
          stroke="#E5E5E5"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

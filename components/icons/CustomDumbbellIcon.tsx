import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomDumbbellIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 90 392 332"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="dbCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="dbAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      <g transform="rotate(-30 256 256)">
        {/* End caps */}
        <rect x="74" y="238" width="26" height="36" rx="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="6" />
        <rect x="412" y="238" width="26" height="36" rx="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="6" />

        {/* Handle */}
        <rect x="166" y="240" width="180" height="32" rx="16" fill="#e0f2fe" />
        <rect x="170" y="244" width="172" height="24" rx="12" fill="url(#dbCyanGlow)" />
        {/* Grip texture */}
        <g stroke="#e0f2fe" strokeWidth="5" strokeLinecap="round" opacity="0.55">
          <line x1="224" y1="249" x2="224" y2="263" />
          <line x1="240" y1="249" x2="240" y2="263" />
          <line x1="256" y1="249" x2="256" y2="263" />
          <line x1="272" y1="249" x2="272" y2="263" />
          <line x1="288" y1="249" x2="288" y2="263" />
        </g>

        {/* Outer plates (deep azure) */}
        <rect x="94" y="198" width="40" height="116" rx="14" fill="url(#dbAzure)" stroke="#1e293b" strokeWidth="6" />
        <rect x="378" y="198" width="40" height="116" rx="14" fill="url(#dbAzure)" stroke="#1e293b" strokeWidth="6" />

        {/* Inner plates (dark slate + light blue) */}
        <rect x="126" y="162" width="50" height="188" rx="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
        <rect x="130" y="166" width="42" height="180" rx="14" fill="#1e293b" fillOpacity="0.16" />
        <rect x="336" y="162" width="50" height="188" rx="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
        <rect x="340" y="166" width="42" height="180" rx="14" fill="#1e293b" fillOpacity="0.16" />

        {/* Plate highlights */}
        <line x1="142" y1="190" x2="142" y2="240" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
        <line x1="352" y1="190" x2="352" y2="240" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      </g>
    </svg>
  );
};

export default CustomDumbbellIcon;

import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomTargetIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 70 376 382"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="targetCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="targetTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="targetAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Outer ring body */}
      <circle cx="246" cy="266" r="176" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
      <circle cx="246" cy="266" r="172" fill="url(#targetTintGrad)" />

      {/* Crosshair ticks */}
      <g stroke="#0284c7" strokeWidth="8" strokeLinecap="round">
        <line x1="246" y1="112" x2="246" y2="134" />
        <line x1="246" y1="398" x2="246" y2="420" />
        <line x1="92" y1="266" x2="114" y2="266" />
        <line x1="378" y1="266" x2="400" y2="266" />
      </g>

      {/* Middle ring (deep slate band) */}
      <circle cx="246" cy="266" r="118" fill="#0ea5e9" stroke="#0284c7" strokeWidth="6" />

      {/* Inner ring (cyan tint) */}
      <circle cx="246" cy="266" r="74" fill="#1e293b" fillOpacity="0.16" stroke="#1e293b" strokeWidth="7" />

      {/* Bullseye */}
      <circle cx="246" cy="266" r="32" fill="url(#targetCyanGlow)" />
      <circle cx="236" cy="256" r="8" fill="#0b1120" fillOpacity="0.55" />

      {/* Impact accents */}
      <g fill="none" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.8">
        <path d="M 196 234 A 58 58 0 0 1 214 216" />
        <path d="M 278 316 A 58 58 0 0 1 296 298" />
      </g>

      {/* Arrow (hitting center from top-right) */}
      <g transform="translate(246 266) rotate(-45)">
        {/* Shaft outline + cyan core */}
        <rect x="-4" y="-9" width="228" height="18" rx="9" fill="#e0f2fe" />
        <rect x="0" y="-5" width="220" height="10" rx="5" fill="url(#targetCyanGlow)" />
        {/* Fletching vanes */}
        <path d="M 168 -9 L 196 -9 L 228 -40 L 200 -40 Z" fill="url(#targetAzure)" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 168 9 L 196 9 L 228 40 L 200 40 Z" fill="url(#targetAzure)" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" />
        {/* Nock */}
        <rect x="214" y="-10" width="20" height="20" rx="6" fill="#e0f2fe" stroke="#1e293b" strokeWidth="5" />
      </g>
    </svg>
  );
};

export default CustomTargetIcon;

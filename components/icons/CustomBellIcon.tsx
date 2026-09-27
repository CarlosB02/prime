import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomBellIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="66 86 340 330"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="bellCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="bellTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="bellAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Sound waves (left) */}
      <g fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round">
        <path d="M 118 168 A 96 96 0 0 0 106 236" opacity="0.9" />
        <path d="M 92 146 A 128 128 0 0 0 76 254" opacity="0.45" />
      </g>

      {/* Hanger */}
      <rect x="238" y="94" width="36" height="34" rx="13" fill="#e0f2fe" stroke="#1e293b" strokeWidth="7" />

      {/* Clapper */}
      <circle cx="256" cy="384" r="22" fill="url(#bellCyanGlow)" stroke="#e0f2fe" strokeWidth="6" />

      {/* Bell body */}
      <path
        d="M 256 120 C 188 120 150 170 150 236 L 150 300 L 120 344 L 392 344 L 362 300 L 362 236 C 362 170 324 120 256 120 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M 256 124 C 192 124 154 172 154 236 L 154 300 L 127 340 L 385 340 L 358 300 L 358 236 C 358 172 320 124 256 124 Z"
        fill="url(#bellTintGrad)"
      />

      {/* Deep azure lower band */}
      <path d="M 154 282 L 358 282 L 358 300 L 385 340 L 127 340 L 154 300 Z" fill="url(#bellAzure)" fillOpacity="0.55" />
      <line x1="154" y1="282" x2="358" y2="282" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" opacity="0.7" />

      {/* Rim */}
      <rect x="108" y="338" width="296" height="28" rx="14" fill="#0ea5e9" stroke="#0284c7" strokeWidth="7" />

      {/* Inner highlight */}
      <path d="M 200 176 Q 184 200 184 244" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.6" />

      {/* Notification badge */}
      <circle cx="358" cy="150" r="38" fill="url(#bellCyanGlow)" stroke="#e0f2fe" strokeWidth="10" />
      <circle cx="358" cy="150" r="12" fill="#0b1120" fillOpacity="0.85" />
    </svg>
  );
};

export default CustomBellIcon;

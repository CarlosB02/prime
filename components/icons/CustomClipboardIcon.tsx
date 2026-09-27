import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomClipboardIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="106 78 300 358"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="clipCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="clipTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="clipAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Board */}
      <rect x="116" y="108" width="280" height="320" rx="40" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" strokeLinejoin="round" />
      <rect x="120" y="112" width="272" height="312" rx="36" fill="url(#clipTintGrad)" />

      {/* Paper sheet */}
      <rect x="148" y="150" width="216" height="248" rx="22" fill="#0ea5e9" stroke="#0284c7" strokeWidth="4" />
      {/* Deep azure header strip on paper */}
      <path d="M 150 172 C 150 160 158 152 170 152 L 342 152 C 354 152 362 160 362 172 L 362 176 L 150 176 Z" fill="url(#clipAzure)" fillOpacity="0.55" />

      {/* Clip */}
      <rect x="190" y="84" width="132" height="58" rx="18" fill="#e0f2fe" stroke="#1e293b" strokeWidth="7" />
      <rect x="226" y="104" width="60" height="16" rx="8" fill="#1e293b" fillOpacity="0.2" stroke="#1e293b" strokeWidth="4" />

      {/* Row 1: done */}
      <rect x="172" y="198" width="34" height="34" rx="10" fill="url(#clipCyanGlow)" />
      <path d="M 180 215 L 187 222 L 199 208" fill="none" stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="222" y="207" width="118" height="16" rx="8" fill="#1e293b" fillOpacity="0.35" />

      {/* Row 2: done */}
      <rect x="172" y="258" width="34" height="34" rx="10" fill="url(#clipCyanGlow)" />
      <path d="M 180 275 L 187 282 L 199 268" fill="none" stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="222" y="267" width="94" height="16" rx="8" fill="#1e293b" fillOpacity="0.35" />

      {/* Row 3: pending */}
      <rect x="174" y="320" width="30" height="30" rx="9" fill="#e0f2fe" fillOpacity="0.4" stroke="#0284c7" strokeWidth="5" />
      <rect x="222" y="327" width="106" height="16" rx="8" fill="#0284c7" />

      {/* Bottom accent dots */}
      <circle cx="330" cy="370" r="6" fill="#131d31" />
      <circle cx="310" cy="370" r="6" fill="#0284c7" />
      <circle cx="290" cy="370" r="6" fill="#0284c7" />
    </svg>
  );
};

export default CustomClipboardIcon;

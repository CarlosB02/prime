import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomGiftIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="88 96 336 328"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="giftCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="giftAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="giftCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <g transform="translate(0 -8)">
        {/* Bow */}
        <path d="M 256 184 C 214 108 144 116 158 162 C 168 196 222 196 256 184 Z" fill="url(#giftAzure)" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" />
        <path d="M 256 184 C 298 108 368 116 354 162 C 344 196 290 196 256 184 Z" fill="url(#giftAzure)" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" />
        {/* Box body */}
        <rect x="112" y="238" width="288" height="184" rx="28" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
        <rect x="116" y="242" width="280" height="176" rx="24" fill="#1e293b" fillOpacity="0.16" />
        {/* Lid */}
        <rect x="94" y="184" width="324" height="68" rx="22" fill="#0ea5e9" stroke="#0284c7" strokeWidth="8" />
        {/* Ribbon */}
        <rect x="236" y="188" width="40" height="60" fill="url(#giftCyanGlow)" />
        <rect x="236" y="256" width="40" height="162" fill="url(#giftCyanGlow)" />
        <line x1="116" y1="256" x2="396" y2="256" stroke="#e0f2fe" strokeWidth="4" opacity="0.5" />
        {/* Knot */}
        <rect x="232" y="164" width="48" height="36" rx="14" fill="url(#giftCyanGlow)" stroke="#e0f2fe" strokeWidth="6" />
        {/* Highlight */}
        <line x1="146" y1="290" x2="146" y2="370" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
};

export default CustomGiftIcon;

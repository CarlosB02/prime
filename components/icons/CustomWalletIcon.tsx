import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomWalletIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="80 90 352 328"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="walletCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="walletTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="walletAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Cards peeking out (behind body) */}
      <rect x="150" y="112" width="200" height="96" rx="18" fill="#1e293b" fillOpacity="0.18" stroke="#1e293b" strokeWidth="6" transform="rotate(6 250 160)" />
      <rect x="128" y="104" width="210" height="100" rx="18" fill="url(#walletAzure)" stroke="#1e293b" strokeWidth="7" transform="rotate(-8 233 154)" />
      <rect x="150" y="128" width="54" height="14" rx="7" fill="#131d31" fillOpacity="0.8" transform="rotate(-8 233 154)" />

      {/* Wallet body */}
      <rect x="88" y="160" width="320" height="250" rx="44" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" strokeLinejoin="round" />
      <rect x="92" y="164" width="312" height="242" rx="40" fill="url(#walletTintGrad)" />

      {/* Top fold band */}
      <path d="M 92 204 C 92 180 110 164 132 164 L 364 164 C 386 164 404 180 404 204 L 404 212 L 92 212 Z" fill="#0ea5e9" />
      <line x1="92" y1="212" x2="404" y2="212" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

      {/* Stitching accent */}
      <path d="M 124 238 L 124 360 Q 124 378 142 378 L 280 378" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" opacity="0.7" />

      {/* Clasp tab */}
      <rect x="292" y="248" width="132" height="80" rx="26" fill="#0ea5e9" stroke="#0284c7" strokeWidth="7" />
      <rect x="296" y="252" width="124" height="72" rx="22" fill="#1e293b" fillOpacity="0.12" />
      <circle cx="336" cy="288" r="16" fill="url(#walletCyanGlow)" stroke="#e0f2fe" strokeWidth="5" />
      <circle cx="331" cy="283" r="4" fill="#0b1120" fillOpacity="0.8" />
    </svg>
  );
};

export default CustomWalletIcon;

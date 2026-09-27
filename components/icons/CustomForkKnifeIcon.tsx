import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomForkKnifeIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="106 72 300 368"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="fkCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="fkAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Fork shape (vertical, centered on x=256) */}
        <g id="fkForkShape">
          <rect x="222" y="86" width="8" height="90" rx="4" />
          <rect x="242" y="86" width="8" height="90" rx="4" />
          <rect x="262" y="86" width="8" height="90" rx="4" />
          <rect x="282" y="86" width="8" height="90" rx="4" />
          <path d="M 216 160 L 296 160 L 296 176 Q 296 214 268 224 L 244 224 Q 216 214 216 176 Z" />
          <rect x="246" y="210" width="20" height="54" rx="8" />
          <rect x="236" y="252" width="40" height="176" rx="20" />
        </g>

        {/* Knife shape (vertical, centered on x=256) */}
        <g id="fkKnifeShape">
          <path d="M 236 100 Q 236 84 250 86 C 286 96 296 150 292 240 L 236 240 Z" />
          <rect x="238" y="230" width="36" height="28" rx="8" />
          <rect x="234" y="252" width="44" height="176" rx="22" />
        </g>
      </defs>

      {/* FORK (rotated left) */}
      <g transform="rotate(-24 256 256)">
        <use href="#fkForkShape" fill="none" stroke="#0284c7" strokeWidth="12" strokeLinejoin="round" />
        <use href="#fkForkShape" fill="#38bdf8" />
        <line x1="248" y1="280" x2="248" y2="340" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* KNIFE (rotated right, on top) */}
      <g transform="rotate(24 256 256)">
        {/* knockout for separation */}
        <use href="#fkKnifeShape" fill="none" stroke="#e0f2fe" strokeWidth="26" strokeLinejoin="round" />
        <use href="#fkKnifeShape" fill="none" stroke="#0284c7" strokeWidth="14" strokeLinejoin="round" />
        {/* handle + bolster */}
        <use href="#fkKnifeShape" fill="#38bdf8" />
        {/* blade (deep azure) */}
        <path d="M 236 100 Q 236 84 250 86 C 286 96 296 150 292 240 L 236 240 Z" fill="url(#fkAzure)" />
        <path d="M 252 104 C 276 116 282 160 280 222" fill="none" stroke="#131d31" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <rect x="238" y="230" width="36" height="28" rx="8" fill="#0ea5e9" />
        {/* rivets */}
        <circle cx="256" cy="300" r="7" fill="url(#fkCyanGlow)" />
        <circle cx="256" cy="372" r="7" fill="url(#fkCyanGlow)" />
      </g>
    </svg>
  );
};

export default CustomForkKnifeIcon;

import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomAppleIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="94 76 324 360"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="apCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="apTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="apAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <clipPath id="apAppleClip">
          <path d="M 256 176 C 226 150 162 146 126 190 C 88 236 98 320 134 370 C 160 406 196 424 226 412 C 242 406 270 406 286 412 C 316 424 352 406 378 370 C 414 320 424 236 386 190 C 350 146 286 150 256 176 Z" />
        </clipPath>
      </defs>

      {/* Stem */}
      <path d="M 256 180 C 254 152 260 130 274 112" fill="none" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" />

      {/* Leaf */}
      <path d="M 272 138 C 290 98 336 84 368 94 C 358 130 316 152 272 138 Z" fill="url(#apAzure)" stroke="#1e293b" strokeWidth="6" strokeLinejoin="round" />
      <path d="M 284 132 Q 318 116 348 102" fill="none" stroke="#131d31" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

      {/* Apple body */}
      <path
        d="M 256 176 C 226 150 162 146 126 190 C 88 236 98 320 134 370 C 160 406 196 424 226 412 C 242 406 270 406 286 412 C 316 424 352 406 378 370 C 414 320 424 236 386 190 C 350 146 286 150 256 176 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
      />

      {/* Single light-blue fill (clipped to apple) */}
      <g clipPath="url(#apAppleClip)">
        <rect x="96" y="140" width="330" height="290" fill="#1e293b" fillOpacity="0.16" />
      </g>

      {/* Highlight */}
      <path d="M 162 230 Q 140 270 154 322" fill="none" stroke="#131d31" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
      <circle cx="176" cy="208" r="6" fill="#131d31" opacity="0.75" />

      {/* Accent sparkle dot (fresh) */}
      <circle cx="340" cy="252" r="12" fill="url(#apCyanGlow)" />
    </svg>
  );
};

export default CustomAppleIcon;

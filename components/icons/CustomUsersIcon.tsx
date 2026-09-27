import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomUsersIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="94 126 324 286"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="userCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="userTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="userAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Back person (azure / cyan accent) */}
      <path
        d="M 250 366 L 262 300 C 280 278 298 266 320 266 C 368 266 404 302 404 348 Q 404 366 386 366 Z"
        fill="url(#userAzure)"
        fillOpacity="0.7"
        stroke="#1e293b"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <circle cx="320" cy="180" r="46" fill="url(#userAzure)" fillOpacity="0.7" stroke="#1e293b" strokeWidth="7" />
      <path d="M 300 158 A 28 28 0 0 1 326 150" fill="none" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

      {/* Front person: knockout outline for separation */}
      <g fill="none" stroke="#e0f2fe" strokeWidth="22" strokeLinejoin="round">
        <path d="M 110 380 C 110 318 160 284 220 284 C 280 284 330 318 330 380 Q 330 396 314 396 L 126 396 Q 110 396 110 380 Z" />
        <circle cx="220" cy="198" r="56" />
      </g>

      {/* Front person body */}
      <path
        d="M 110 380 C 110 318 160 284 220 284 C 280 284 330 318 330 380 Q 330 396 314 396 L 126 396 Q 110 396 110 380 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M 115 378 C 115 322 162 289 220 289 C 278 289 325 322 325 378 Q 325 391 312 391 L 128 391 Q 115 391 115 378 Z"
        fill="url(#userTintGrad)"
      />
      {/* Collar accent */}
      <path d="M 192 292 L 220 322 L 248 292" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="220" cy="352" r="9" fill="url(#userCyanGlow)" />

      {/* Front person head */}
      <circle cx="220" cy="198" r="56" fill="#0ea5e9" stroke="#0284c7" strokeWidth="8" />
      <circle cx="220" cy="198" r="52" fill="url(#userTintGrad)" />
      <path d="M 192 174 A 34 34 0 0 1 222 164" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
};

export default CustomUsersIcon;

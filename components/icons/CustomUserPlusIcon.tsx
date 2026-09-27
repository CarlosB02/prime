import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomUserPlusIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="82 100 352 308"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="userPlusCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="userPlusAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      <g transform="translate(6 -18)">
        {/* Body */}
        <path d="M 84 400 C 84 322 136 282 200 282 C 264 282 316 322 316 400 Q 316 416 300 416 L 100 416 Q 84 416 84 400 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" strokeLinejoin="round" />
        <path d="M 84 400 C 84 322 136 282 200 282 C 264 282 316 322 316 400 Q 316 416 300 416 L 100 416 Q 84 416 84 400 Z" fill="#1e293b" fillOpacity="0.16" />
        <path d="M 172 292 L 200 322 L 228 292" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Head */}
        <circle cx="200" cy="190" r="62" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
        <circle cx="200" cy="190" r="58" fill="#1e293b" fillOpacity="0.16" />
        <path d="M 168 166 A 38 38 0 0 1 202 154" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
        {/* Badge */}
        <circle cx="350" cy="336" r="62" fill="url(#userPlusCyanGlow)" stroke="#e0f2fe" strokeWidth="14" />
        <path d="M 350 312 L 350 360 M 326 336 L 374 336" fill="none" stroke="#e0f2fe" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default CustomUserPlusIcon;

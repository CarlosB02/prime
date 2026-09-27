import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomMoonIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="84 84 344 344"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{
        minWidth: typeof size === 'number' ? `${size}px` : size,
        minHeight: typeof size === 'number' ? `${size}px` : size,
      }}
      {...props}
    >
      <defs>
        <linearGradient id="moonCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="moonAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="moonCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      <g transform="translate(14 10)">
        <path
          d="M 253.7 106.0 A 150 150 0 1 0 402.3 289.3 A 118 118 0 0 1 253.7 106.0 Z"
          fill="url(#moonAzure)"
          stroke="#0ea5e9"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        <path
          d="M 150 250 A 108 108 0 0 0 214 350"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="186" cy="312" r="10" fill="#0ea5e9" fillOpacity="0.35" />
        <circle cx="160" cy="214" r="7" fill="#0ea5e9" fillOpacity="0.35" />
      </g>

      <path
        d="M 350 210 Q 350 238 378 238 Q 350 238 350 266 Q 350 238 322 238 Q 350 238 350 210 Z"
        fill="url(#moonCyanU)"
      />
      <path
        d="M 398 157 Q 398 172 413 172 Q 398 172 398 187 Q 398 172 383 172 Q 398 172 398 157 Z"
        fill="#38bdf8"
        opacity="0.8"
      />
    </svg>
  );
};

export default CustomMoonIcon;

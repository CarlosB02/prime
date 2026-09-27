import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomVitalIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="64 104 384 308"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="vitalCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="vitalAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Heart */}
      <path
        d="M 256 400 C 180 350 100 290 100 200 C 100 150 138 112 186 112 C 218 112 242 130 256 152 C 270 130 294 112 326 112 C 374 112 412 150 412 200 C 412 290 332 350 256 400 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M 256 400 C 180 350 100 290 100 200 C 100 150 138 112 186 112 C 218 112 242 130 256 152 C 270 130 294 112 326 112 C 374 112 412 150 412 200 C 412 290 332 350 256 400 Z"
        fill="#1e293b"
        fillOpacity="0.16"
      />
      <path d="M 150 170 Q 164 146 190 144" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      
      {/* Pulse line */}
      <path
        d="M 76 262 L 170 262 L 196 212 L 226 318 L 258 170 L 290 296 L 314 262 L 436 262"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 76 262 L 170 262 L 196 212 L 226 318 L 258 170 L 290 296 L 314 262 L 436 262"
        fill="none"
        stroke="url(#vitalCyanGlow)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="436" cy="262" r="10" fill="#0b1120" stroke="#1e293b" strokeWidth="5" />
    </svg>
  );
};

export default CustomVitalIcon;

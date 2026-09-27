import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomSunIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="76 76 360 360"
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
        <linearGradient id="sunCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="sunAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="sunCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Sun ray background stroke */}
      <path
        d="M 256.0 140.0 L 256.0 100.0 M 338.0 174.0 L 366.3 145.7 M 372.0 256.0 L 412.0 256.0 M 338.0 338.0 L 366.3 366.3 M 256.0 372.0 L 256.0 412.0 M 174.0 338.0 L 145.7 366.3 M 140.0 256.0 L 100.0 256.0 M 174.0 174.0 L 145.7 145.7"
        fill="none"
        stroke="#0b1120"
        strokeWidth="34"
        strokeLinecap="round"
      />

      {/* Sun ray glowing cyan stroke */}
      <path
        d="M 256.0 140.0 L 256.0 100.0 M 338.0 174.0 L 366.3 145.7 M 372.0 256.0 L 412.0 256.0 M 338.0 338.0 L 366.3 366.3 M 256.0 372.0 L 256.0 412.0 M 174.0 338.0 L 145.7 366.3 M 140.0 256.0 L 100.0 256.0 M 174.0 174.0 L 145.7 145.7"
        fill="none"
        stroke="url(#sunCyanU)"
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* Core Sun disk */}
      <circle cx="256" cy="256" r="84" fill="url(#sunCyanU)" stroke="#0b1120" strokeWidth="10" />
      <circle cx="256" cy="256" r="58" fill="none" stroke="#e0f2fe" strokeWidth="4" opacity="0.35" />
      <path
        d="M 208 236 A 50 50 0 0 1 236 208"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

export default CustomSunIcon;

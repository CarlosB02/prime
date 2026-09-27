import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomSettingsIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="88 88 336 336"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="gearCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="gearAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Gear body */}
      <path
        d="M 378.3 218.2 L 417.0 225.0 L 417.0 287.0 L 378.3 293.8 L 369.2 315.7 L 391.8 348.0 L 348.0 391.8 L 315.7 369.2 L 293.8 378.3 L 287.0 417.0 L 225.0 417.0 L 218.2 378.3 L 196.3 369.2 L 164.0 391.8 L 120.2 348.0 L 142.8 315.7 L 133.7 293.8 L 95.0 287.0 L 95.0 225.0 L 133.7 218.2 L 142.8 196.3 L 120.2 164.0 L 164.0 120.2 L 196.3 142.8 L 218.2 133.7 L 225.0 95.0 L 287.0 95.0 L 293.8 133.7 L 315.7 142.8 L 348.0 120.2 L 391.8 164.0 L 369.2 196.3 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M 378.3 218.2 L 417.0 225.0 L 417.0 287.0 L 378.3 293.8 L 369.2 315.7 L 391.8 348.0 L 348.0 391.8 L 315.7 369.2 L 293.8 378.3 L 287.0 417.0 L 225.0 417.0 L 218.2 378.3 L 196.3 369.2 L 164.0 391.8 L 120.2 348.0 L 142.8 315.7 L 133.7 293.8 L 95.0 287.0 L 95.0 225.0 L 133.7 218.2 L 142.8 196.3 L 120.2 164.0 L 164.0 120.2 L 196.3 142.8 L 218.2 133.7 L 225.0 95.0 L 287.0 95.0 L 293.8 133.7 L 315.7 142.8 L 348.0 120.2 L 391.8 164.0 L 369.2 196.3 Z"
        fill="#1e293b"
        fillOpacity="0.16"
      />
      <circle cx="256" cy="256" r="98" fill="none" stroke="#0284c7" strokeWidth="5" />
      <path d="M 178 214 A 90 90 0 0 1 214 178" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      {/* Hub */}
      <circle cx="256" cy="256" r="56" fill="url(#gearAzure)" stroke="#1e293b" strokeWidth="8" />
      <circle cx="256" cy="256" r="24" fill="#e0f2fe" stroke="url(#gearCyanGlow)" strokeWidth="7" />
    </svg>
  );
};

export default CustomSettingsIcon;

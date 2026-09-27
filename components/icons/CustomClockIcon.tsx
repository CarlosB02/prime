import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomClockIcon: React.FC<CustomIconProps> = ({
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
        <linearGradient id="clockCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="clockAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="clockCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="160" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
      <circle cx="256" cy="256" r="156" fill="#1e293b" fillOpacity="0.16" />
      <g>
        <line x1="256.0" y1="138.0" x2="256.0" y2="120.0" stroke="#131d31" strokeWidth="8" strokeLinecap="round" />
        <line x1="319.0" y1="146.9" x2="324.0" y2="138.2" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="365.1" y1="193.0" x2="373.8" y2="188.0" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="374.0" y1="256.0" x2="392.0" y2="256.0" stroke="#131d31" strokeWidth="8" strokeLinecap="round" />
        <line x1="365.1" y1="319.0" x2="373.8" y2="324.0" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="319.0" y1="365.1" x2="324.0" y2="373.8" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="256.0" y1="374.0" x2="256.0" y2="392.0" stroke="#131d31" strokeWidth="8" strokeLinecap="round" />
        <line x1="193.0" y1="365.1" x2="188.0" y2="373.8" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="146.9" y1="319.0" x2="138.2" y2="324.0" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="138.0" y1="256.0" x2="120.0" y2="256.0" stroke="#131d31" strokeWidth="8" strokeLinecap="round" />
        <line x1="146.9" y1="193.0" x2="138.2" y2="188.0" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <line x1="193.0" y1="146.9" x2="188.0" y2="138.2" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* Hour hand */}
      <path d="M 256 256 L 206 212" fill="none" stroke="#e0f2fe" strokeWidth="30" strokeLinecap="round" />
      <path d="M 256 256 L 206 212" fill="none" stroke="#075985" strokeWidth="18" strokeLinecap="round" />
      {/* Minute hand */}
      <path d="M 256 256 L 256 150" fill="none" stroke="#e0f2fe" strokeWidth="26" strokeLinecap="round" />
      <path d="M 256 256 L 256 150" fill="none" stroke="url(#clockCyanU)" strokeWidth="14" strokeLinecap="round" />
      {/* Hub */}
      <circle cx="256" cy="256" r="20" fill="#0ea5e9" stroke="#1e293b" strokeWidth="7" />
      <circle cx="256" cy="256" r="6" fill="#0b1120" />
    </svg>
  );
};

export default CustomClockIcon;

import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomAlertCircleIcon: React.FC<CustomIconProps> = ({
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
        <linearGradient id="alertCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="alertAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="alertCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="160" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
      <circle cx="256" cy="256" r="156" fill="#1e293b" fillOpacity="0.16" />
      <circle cx="256" cy="256" r="126" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
      <path d="M 140 196 A 126 126 0 0 1 196 140" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      <path d="M 256 166 L 256 290" fill="none" stroke="#e0f2fe" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 256 166 L 256 290" fill="none" stroke="url(#alertCyanU)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="256" cy="352" r="17" fill="url(#alertCyanGlow)" stroke="#e0f2fe" strokeWidth="6" />
    </svg>
  );
};

export default CustomAlertCircleIcon;

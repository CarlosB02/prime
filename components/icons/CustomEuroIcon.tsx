import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomEuroIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="120 120 300 272"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="euroCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="euroAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="euroCyanU" gradientUnits="userSpaceOnUse" x1="96" y1="96" x2="416" y2="416">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <g transform="translate(256 256) scale(1.4) translate(-244 -256)">
        <path
          d="M 322 180 A 94 94 0 1 0 322 332 M 168 232 L 282 232 M 168 282 L 270 282"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 322 180 A 94 94 0 1 0 322 332 M 168 232 L 282 232 M 168 282 L 270 282"
          fill="none"
          stroke="url(#euroCyanU)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CustomEuroIcon;

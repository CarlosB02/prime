import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomQuestionMarkIcon: React.FC<CustomIconProps> = ({
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
        <linearGradient id="qmCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="qmAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      <circle cx="256" cy="256" r="160" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
      <circle cx="256" cy="256" r="156" fill="#1e293b" fillOpacity="0.16" />
      <circle cx="256" cy="256" r="126" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
      <path d="M 140 196 A 126 126 0 0 1 196 140" fill="none" stroke="#131d31" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      {/* Question mark */}
      <path
        d="M 206 214 C 206 180 228 158 258 158 C 290 158 310 180 310 208 C 310 238 284 248 270 262 C 262 270 258 280 258 298"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 206 214 C 206 180 228 158 258 158 C 290 158 310 180 310 208 C 310 238 284 248 270 262 C 262 270 258 280 258 298"
        fill="none"
        stroke="url(#qmCyanGlow)"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="258" cy="354" r="17" fill="url(#qmCyanGlow)" stroke="#e0f2fe" strokeWidth="6" />
    </svg>
  );
};

export default CustomQuestionMarkIcon;

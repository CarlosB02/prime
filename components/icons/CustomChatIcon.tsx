import React from 'react';
import { CustomIconProps } from './CustomDashboardIcon';

export const CustomChatIcon: React.FC<CustomIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="76 88 356 328"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        <linearGradient id="chatCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="chatTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="chatAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Back bubble (deep azure, tail bottom-right) */}
      <path
        d="M 266 96 L 382 96 Q 422 96 422 136 L 422 204 Q 422 244 382 244 L 380 244 L 404 284 L 344 244 L 266 244 Q 226 244 226 204 L 226 136 Q 226 96 266 96 Z"
        fill="url(#chatAzure)"
        fillOpacity="0.75"
        stroke="#1e293b"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <rect x="262" y="126" width="126" height="13" rx="6.5" fill="#0b1120" fillOpacity="0.55" />
      <rect x="262" y="152" width="84" height="13" rx="6.5" fill="#0b1120" fillOpacity="0.35" />

      {/* Front bubble knockout for separation */}
      <path
        d="M 134 176 L 296 176 Q 340 176 340 220 L 340 310 Q 340 354 296 354 L 184 354 L 118 408 L 132 354 Q 90 354 90 310 L 90 220 Q 90 176 134 176 Z"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="22"
        strokeLinejoin="round"
      />

      {/* Front bubble (dark slate, tail bottom-left) */}
      <path
        d="M 134 176 L 296 176 Q 340 176 340 220 L 340 310 Q 340 354 296 354 L 184 354 L 118 408 L 132 354 Q 90 354 90 310 L 90 220 Q 90 176 134 176 Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M 134 180 L 296 180 Q 336 180 336 220 L 336 310 Q 336 350 296 350 L 134 350 Q 94 350 94 310 L 94 220 Q 94 180 134 180 Z"
        fill="url(#chatTintGrad)"
      />

      {/* Typing indicator pill */}
      <rect x="134" y="241" width="162" height="48" rx="24" fill="#1e293b" fillOpacity="0.12" stroke="#1e293b" strokeWidth="4" strokeOpacity="0.6" />
      <circle cx="167" cy="265" r="13" fill="#0284c7" />
      <circle cx="215" cy="265" r="13" fill="#131d31" fillOpacity="0.6" />
      <circle cx="263" cy="265" r="13" fill="url(#chatCyanGlow)" />

      {/* Inner highlight */}
      <path d="M 118 222 Q 118 204 136 204" fill="none" stroke="#131d31" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

export default CustomChatIcon;

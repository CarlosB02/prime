import React from 'react';

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const CustomDashboardIcon: React.FC<CustomIconProps> = ({
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
        <linearGradient id="dashCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="dashTintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="dashAzure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Gauge body */}
      <circle cx="256" cy="256" r="160" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" />
      <circle cx="256" cy="256" r="156" fill="url(#dashTintGrad)" />

      {/* Scale ticks */}
      <circle cx="133" cy="327" r="6" fill="#131d31" />
      <circle cx="133" cy="185" r="6" fill="#131d31" />
      <circle cx="256" cy="114" r="6" fill="#131d31" />
      <circle cx="379" cy="185" r="6" fill="#0284c7" />
      <circle cx="379" cy="327" r="6" fill="#0284c7" />

      {/* Track */}
      <path d="M 159 312 A 112 112 0 1 1 353 312" fill="none" stroke="#0ea5e9" strokeWidth="22" strokeLinecap="round" />
      <path d="M 159 312 A 112 112 0 1 1 353 312" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

      {/* Active arc */}
      <path d="M 159 312 A 112 112 0 0 1 322 165" fill="none" stroke="url(#dashCyanGlow)" strokeWidth="22" strokeLinecap="round" />

      {/* Needle */}
      <line x1="256" y1="256" x2="305" y2="188" stroke="#e0f2fe" strokeWidth="16" strokeLinecap="round" />
      <line x1="256" y1="256" x2="305" y2="188" stroke="#0b1120" strokeWidth="8" strokeLinecap="round" />

      {/* Hub */}
      <circle cx="256" cy="256" r="24" fill="#0ea5e9" stroke="#1e293b" strokeWidth="7" />
      <circle cx="256" cy="256" r="8" fill="url(#dashCyanGlow)" />

      {/* Readout pill */}
      <rect x="214" y="326" width="84" height="28" rx="14" fill="url(#dashAzure)" stroke="#1e293b" strokeWidth="5" />
      <rect x="230" y="336" width="36" height="8" rx="4" fill="#0b1120" fillOpacity="0.6" />
    </svg>
  );
};

export default CustomDashboardIcon;

import React from 'react';

export interface CustomCalendarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const CustomCalendarIcon: React.FC<CustomCalendarIconProps> = ({ 
  size = 20, 
  className = '', 
  ...props 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="96 82 320 346" 
      width={size} 
      height={size} 
      className={`inline-block shrink-0 ${className}`}
      style={{ minWidth: typeof size === 'number' ? `${size}px` : size, minHeight: typeof size === 'number' ? `${size}px` : size }}
      {...props}
    >
      <defs>
        {/* Cyan Electric Accents */}
        <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#131d31" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Subtle Cyan Tint Fill */}
        <linearGradient id="tintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* Calendar Body Fill */}
      <rect x="100" y="118" width="312" height="306" rx="44" fill="#38bdf8" stroke="#0284c7" strokeWidth="8" strokeLinejoin="round" />
      
      {/* Subtle Internal Cyan Tint */}
      <rect x="104" y="122" width="304" height="298" rx="40" fill="url(#tintGrad)" />

      {/* Calendar Header Bar Fill (Deep Slate) */}
      <path d="M 104 162 C 104 138 122 122 144 122 L 368 122 C 390 122 408 138 408 162 L 408 200 L 104 200 Z" fill="#0ea5e9" />
      <line x1="104" y1="200" x2="408" y2="200" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

      {/* Binder Rings / Pegs */}
      {/* Left Ring */}
      <rect x="166" y="86" width="28" height="66" rx="14" fill="#e0f2fe" stroke="#1e293b" strokeWidth="7" />
      {/* Right Ring */}
      <rect x="318" y="86" width="28" height="66" rx="14" fill="#e0f2fe" stroke="#1e293b" strokeWidth="7" />

      {/* Calendar Modern Fitness/Activity Schedule Grid Dots */}
      {/* Row 1 */}
      <circle cx="162" cy="248" r="9" fill="#0284c7" />
      <circle cx="214" cy="248" r="9" fill="#0284c7" />
      <circle cx="266" cy="248" r="9" fill="#0284c7" />
      <circle cx="318" cy="248" r="10" fill="#1e293b" />
      <circle cx="350" cy="248" r="9" fill="#0284c7" />

      {/* Row 2 */}
      <circle cx="162" cy="296" r="9" fill="#0284c7" />
      <circle cx="214" cy="296" r="10" fill="#1e293b" />
      <circle cx="266" cy="296" r="9" fill="#0284c7" />
      <circle cx="318" cy="296" r="9" fill="#0284c7" />
      <circle cx="350" cy="296" r="10" fill="#1e293b" />

      {/* Row 3 & Highlighted Active Workout / Schedule Badge */}
      {/* Dynamic Activity Highlight (Pill indicator) */}
      <rect x="148" y="338" width="132" height="42" rx="21" fill="#1e293b" fillOpacity="0.16" stroke="#1e293b" strokeWidth="4" strokeDasharray="1 0" />
      <circle cx="174" cy="359" r="8" fill="#131d31" />
      <circle cx="214" cy="359" r="8" fill="#131d31" />
      <circle cx="254" cy="359" r="8" fill="#131d31" />

      {/* Additional Rest / Inactive Day Dots */}
      <circle cx="318" cy="359" r="9" fill="#0284c7" />
      <circle cx="350" cy="359" r="9" fill="#0284c7" />
    </svg>
  );
};

export default CustomCalendarIcon;

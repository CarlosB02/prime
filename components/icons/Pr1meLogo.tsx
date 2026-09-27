import React from 'react';

export interface Pr1meLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const Pr1meLogo: React.FC<Pr1meLogoProps> = ({
  size = 36,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-15 -10 890 1025"
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
        {/* Glow & 3D Shadow */}
        <filter id="primeFilterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="16" floodColor="#00d4ff" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0066cc" floodOpacity="0.6" />
        </filter>

        {/* Metallic Gradient for the Outer Loop */}
        <linearGradient id="primeLoopMetal" x1="10%" y1="0%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="18%" stopColor="#00a6ff" />
          <stop offset="48%" stopColor="#006ad1" />
          <stop offset="78%" stopColor="#004499" />
          <stop offset="100%" stopColor="#001e4d" />
        </linearGradient>

        {/* Metallic Gradient for the Left Stem */}
        <linearGradient id="primeStemMetal" x1="100%" y1="10%" x2="10%" y2="95%">
          <stop offset="0%" stopColor="#00bfff" />
          <stop offset="25%" stopColor="#0080ea" />
          <stop offset="55%" stopColor="#004f9e" />
          <stop offset="85%" stopColor="#002b66" />
          <stop offset="100%" stopColor="#001438" />
        </linearGradient>

        {/* Glowing Neon Cyan Edge */}
        <linearGradient id="primeCyanEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>

        {/* 3D Specular Highlight on Arches */}
        <linearGradient id="primeSpecular" x1="20%" y1="0%" x2="80%" y2="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.65" />
          <stop offset="75%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>

        {/* Inner Bevel Rim Highlight */}
        <linearGradient id="primeInnerRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      <g id="prime-logo-group" filter="url(#primeFilterGlow)">
        {/* ==============================================
            1. MAIN OUTER LOOP (The Curved "P" Arch)
           ============================================== */}
        {/* Dark bevel outline for deep 3D pop */}
        <path
          d="M 10,10 L 570,10 C 750,10 860,130 860,290 C 860,450 750,580 570,580 L 280,580 L 395,465 L 550,465 C 655,465 720,390 720,290 C 720,190 655,125 550,125 L 125,125 Z"
          fill="url(#primeLoopMetal)"
          stroke="#001433"
          strokeWidth="18"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />

        {/* Neon Cyan Outer Edge Rim */}
        <path
          d="M 10,10 L 570,10 C 750,10 860,130 860,290 C 860,450 750,580 570,580 L 280,580 L 395,465 L 550,465 C 655,465 720,390 720,290 C 720,190 655,125 550,125 L 125,125 Z"
          fill="url(#primeLoopMetal)"
          stroke="url(#primeCyanEdge)"
          strokeWidth="10"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />

        {/* Inner Beveled Plate Line */}
        <path
          d="M 26,22 L 566,22 C 735,22 842,135 842,290 C 842,442 735,568 566,568 L 295,568 L 395,468 L 550,468 C 650,468 705,395 705,290 C 705,185 650,137 550,137 L 140,137 Z"
          fill="none"
          stroke="url(#primeInnerRim)"
          strokeWidth="4"
          strokeOpacity="0.9"
        />

        {/* Specular White-Cyan Top Reflection */}
        <path
          d="M 35,16 L 565,16 C 730,16 830,115 840,240"
          fill="none"
          stroke="url(#primeSpecular)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* ==============================================
            2. STEM & CHEVRON (The Lower "P" Leg)
           ============================================== */}
        {/* Dark bevel outline for 3D depth */}
        <path
          d="M 265,275 L 435,275 L 195,515 L 195,990 L 65,860 L 65,475 Z"
          fill="url(#primeStemMetal)"
          stroke="#001433"
          strokeWidth="18"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />

        {/* Neon Cyan Outer Edge Rim */}
        <path
          d="M 265,275 L 435,275 L 195,515 L 195,990 L 65,860 L 65,475 Z"
          fill="url(#primeStemMetal)"
          stroke="url(#primeCyanEdge)"
          strokeWidth="10"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />

        {/* Inner Inset Facet for Stem */}
        <path
          d="M 280,287 L 416,287 L 183,520 L 183,968 L 77,862 L 77,482 Z"
          fill="none"
          stroke="url(#primeInnerRim)"
          strokeWidth="4"
          strokeOpacity="0.9"
        />

        {/* Specular Edge Reflection along Left Outer Angle */}
        <path
          d="M 275,280 L 70,480 L 70,850"
          fill="none"
          stroke="url(#primeSpecular)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export interface Pr1meBrandProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
  className?: string;
}

export const Pr1meBrand: React.FC<Pr1meBrandProps> = ({
  size = 36,
  showText = true,
  textSize = 'text-2xl',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full pointer-events-none" />
        <Pr1meLogo size={size} className="relative z-10" />
      </div>
      {showText && (
        <span className={`font-black ${textSize} tracking-tight lowercase bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent font-sans select-none drop-shadow-sm`}>
          pr<span className="text-cyan-400 font-extrabold">1</span>me
        </span>
      )}
    </div>
  );
};

export default Pr1meLogo;

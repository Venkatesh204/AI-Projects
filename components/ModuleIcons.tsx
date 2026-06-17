
import React from 'react';

interface IconProps {
    className?: string;
}

const sharedDefs = (
    <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
        </linearGradient>
         <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#d946ef', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        </linearGradient>
    </defs>
);

export const AdditionIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {sharedDefs}
        <g style={{ filter: 'url(#dropShadow)' }}>
            <rect x="10" y="30" width="30" height="30" rx="3" fill="url(#grad1)" transform="skewY(-10)"/>
            <rect x="60" y="30" width="30" height="30" rx="3" fill="url(#grad2)" transform="skewY(-10)"/>
            <text x="45" y="52" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">+</text>
        </g>
    </svg>
);

export const SubtractionIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {sharedDefs}
        <g style={{ filter: 'url(#dropShadow)' }}>
            <rect x="10" y="30" width="30" height="30" rx="3" fill="url(#grad1)" transform="skewY(-10)"/>
            <rect x="60" y="30" width="30" height="30" rx="3" fill="url(#grad3)" transform="skewY(-10)"/>
            <text x="45" y="52" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">-</text>
        </g>
    </svg>
);

export const ScalarMultiplicationIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {sharedDefs}
        <g style={{ filter: 'url(#dropShadow)' }}>
            <rect x="40" y="25" width="50" height="50" rx="5" fill="url(#grad3)" transform="skewY(-10)"/>
            <circle cx="25" cy="50" r="18" fill="url(#grad4)" />
            <text x="25" y="56" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">k</text>
            <text x="38" y="52" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">×</text>
        </g>
    </svg>
);

export const MatrixMultiplicationIcon: React.FC<IconProps> = ({ className }) => (
     <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {sharedDefs}
        <g style={{ filter: 'url(#dropShadow)' }} transform="translate(5, 5)">
            <rect x="5" y="50" width="40" height="25" rx="3" fill="url(#grad1)" transform="skewY(-15)" />
            <rect x="60" y="15" width="25" height="40" rx="3" fill="url(#grad2)" transform="skewX(-15)" />
            <text x="52" y="50" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">×</text>
        </g>
    </svg>
);

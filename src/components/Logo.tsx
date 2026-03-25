import React from 'react';

export const Logo = ({ className = "w-12 h-12", color = "currentColor" }: { className?: string, color?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circles */}
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="2" />
      
      {/* Diagonal Line */}
      <line x1="10" y1="60" x2="90" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
      
      {/* Text "n'" */}
      <text 
        x="50" 
        y="32" 
        fill={color} 
        fontSize="12" 
        fontFamily="serif" 
        fontStyle="italic" 
        textAnchor="middle"
      >
        n'
      </text>
      
      {/* Text "OB" */}
      <text 
        x="50" 
        y="65" 
        fill={color} 
        fontSize="42" 
        fontFamily="serif" 
        fontStyle="italic" 
        fontWeight="bold"
        textAnchor="middle"
      >
        OB
      </text>
    </svg>
  );
};

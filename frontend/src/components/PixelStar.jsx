import React from 'react';

export default function PixelStar({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-deco">
      <rect x="7" y="1" width="2" height="6" fill="#ffe066" />
      <rect x="1" y="7" width="6" height="2" fill="#ffe066" />
      <rect x="9" y="7" width="6" height="2" fill="#ffe066" />
      <rect x="4" y="4" width="8" height="8" fill="#ffe066" />
      <rect x="7" y="9" width="2" height="6" fill="#ffe066" />
    </svg>
  );
} 
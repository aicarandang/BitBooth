import React from 'react';

export default function PixelHeart({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-deco">
      <rect x="3" y="1" width="3" height="3" fill="#e63946" />
      <rect x="10" y="1" width="3" height="3" fill="#e63946" />
      <rect x="2" y="4" width="12" height="3" fill="#e63946" />
      <rect x="1" y="7" width="14" height="3" fill="#e63946" />
      <rect x="2" y="10" width="12" height="3" fill="#e63946" />
      <rect x="4" y="13" width="8" height="2" fill="#e63946" />
    </svg>
  );
} 
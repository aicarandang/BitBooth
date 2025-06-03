import React from 'react';

export default function PixelCloud({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-deco">
      <rect x="3" y="8" width="10" height="4" fill="#b3e0ff" />
      <rect x="5" y="6" width="6" height="4" fill="#b3e0ff" />
      <rect x="7" y="4" width="2" height="4" fill="#b3e0ff" />
    </svg>
  );
} 
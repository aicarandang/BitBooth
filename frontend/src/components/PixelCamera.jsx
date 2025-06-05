import React from 'react';
import '../styles/Welcome.css';

export default function PixelCamera({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className="pixel-deco pixel-camera"
    >
      {/* Camera body */}
      <rect x="4" y="10" width="24" height="14" fill="#222" />
      <rect x="6" y="12" width="20" height="10" fill="#b3e0ff" />
      {/* Lens */}
      <rect x="14" y="15" width="4" height="4" fill="#fff" />
      <rect x="15" y="16" width="2" height="2" fill="#5dc1e3" />
      {/* Top bar */}
      <rect x="10" y="8" width="12" height="4" fill="#444" />
      {/* Shutter button */}
      <rect x="22" y="6" width="3" height="3" fill="#ffe066" />
      {/* Animated red light */}
      <rect x="7" y="13" width="2" height="2" className="pixel-camera-light" />
    </svg>
  );
} 
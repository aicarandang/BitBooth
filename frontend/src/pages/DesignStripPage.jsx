import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "../styles/Design.css";
import Sticker1Img from '../assets/images/Sticker1.png';
import Sticker2Img from '../assets/images/Sticker2.png';
import Sticker3Img from '../assets/images/Sticker3.png';
import Sticker4Img from '../assets/images/Sticker4.png';
import Sticker5Img from '../assets/images/Sticker5.png';
import Sticker6Img from '../assets/images/Sticker6.png';
import Sticker7Img from '../assets/images/Sticker7.png';
import Sticker8Img from '../assets/images/Sticker8.png';
import Sticker9Img from '../assets/images/Sticker9.png';
import Sticker10Img from '../assets/images/Sticker10.png';
import Sticker11Img from '../assets/images/Sticker11.png';
import Sticker12Img from '../assets/images/Sticker12.png';
import Sticker13Img from '../assets/images/Sticker13.png';
import Sticker14Img from '../assets/images/Sticker14.png';
import Sticker15Img from '../assets/images/Sticker15.png';
import Sticker16Img from '../assets/images/Sticker16.png';

const frameColors = [
  '#000000', // Black
  '#e63946', // Red
  '#f59e42', // Orange
  '#ffe066', // Yellow
  '#22c55e', // Green
  '#2563eb', // Blue
  '#a855f7', // Purple
  '#f472b6', // Pink
  '#38bdf8', // Teal
  '#a0522d', // Brown
  '#a3e635', // Lime
];

const bgThemes = [
  '#b3e0ff', '#60a5fa', '#2563eb', '#1e293b', '#fbbf24', '#f472b6', 
  '#a3e635', '#38bdf8', '#f59e42', '#f43f5e', '#a855f7', '#ec4899',
];

const FILTER_OPTIONS = [
  { name: 'normal', label: 'Normal', css: '' },
  { name: 'vintage', label: 'Vintage', css: 'sepia(0.5) contrast(1.1) brightness(0.9)' },
  { name: 'grayscale', label: 'B&W', css: 'grayscale(1)' },
  { name: 'warm', label: 'Warm', css: 'sepia(0.3) saturate(1.5) brightness(1.1)' },
  { name: 'cool', label: 'Cool', css: 'hue-rotate(30deg) saturate(1.2)' },
  { name: 'dramatic', label: 'Dramatic', css: 'contrast(1.4) brightness(0.9) saturate(1.2)' },
  { name: 'fade', label: 'Fade', css: 'opacity(0.8) contrast(0.9) brightness(1.1)' },
  { name: 'vibrant', label: 'Vibrant', css: 'saturate(1.5) contrast(1.2)' },
  { name: 'invert', label: 'Invert', css: 'invert(1)' },
  { name: 'softglow', label: 'Soft Glow', css: 'brightness(1.2) blur(1px)' },
  { name: 'posterize', label: 'Posterize', css: 'contrast(2) saturate(0.7) grayscale(0.3)' },
  { name: 'duotone', label: 'Duotone', css: 'grayscale(1) contrast(1.2) sepia(0.7) hue-rotate(250deg)' },
];

const STRIP_DIMENSIONS = {
  '3x1': { height: 670, width: 270, photoH: 180, photoW: 240, rows: 3, cols: 1, footer: 80, top: 30, gap: 12 },
  '3x2': { height: 670, width: 350, photoH: 180, photoW: 158.49, rows: 3, cols: 2, footer: 80, top: 30, gap: 12 },
  '4x1': { height: 670, width: 270, photoH: 132.6, photoW: 234.78, rows: 4, cols: 1, footer: 80, top: 30, gap: 12 },
  '4x2': { height: 670, width: 350, photoH: 132.6, photoW: 159.54, rows: 4, cols: 2, footer: 80, top: 30, gap: 12 },
};

const BG_DESIGNS = [
  {
    name: 'no-theme',
    label: 'No Theme',
    style: { background: '#fff' },
    renderPreview: () => (
      <div className="bg-design-preview">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <line x1="3" y1="3" x2="15" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="3" x2="3" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  ...Array.from({ length: 11 }).map((_, i) => ({
    name: `placeholder-${i+1}`,
    label: 'Coming Soon',
    style: { background: '#e0e0e0' },
    renderPreview: () => (
      <div className="bg-design-preview-placeholder">?</div>
    )
  })),
];

const STICKER_GRID = [
  [
    { name: 'sticker1', src: Sticker1Img },
    { name: 'sticker2', src: Sticker2Img },
    { name: 'sticker3', src: Sticker3Img },
    { name: 'sticker4', src: Sticker4Img },
  ],
  [
    { name: 'sticker5', src: Sticker5Img },
    { name: 'sticker6', src: Sticker6Img },
    { name: 'sticker7', src: Sticker7Img },
    { name: 'sticker8', src: Sticker8Img },
  ],
  [
    { name: 'sticker9', src: Sticker9Img },
    { name: 'sticker10', src: Sticker10Img },
    { name: 'sticker11', src: Sticker11Img },
    { name: 'sticker12', src: Sticker12Img },
  ],
  [
    { name: 'sticker13', src: Sticker13Img },
    { name: 'sticker14', src: Sticker14Img },
    { name: 'sticker15', src: Sticker15Img },
    { name: 'sticker16', src: Sticker16Img },
  ],
];

function getTemplateKey() {
  return localStorage.getItem("stripSize") || '3x1';
}

function getTemplate() {
  const key = getTemplateKey();
  return STRIP_DIMENSIONS[key] || STRIP_DIMENSIONS['3x1'];
}

const getPhotos = () => {
  try {
    return JSON.parse(localStorage.getItem("capturedPhotos")) || [];
  } catch {
    return [];
  }
};

const CARD_WIDTH = 1100;
const CARD_HEIGHT = 650; 
const CARD_PADDING_TOP = 1.2 * 16; 
const CARD_PADDING_BOTTOM = 2.1 * 16; 
const STRIP_MARGIN = 8; 

const DesignStripPage = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [frameColor, setFrameColor] = useState('#fff');
  const [bgColor, setBgColor] = useState('#b3e0ff');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const tpl = getTemplate();
  const stripPreviewRef = useRef(null);
  const cardRef = useRef(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [selectedBgDesign, setSelectedBgDesign] = useState(BG_DESIGNS[0].name);
  const [customFrameColor, setCustomFrameColor] = useState('#e100dd');
  const colorInputRef = useRef();
  const [stickers, setStickers] = useState([]);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const stickerIdRef = useRef(0);
  const dragState = useRef({ action: null, stickerId: null, startX: 0, startY: 0, orig: null });
  const [sliderScale, setSliderScale] = useState(1);
  const [sliderRotate, setSliderRotate] = useState(0);
  const [stripReady, setStripReady] = useState(false);

  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    let cardW = CARD_WIDTH;
    let cardH = CARD_HEIGHT;
    if (card) {
      cardW = card.offsetWidth;
      cardH = card.offsetHeight;
    }
    const availW = cardW / 2 - STRIP_MARGIN; 
    const availH = cardH - CARD_PADDING_TOP - CARD_PADDING_BOTTOM - STRIP_MARGIN * 2;
    const aspect = tpl.height / tpl.width;
    let stripW = availW;
    let stripH = stripW * aspect;
    if (stripH > availH) {
      stripH = availH;
      stripW = stripH / aspect;
    }
    if (stripPreviewRef.current) {
      const el = stripPreviewRef.current.style;
      const scaleW = stripW / tpl.width;
      const scaleH = stripH / tpl.height;
      const scale = Math.min(scaleW, scaleH);
      el.setProperty('--strip-width', `${tpl.width * scale}px`);
      el.setProperty('--strip-height', `${tpl.height * scale}px`);
      el.setProperty('--photo-width', `${tpl.photoW * scale}px`);
      el.setProperty('--photo-height', `${tpl.photoH * scale}px`);
      el.setProperty('--grid-gap', `${tpl.gap * scale}px`);
      el.setProperty('--grid-rows', tpl.rows);
      el.setProperty('--grid-cols', tpl.cols);
      el.setProperty('--footer-height', `${tpl.footer * scale}px`);
      el.setProperty('--top-margin', `${tpl.top * scale}px`);
      el.setProperty('--frame-color', frameColor);
      setStripReady(true);
    } else {
      setStripReady(false);
    }
  }, [tpl, frameColor]);

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragState.current.action) return;
      setStickers(prev => prev.map(sticker => {
        if (sticker.id !== dragState.current.stickerId) return sticker;
        const { orig } = dragState.current;
        // Center-based logic
        if (dragState.current.action === 'move') {
          const dx = e.clientX - dragState.current.startX;
          const dy = e.clientY - dragState.current.startY;
          // Get strip boundaries
          const stripEl = stripPreviewRef.current;
          if (!stripEl) return sticker;
          const stripRect = stripEl.getBoundingClientRect();
          const stickerSize = 48 * orig.scale; 
          const halfSize = stickerSize / 2;
          // Calculate new center position
          let newX = orig.x + dx;
          let newY = orig.y + dy;
          // Constrain center so the whole sticker stays inside
          newX = Math.max(halfSize, Math.min(newX, stripRect.width - halfSize));
          newY = Math.max(halfSize, Math.min(newY, stripRect.height - halfSize));
          return { ...sticker, x: newX, y: newY };
        } else if (dragState.current.action === 'resize') {
          const centerX = orig.x;
          const centerY = orig.y;
          const startDist = Math.hypot(dragState.current.startX - centerX, dragState.current.startY - centerY);
          const currDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
          let scale = orig.scale * (currDist / Math.max(30, startDist));
          scale = Math.max(0.3, Math.min(3, scale));
          // Keep sticker inside bounds
          const stripEl = stripPreviewRef.current;
          if (stripEl) {
            const stripRect = stripEl.getBoundingClientRect();
            const halfSize = (48 * scale) / 2;
            let newX = orig.x;
            let newY = orig.y;
            newX = Math.max(halfSize, Math.min(newX, stripRect.width - halfSize));
            newY = Math.max(halfSize, Math.min(newY, stripRect.height - halfSize));
            return { ...sticker, scale, x: newX, y: newY };
          }
          return { ...sticker, scale };
        } else if (dragState.current.action === 'rotate') {
          const centerX = orig.x;
          const centerY = orig.y;
          const angle0 = Math.atan2(dragState.current.startY - centerY, dragState.current.startX - centerX);
          const angle1 = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          let deg = orig.rotation + (angle1 - angle0) * 180 / Math.PI;
          return { ...sticker, rotation: deg };
        }
        return sticker;
      }));
    }
    function onMouseUp() {
      dragState.current.action = null;
      dragState.current.stickerId = null;
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Save photo strip as PNG
  const handleSaveStrip = async () => {
    const targetHeight = 1200;
    const scale = targetHeight / tpl.height;
    const targetWidth = Math.round(tpl.width * scale);
    const cellW = tpl.photoW * scale;
    const cellH = tpl.photoH * scale;
    const gap = tpl.gap * scale;
    const topMargin = tpl.top * scale;
    const footerHeight = tpl.footer * scale;
    const borderWidth = 4 * scale;
    const photoBorderWidth = 2 * scale;
    const photoRadius = 4 * scale;
    
    // Get preview strip's actual pixel size
    let previewWidth = tpl.width;
    let previewHeight = tpl.height;
    if (stripPreviewRef.current) {
      const previewRect = stripPreviewRef.current.getBoundingClientRect();
      previewWidth = previewRect.width;
      previewHeight = previewRect.height;
    }
    
    // Create canvas 
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw border
    ctx.save();
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(borderWidth/2, borderWidth/2, targetWidth - borderWidth, targetHeight - borderWidth);
    ctx.restore();
    
    // Draw grid of photos
    const gridW = tpl.cols * cellW + (tpl.cols - 1) * gap;
    const gridH = tpl.rows * cellH + (tpl.rows - 1) * gap;
    const gridX = (targetWidth - gridW) / 2;
    const gridY = topMargin + borderWidth;
    
    for (let idx = 0; idx < tpl.rows * tpl.cols; idx++) {
      const imgSrc = photos[idx];
      const col = idx % tpl.cols;
      const row = Math.floor(idx / tpl.cols);
      const dx = gridX + col * (cellW + gap);
      const dy = gridY + row * (cellH + gap);
      
      // Draw photo background and border
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dx + photoRadius, dy);
      ctx.lineTo(dx + cellW - photoRadius, dy);
      ctx.quadraticCurveTo(dx + cellW, dy, dx + cellW, dy + photoRadius);
      ctx.lineTo(dx + cellW, dy + cellH - photoRadius);
      ctx.quadraticCurveTo(dx + cellW, dy + cellH, dx + cellW - photoRadius, dy + cellH);
      ctx.lineTo(dx + photoRadius, dy + cellH);
      ctx.quadraticCurveTo(dx, dy + cellH, dx, dy + cellH - photoRadius);
      ctx.lineTo(dx, dy + photoRadius);
      ctx.quadraticCurveTo(dx, dy, dx + photoRadius, dy);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = '#d0e3f0';
      ctx.fillRect(dx, dy, cellW, cellH);
      
      // Draw photo if exists
      if (imgSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSrc;
        await new Promise((resolve) => { img.onload = resolve; });
        
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        const srcAspect = sw / sh;
        const tgtAspect = cellW / cellH;
        let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
        
        if (srcAspect > tgtAspect) {
          sWidth = sh * tgtAspect;
          sx = (sw - sWidth) / 2;
        } else {
          sHeight = sw / tgtAspect;
          sy = (sh - sHeight) / 2;
        }
        
        const filter = FILTER_OPTIONS.find(f => f.name === selectedFilter);
        if (filter && filter.css) {
          const filterCanvas = document.createElement('canvas');
          filterCanvas.width = cellW;
          filterCanvas.height = cellH;
          const filterCtx = filterCanvas.getContext('2d');
          
          filterCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cellW, cellH);
          filterCtx.filter = filter.css;
          filterCtx.drawImage(filterCanvas, 0, 0);
          
          ctx.drawImage(filterCanvas, dx, dy);
        } else {
          ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, cellW, cellH);
        }
      }
      ctx.restore();
      
      // Draw photo border
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dx + photoRadius, dy);
      ctx.lineTo(dx + cellW - photoRadius, dy);
      ctx.quadraticCurveTo(dx + cellW, dy, dx + cellW, dy + photoRadius);
      ctx.lineTo(dx + cellW, dy + cellH - photoRadius);
      ctx.quadraticCurveTo(dx + cellW, dy + cellH, dx + cellW - photoRadius, dy + cellH);
      ctx.lineTo(dx + photoRadius, dy + cellH);
      ctx.quadraticCurveTo(dx, dy + cellH, dx, dy + cellH - photoRadius);
      ctx.lineTo(dx, dy + photoRadius);
      ctx.quadraticCurveTo(dx, dy, dx + photoRadius, dy);
      ctx.closePath();
      ctx.lineWidth = photoBorderWidth;
      ctx.strokeStyle = '#333';
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw applied stickers
    for (const sticker of stickers.filter(s => s.applied)) {
      const stickerImg = new Image();
      stickerImg.src = sticker.src;
      await new Promise((resolve) => { stickerImg.onload = resolve; });
      // Center-based scaling
      const stickerCenterX = (sticker.x / previewWidth) * targetWidth;
      const stickerCenterY = (sticker.y / previewHeight) * targetHeight;
      const stickerSize = (48 * sticker.scale / previewWidth) * targetWidth;
      ctx.save();
      ctx.translate(stickerCenterX, stickerCenterY);
      ctx.rotate(sticker.rotation * Math.PI / 180);
      ctx.drawImage(stickerImg, -stickerSize/2, -stickerSize/2, stickerSize, stickerSize);
      ctx.restore();
    }
    
    // Download
    const link = document.createElement('a');
    link.download = 'photo-strip.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleBack = () => {
    localStorage.setItem('captureCurrentIndex', -1);
    navigate('/capture', { state: { fromDesign: true } });
  };

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (idx, e) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDragLeave = () => setDragOverIdx(null);
  const handleDrop = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setPhotos((prev) => {
      const updated = [...prev];
      [updated[draggedIdx], updated[idx]] = [updated[idx], updated[draggedIdx]];
      return updated;
    });
    setDraggedIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleFilterSelect = (filterName) => {
    setSelectedFilter(filterName);
  };

  // Add sticker to strip
  const handleAddSticker = (src) => {
    const newStickerId = stickerIdRef.current;
    let centerX = 100;
    let centerY = 100;
    if (stripPreviewRef.current) {
      const stripRect = stripPreviewRef.current.getBoundingClientRect();
      centerX = stripRect.width / 2;
      centerY = stripRect.height / 2;
    }
    setStickers((prev) => [
      ...prev,
      {
        id: newStickerId,
        src,
        x: centerX,
        y: centerY,
        scale: 1,
        rotation: 0,
        applied: false,
      },
    ]);
    setActiveStickerId(newStickerId);
    stickerIdRef.current++;
  };

  // Update sliders when active sticker changes
  useEffect(() => {
    const sticker = stickers.find(s => s.id === activeStickerId);
    if (sticker) {
      setSliderScale(sticker.scale);
      setSliderRotate(sticker.rotation);
    }
  }, [activeStickerId, stickers]);

  // Update sticker in real time when sliders move
  const handleSliderChange = (type, value) => {
    setStickers(prev => prev.map(sticker => {
      if (sticker.id !== activeStickerId) return sticker;
      if (type === 'scale') return { ...sticker, scale: value };
      if (type === 'rotate') return { ...sticker, rotation: value };
      return sticker;
    }));
    if (type === 'scale') setSliderScale(value);
    if (type === 'rotate') setSliderRotate(value);
  };

  useEffect(() => {
    function handleDeselect(e) {
      const stickerEls = document.querySelectorAll('.strip-preview [data-sticker]');
      for (const el of stickerEls) {
        if (el.contains(e.target)) return;
      }
      const rightSide = document.querySelector('.design-right-side');
      if (rightSide && rightSide.contains(e.target)) return;
      setActiveStickerId(null);
    }
    document.addEventListener('mousedown', handleDeselect);
    return () => document.removeEventListener('mousedown', handleDeselect);
  }, []);

  return (
    <div className="design-strip-page">
      <div className="design-scale-wrapper">
        <div className="design-card" ref={cardRef}>
          <div className="design-scroll-x">
            <div className="design-content-row">
              <div className="design-left">
                <div className="design-color-pickers">
                  <div className="design-section-filter">
                    <div className="design-color-section">
                      <div className="design-color-title">filter</div>
                      <div className="design-filter-grid">
                        {FILTER_OPTIONS.map((filter, idx) => (
                          <div
                            key={filter.name}
                            className={`design-filter-item${selectedFilter === filter.name ? ' selected' : ''}`}
                            onClick={() => handleFilterSelect(filter.name)}
                            title={filter.label}
                          >
                            <div 
                              className={`filter-preview filter-${filter.name}`}
                              data-filter={filter.name}
                            >
                              {idx === 0 && (
                                <svg className="no-theme-x" width="18" height="18" viewBox="0 0 18 18">
                                  <line x1="3" y1="3" x2="15" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
                                  <line x1="15" y1="3" x2="3" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="design-section-color">
                    <div className="design-color-section">
                      <div className="design-color-title">color</div>
                      <div className="design-color-grid">
                        <div
                          className={`design-color-item${frameColor === '#fff' ? ' selected' : ''}`}
                          style={{ background: '#fff' }}
                          onClick={() => setFrameColor('#fff')}
                          title="White"
                        >
                          <svg className="no-theme-x" width="18" height="18" viewBox="0 0 18 18">
                            <line x1="3" y1="3" x2="15" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="15" y1="3" x2="3" y2="15" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </div>
                        {frameColors.slice(0, -1).map((color, idx) => (
                          <div
                            key={idx}
                            className={`design-color-item${frameColor === color ? ' selected' : ''}`}
                            style={{ background: color }}
                            onClick={() => setFrameColor(color)}
                          />
                        ))}
                        <div
                          className={`design-color-item custom-color${frameColor === customFrameColor ? ' selected' : ''}`}
                          style={{ background: customFrameColor }}
                          onClick={() => colorInputRef.current && colorInputRef.current.click()}
                          title="Custom Color"
                        >
                          <span className="color-swatch-icon">🎨</span>
                          <input
                            ref={colorInputRef}
                            type="color"
                            value={customFrameColor}
                            onChange={e => { setCustomFrameColor(e.target.value); setFrameColor(e.target.value); }}
                            tabIndex={-1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="design-section-design">
                    <div className="design-color-section">
                      <div className="design-color-title">design</div>
                      <div className="design-bgdesign-grid">
                        {BG_DESIGNS.map((design) => (
                          <div
                            key={design.name}
                            className={`design-bgdesign-item${selectedBgDesign === design.name ? ' selected' : ''}`}
                            data-bg={design.style?.background}
                            onClick={() => setSelectedBgDesign(design.name)}
                            title={design.label}
                          >
                            {design.renderPreview ? design.renderPreview() : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="design-middle">
                <div
                  className="strip-preview"
                  ref={stripPreviewRef}
                  style={selectedBgDesign === 'no-theme' ? { '--frame-color': frameColor } : {}}
                >
                  {stripReady ? (
                    <>
                      {/* Stickers overlay */}
                      <div className="sticker-overlay-container">
                        {stickers.map(sticker => {
                          const isActive = activeStickerId === sticker.id;
                          const stickerSize = 48 * sticker.scale;
                          return (
                            <div
                              key={sticker.id}
                              data-sticker
                              className={`sticker-overlay${isActive ? ' active' : ''}`}
                              style={{
                                left: sticker.x - stickerSize / 2,
                                top: sticker.y - stickerSize / 2,
                                width: stickerSize,
                                height: stickerSize,
                                transform: `rotate(${sticker.rotation}deg)` ,
                                zIndex: isActive ? 11 : 10,
                                cursor: !sticker.applied && isActive ? 'move' : 'default',
                              }}
                              onMouseDown={e => {
                                e.stopPropagation();
                                setActiveStickerId(sticker.id);
                                if (!sticker.applied) {
                                  dragState.current = {
                                    action: 'move',
                                    stickerId: sticker.id,
                                    startX: e.clientX,
                                    startY: e.clientY,
                                    orig: { x: sticker.x, y: sticker.y, scale: sticker.scale, rotation: sticker.rotation },
                                  };
                                }
                              }}
                            >
                              <img
                                src={sticker.src}
                                alt="sticker"
                                className="sticker-img"
                                draggable={false}
                                style={{ width: '100%', height: '100%' }}
                                onClick={e => {
                                  e.stopPropagation();
                                  setActiveStickerId(sticker.id);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                  <div className="strip-preview-grid-container">
                    <div className="strip-preview-grid">
                      {Array.from({ length: tpl.rows * tpl.cols }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`strip-preview-photo${photos[idx] ? ' strip-preview-photo-hasimg' : ''}${dragOverIdx === idx ? ' strip-preview-photo-dragover' : ''}`}
                          draggable={!!photos[idx]}
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(idx, e)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(idx)}
                          onDragEnd={handleDragEnd}
                        >
                          {photos[idx] ? (
                            <img
                              src={photos[idx]}
                              alt={`photo-${idx + 1}`}
                                  className={`strip-preview-photo-img filter-${selectedFilter}`}
                            />
                          ) : (
                            <span className="strip-preview-photo-empty">no photo</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                    </>
                  ) : (
                    <div className="strip-loading">Loading...</div>
                  )}
                </div>
              </div>
              <div className="design-right-side">
                <div className={`design-section-container pixel-slider-card margin-top${stickers.length === 0 ? ' disabled' : ''}`}>
                  <div className="design-color-title">transform</div>
                  <div className="transform-slider-row">
                    <span className="transform-slider-label">S</span>
                    <input
                      type="range"
                      min={0.3}
                      max={3}
                      step={0.01}
                      value={sliderScale}
                      onChange={e => handleSliderChange('scale', parseFloat(e.target.value))}
                      disabled={activeStickerId === null || stickers.find(s => s.id === activeStickerId)?.applied}
                      className="design-slider design-slider-s"
                    />
                  </div>
                  <div className="transform-slider-row">
                    <span className="transform-slider-label">R</span>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={sliderRotate}
                      onChange={e => handleSliderChange('rotate', parseFloat(e.target.value))}
                      disabled={activeStickerId === null || stickers.find(s => s.id === activeStickerId)?.applied}
                      className="design-slider design-slider-r"
                    />
                    </div>
                  <div className="transform-btn-group">
                    <button
                      className="pixel-btn transform-btn"
                      disabled={activeStickerId === null || stickers.find(s => s.id === activeStickerId)?.applied}
                      onClick={() => {
                        setStickers(prev => prev.map(sticker =>
                          sticker.id === activeStickerId ? { ...sticker, applied: true } : sticker
                        ));
                        setActiveStickerId(null);
                      }}
                      title="Apply"
                    >
                      apply
                    </button>
                    <button
                      className="pixel-btn transform-btn delete"
                      disabled={activeStickerId === null}
                      onClick={() => {
                        setStickers(prev => prev.filter(sticker => sticker.id !== activeStickerId));
                        setActiveStickerId(null);
                      }}
                      title="Delete"
                    >
                      delete
                    </button>
                  </div>
                </div>
                <div className="design-section-stickers">
                  <div className="design-color-title">stickers</div>
                  <div className="sticker-grid four-cols">
                    {STICKER_GRID.flat().map((sticker, idx) => (
                        <div
                        key={sticker.name}
                        className="sticker-grid-item"
                        onClick={() => handleAddSticker(sticker.src)}
                        title={sticker.name}
                      >
                        <img src={sticker.src} alt={sticker.name} />
                      </div>
                      ))}
                    </div>
                  </div>
                <div className="design-right-btn-group">
                    <button className="pixel-btn" onClick={handleBack}>
                      back
                    </button>
                    <button className="pixel-btn" onClick={handleSaveStrip}>
                      save
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStripPage;

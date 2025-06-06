import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "../styles/Design.css";

const frameColors = [
  '#3b82f6', '#22c55e', '#f59e42', '#f43f5e', '#a855f7', '#ec4899',
  '#60a5fa', '#fbbf24', '#f472b6', '#fca5a5', '#a3e635', '#38bdf8',
];

const bgThemes = [
  '#b3e0ff', '#60a5fa', '#2563eb', '#1e293b', '#fbbf24', '#f472b6', 
  '#a3e635', '#38bdf8', '#f59e42', '#f43f5e', '#a855f7', '#ec4899',
];

const STRIP_DIMENSIONS = {
  '3x1': { height: 670, width: 270, photoH: 180, photoW: 240, rows: 3, cols: 1, footer: 80, top: 30, gap: 12 },
  '3x2': { height: 670, width: 350, photoH: 180, photoW: 158.49, rows: 3, cols: 2, footer: 80, top: 30, gap: 12 },
  '4x1': { height: 670, width: 270, photoH: 132.6, photoW: 234.78, rows: 4, cols: 1, footer: 80, top: 30, gap: 12 },
  '4x2': { height: 670, width: 350, photoH: 132.6, photoW: 159.54, rows: 4, cols: 2, footer: 80, top: 30, gap: 12 },
};

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
  const tpl = getTemplate();
  const stripPreviewRef = useRef(null);
  const cardRef = useRef(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  useEffect(() => {
    // Calculate available card size
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
    }
  }, [tpl, frameColor]);

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
    // create canvas 
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    // draw border
    ctx.save();
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(borderWidth/2, borderWidth/2, targetWidth - borderWidth, targetHeight - borderWidth);
    ctx.restore();
    // draw grid of photos
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
      ctx.restore();
      // draw photo 
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
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, cellW, cellH);
        ctx.restore();
      }
      // draw photo border
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
    // download
    const link = document.createElement('a');
    link.download = 'photo-strip.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleBack = () => {
    navigate(-1);
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

  return (
    <div className="design-strip-page">
      <div className="design-scale-wrapper">
        <div className="design-card" ref={cardRef}>
          <div className="design-scroll-x">
            <div className="design-content-row">
              <div className="design-left">
                <div className="strip-preview" ref={stripPreviewRef}>
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
                              className="strip-preview-photo-img"
                            />
                          ) : (
                            <span className="strip-preview-photo-empty">no photo</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="design-right">
                <div className="design-color-pickers">
                  <div className="design-color-section">
                    <div className="design-color-title">design strip</div>
                  </div>
                  <div className="design-color-section">
                    <div className="design-color-title">Frame Color</div>
                    <div className="design-color-grid">
                      {frameColors.map((color, idx) => (
                        <div
                          key={idx}
                          className={`design-color-item${frameColor === color ? ' selected' : ''}`}
                          style={{ background: color }}
                          onClick={() => setFrameColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="design-color-section">
                    <div className="design-color-title">Background Theme</div>
                    <div className="design-color-grid">
                      {bgThemes.map((color, idx) => (
                        <div
                          key={idx}
                          className={`design-color-item${bgColor === color ? ' selected' : ''}`}
                          style={{ background: color }}
                          onClick={() => setBgColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 32, alignSelf: 'center' }}>
                    <button className="pixel-btn" onClick={handleBack}>
                      Back
                    </button>
                    <button className="pixel-btn" onClick={handleSaveStrip}>
                      Save
                    </button>
                  </div>
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

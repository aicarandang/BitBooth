import { useEffect, useState } from "react";
import "../styles/Design.css";

const frameColors = [
  '#3b82f6', '#22c55e', '#f59e42', '#f43f5e', '#a855f7', '#ec4899',
  '#60a5fa', '#fbbf24', '#f472b6', '#fca5a5', '#a3e635', '#38bdf8',
];
const bgThemes = [
  '#b3e0ff', '#60a5fa', '#2563eb', '#1e293b', '#fbbf24', '#f472b6', '#a3e635', '#38bdf8', '#f59e42', '#f43f5e', '#a855f7', '#ec4899',
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

const DesignStripPage = () => {
  const [photos, setPhotos] = useState([]);
  const [frameColor, setFrameColor] = useState('#fff');
  const tpl = getTemplate();

  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  return (
    <div className="design-strip-page">
      <div className="design-strip-container">
        <div
          className="design-strip-strip-frame"
          style={{
            '--strip-width': `${tpl.width}px`,
            '--strip-height': `${tpl.height}px`,
            '--photo-width': `${tpl.photoW}px`,
            '--photo-height': `${tpl.photoH}px`,
            '--grid-gap': `${tpl.gap}px`,
            '--grid-rows': tpl.rows,
            '--grid-cols': tpl.cols,
            '--footer-height': `${tpl.footer}px`,
            '--top-margin': `${tpl.top}px`,
            '--frame-color': frameColor,
          }}
        >
          <div className="design-strip-strip-frame-top" />
          <div className="design-strip-strip-frame-grid-container">
            <div className="design-strip-strip-frame-grid">
              {Array.from({ length: tpl.rows * tpl.cols }).map((_, idx) => (
                <div key={idx} className="design-strip-strip-frame-grid-item">
                  {photos[idx] ? (
                    <img 
                      src={photos[idx]} 
                      alt={`photo-${idx + 1}`} 
                      className="design-photo-img"
                    />
                  ) : (
                    <span className="design-strip-strip-frame-grid-item-placeholder">No Photo</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="design-strip-strip-frame-footer" />
        </div>
        <div className="design-strip-color-pickers">
          <div>
            <div className="pixel-title">Frame Color</div>
            <div className="pixel-border-container">
              {frameColors.map((color, idx) => (
                <div
                  key={idx}
                  className={`design-pixel-border${frameColor === color ? ' selected' : ''}`}
                  style={{ background: color, borderColor: frameColor === color ? '#e63946' : '#333' }}
                  onClick={() => setFrameColor(color)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="pixel-title">Background Theme</div>
            <div className="pixel-border-container">
              {bgThemes.map((color, idx) => (
                <div key={idx} className="design-pixel-border" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStripPage;

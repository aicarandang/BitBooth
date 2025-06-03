import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Strip.css";

const STRIP_HEIGHT = 260;
const STRIP_DIMENSIONS = {
  '3x1': { height: STRIP_HEIGHT, width: 100, photoH: 70, photoW: 80, rows: 3, cols: 1, gap: 6 },
  '3x2': { height: STRIP_HEIGHT, width: 160, photoH: 70, photoW: 68, rows: 3, cols: 2, gap: 6 },
  '4x1': { height: STRIP_HEIGHT, width: 100, photoH: 48, photoW: 80, rows: 4, cols: 1, gap: 6 },
  '4x2': { height: STRIP_HEIGHT, width: 160, photoH: 48, photoW: 68, rows: 4, cols: 2, gap: 6 },
};

const PHOTO_ICON = (
  <svg width="32" height="32" viewBox="0 0 32 32" className="photo-icon">
    <rect x="4" y="8" width="24" height="16" rx="2" fill="#cfd8dc" stroke="#333" strokeWidth="2" />
    <circle cx="10" cy="16" r="3" fill="#b3e0ff" stroke="#333" strokeWidth="1" />
    <polyline points="8,22 14,16 20,22 24,18 28,22" fill="none" stroke="#333" strokeWidth="2" />
  </svg>
);

const templates = [
  { key: '3x1', label: '3x1', ...STRIP_DIMENSIONS['3x1'] },
  { key: '3x2', label: '3x2', ...STRIP_DIMENSIONS['3x2'] },
  { key: '4x1', label: '4x1', ...STRIP_DIMENSIONS['4x1'] },
  { key: '4x2', label: '4x2', ...STRIP_DIMENSIONS['4x2'] },
];

const TemplatePreview = ({ tpl, selected, onClick }) => {
  return (
    <div
      className={`template-preview${selected ? ' selected' : ''}`}
      onClick={onClick}
      style={{
        '--strip-width': `${tpl.width}px`,
        '--strip-height': `${tpl.height}px`,
        '--photo-width': `${tpl.photoW}px`,
        '--photo-height': `${tpl.photoH}px`,
        '--grid-gap': `${tpl.gap}px`,
        '--grid-rows': tpl.rows,
        '--grid-cols': tpl.cols,
        '--footer-height': `12px`,
        '--top-margin': `${tpl.gap}px`,
        '--border-color': selected ? '#e63946' : '#222',
        '--shadow-color': selected ? '#e63946' : '#222',
      }}
    >
      <div className="top-margin" />
      <div className="grid-container">
        <div className="grid">
          {Array.from({ length: tpl.rows * tpl.cols }).map((_, idx) => (
            <div key={idx} className="grid-item">
              {PHOTO_ICON}
            </div>
          ))}
        </div>
      </div>
      <div className="footer" />
    </div>
  );
};

const StripSizePage = () => {
  const [selected, setSelected] = useState('3x1');
  const navigate = useNavigate();

  const handleNext = () => {
    const tpl = templates.find(t => t.key === selected);
    localStorage.setItem("stripSize", selected);
    localStorage.setItem("stripRows", tpl.rows);
    localStorage.setItem("stripCols", tpl.cols);
    navigate("/capture");
  };

  return (
    <div className="strip-size-page">
      <div className="container">
        <div className="pixel-title">choose template</div>
        <div className="template-container">
          {templates.map((tpl) => (
            <div key={tpl.key} className="template-item">
              <TemplatePreview
                tpl={tpl}
                selected={selected === tpl.key}
                onClick={() => setSelected(tpl.key)}
              />
              <div className="template-label">{tpl.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-8 justify-center">
          <button className="pixel-btn" onClick={() => navigate(-1)}>back</button>
          <button className="pixel-btn" onClick={handleNext}>next</button>
        </div>
      </div>
    </div>
  );
};

export default StripSizePage;



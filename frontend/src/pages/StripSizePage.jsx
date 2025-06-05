import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Strip.css";

const PHOTO_ICON = (
  <svg width="32" height="32" viewBox="0 0 32 32" className="photo-icon">
    <rect x="4" y="8" width="24" height="16" rx="2" fill="#cfd8dc" stroke="#333" strokeWidth="2" />
    <circle cx="10" cy="16" r="3" fill="#b3e0ff" stroke="#333" strokeWidth="1" />
    <polyline points="8,22 14,16 20,22 24,18 28,22" fill="none" stroke="#333" strokeWidth="2" />
  </svg>
);

const TEMPLATES = [
  { key: '3x1', label: '3x1', rows: 3, cols: 1 },
  { key: '3x2', label: '3x2', rows: 3, cols: 2 },
  { key: '4x2', label: '4x2', rows: 4, cols: 2 },
  { key: '4x1', label: '4x1', rows: 4, cols: 1 },
];

const TemplatePreview = ({ template, selected, onClick }) => (
  <div
    className={`strip-template-preview${selected ? ' selected' : ''}`}
    onClick={onClick}
    data-template={template.key}
  >
    <div className="strip-template-top" />
    <div className="strip-template-grid-container">
      <div className="strip-template-grid">
        {Array.from({ length: template.rows * template.cols }).map((_, idx) => (
          <div key={idx} className="strip-template-grid-item">
            {PHOTO_ICON}
          </div>
        ))}
      </div>
    </div>
    <div className="strip-template-footer" />
  </div>
);

const StripSizePage = () => {
  const [selected, setSelected] = useState('3x1');
  const navigate = useNavigate();

  const handleNext = () => {
    const template = TEMPLATES.find(t => t.key === selected);
    localStorage.setItem("stripSize", selected);
    localStorage.setItem("stripRows", template.rows);
    localStorage.setItem("stripCols", template.cols);
    navigate("/capture");
  };

  return (
    <div className="strip-size-bg">
      <div className="strip-size-scale-wrapper">
        <div className="strip-size-card">
          <h1 className="strip-size-title">choose template</h1>
          <div className="strip-size-templates">
            {TEMPLATES.map((template) => (
              <div key={template.key} className="strip-size-template-item">
                <TemplatePreview
                  template={template}
                  selected={selected === template.key}
                  onClick={() => setSelected(template.key)}
                />
                <div className="strip-size-template-label">{template.label}</div>
              </div>
            ))}
          </div>
          <div className="strip-size-actions">
            <button className="strip-size-btn" onClick={() => navigate(-1)}>back</button>
            <button className="strip-size-btn" onClick={handleNext}>next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripSizePage;



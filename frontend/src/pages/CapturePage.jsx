import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Capture.css";

const SCALE = 0.85;
const PREVIEW_HEIGHT = 110 * SCALE;
const PREVIEW_WIDTH = PREVIEW_HEIGHT * 1.3;

const PREVIEW_LAYOUTS = {
  '3x1': { rows: 1, cols: 3 },
  '3x2': { rows: 2, cols: 3 },
  '4x1': { rows: 1, cols: 4 },
  '4x2': { rows: 2, cols: 4 },
};

function getTemplateKey() {
  return localStorage.getItem("stripSize") || '3x1';
}
function getTemplate() {
  const key = getTemplateKey();
  const rows = parseInt(localStorage.getItem("stripRows"), 10) || 3;
  const cols = parseInt(localStorage.getItem("stripCols"), 10) || 1;
  return { key, rows, cols };
}

const PREVIEW_SIZE = 110 * SCALE;
const PREVIEW_GAP = 16 * SCALE;

const CapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const navigate = useNavigate();
  const { key, rows, cols } = getTemplate();
  const previewLayout = PREVIEW_LAYOUTS[key] || { rows: 1, cols: Math.max(rows, cols) };
  const photoCount = rows * cols;

  useEffect(() => {
    setPhotos(Array(photoCount).fill(null));
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setPermissionDenied(true);
      }
    };
    enableCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => {
        const updated = [...prev];
        updated[currentIndex] = dataUrl;
        return updated;
      });
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Reset all photos
  const handleReset = () => {
    setPhotos(Array(photoCount).fill(null));
    setCurrentIndex(0);
  };

  // Proceed to design page
  const handleNext = () => {
    localStorage.setItem("capturedPhotos", JSON.stringify(photos));
    navigate("/design");
  };

  // Photo preview
  const previewGrid = [];
  let idx = 0;
  for (let r = 0; r < previewLayout.rows; r++) {
    const row = [];
    for (let c = 0; c < previewLayout.cols; c++) {
      if (idx >= photoCount) break;
      row.push(
        <div
          key={idx}
          className={["capture-pixel-border", "preview-photo", photos[idx] && "preview-photo-hasimg"].filter(Boolean).join(" ")}
          style={{
            '--preview-width': `${PREVIEW_WIDTH}px`,
            '--preview-height': `${PREVIEW_HEIGHT}px`,
            '--preview-gap': `${PREVIEW_GAP}px`,
            background: photos[idx] ? `url(${photos[idx]}) center/cover` : undefined,
            cursor: sessionStarted && photos[idx] ? 'pointer' : 'default',
          }}
          title={photos[idx] && sessionStarted ? "Photo taken" : undefined}
        >
          {photos[idx] ? (
            <img src={photos[idx]} alt={`photo-${idx + 1}`} className="preview-photo-img" key={photos[idx]} />
          ) : (
            <span className="preview-photo-empty">Empty</span>
          )}
        </div>
      );
      idx++;
    }
    if (row.length > 0) previewGrid.push(<div key={r} className="preview-row">{row}</div>);
  }

  return (
    <div className="capture-bg">
      <div className="capture-container">
        <div className="pixel-title capture-title">Camera Preview</div>
        {permissionDenied ? (
          <p className="text-red-500">Camera access denied. Please enable it in browser settings.</p>
        ) : (
          <>
            <div className="pixel-border camera-preview">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
            <div className="capture-controls" style={{ '--scale': SCALE }}>
              <div className="capture-btn-row">
                <button
                  className="pixel-btn"
                  onClick={() => setSessionStarted(true)}
                  disabled={sessionStarted}
                  style={{ opacity: sessionStarted ? 0.5 : 1 }}
                >
                  Start
                </button>
                {sessionStarted && currentIndex < photoCount && (
                  <button className="pixel-btn" onClick={handleCapture}>
                    Capture {currentIndex + 1} / {photoCount}
                  </button>
                )}
                {sessionStarted && (
                  <button
                    className="pixel-btn"
                    style={{ background: '#ffe6e6', color: '#b30000' }}
                    onClick={handleReset}
                  >
                    Restart
                  </button>
                )}
                {sessionStarted && photos.every((p) => p) && (
                  <button
                    className="pixel-btn"
                    style={{ background: '#b3e6b3', color: '#145214' }}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
              </div>
              <div className="preview-grid">
                {previewGrid}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CapturePage;

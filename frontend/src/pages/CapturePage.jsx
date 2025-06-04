import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Capture.css";

const STRIP_SCALE = 0.93;
const STRIP_DIMENSIONS = {
  '3x1': { height: 670 * STRIP_SCALE, width: 270 * STRIP_SCALE, photoH: 180 * STRIP_SCALE, photoW: 240 * STRIP_SCALE, rows: 3, cols: 1, footer: 80 * STRIP_SCALE, top: 30 * STRIP_SCALE, gap: 12 * STRIP_SCALE },
  '3x2': { height: 670 * STRIP_SCALE, width: 350 * STRIP_SCALE, photoH: 180 * STRIP_SCALE, photoW: 158.49 * STRIP_SCALE, rows: 3, cols: 2, footer: 80 * STRIP_SCALE, top: 30 * STRIP_SCALE, gap: 12 * STRIP_SCALE },
  '4x1': { height: 670 * STRIP_SCALE, width: 270 * STRIP_SCALE, photoH: 132.6 * STRIP_SCALE, photoW: 234.78 * STRIP_SCALE, rows: 4, cols: 1, footer: 80 * STRIP_SCALE, top: 30 * STRIP_SCALE, gap: 12 * STRIP_SCALE },
  '4x2': { height: 670 * STRIP_SCALE, width: 350 * STRIP_SCALE, photoH: 132.6 * STRIP_SCALE, photoW: 159.54 * STRIP_SCALE, rows: 4, cols: 2, footer: 80 * STRIP_SCALE, top: 30 * STRIP_SCALE, gap: 12 * STRIP_SCALE },
};

function getTemplateKey() {
  return localStorage.getItem("stripSize") || '3x1';
}

function getTemplate() {
  const key = getTemplateKey();
  return STRIP_DIMENSIONS[key] || STRIP_DIMENSIONS['3x1'];
}

const CapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stripPreviewRef = useRef(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();

  const tpl = getTemplate();
  const photoCount = tpl.rows * tpl.cols;

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
  }, [photoCount]);

  useEffect(() => {
    if (!stripPreviewRef.current) return;
    const el = stripPreviewRef.current.style;

    el.setProperty('--strip-width', `${tpl.width}px`);
    el.setProperty('--strip-height', `${tpl.height}px`);
    el.setProperty('--photo-width', `${tpl.photoW}px`);
    el.setProperty('--photo-height', `${tpl.photoH}px`);
    el.setProperty('--grid-gap', `${tpl.gap}px`);
    el.setProperty('--grid-rows', tpl.rows);
    el.setProperty('--grid-cols', tpl.cols);
    el.setProperty('--footer-height', `${tpl.footer}px`);
    el.setProperty('--top-margin', `${tpl.top}px`);
    el.setProperty('--frame-color', '#fff');
  }, [tpl]);

  const doCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const inputWidth = video.videoWidth;
      const inputHeight = video.videoHeight;
      const targetAspect = 4 / 2.5;
      let cropWidth = inputWidth;
      let cropHeight = cropWidth / targetAspect;

      if (cropHeight > inputHeight) {
        cropHeight = inputHeight;
        cropWidth = cropHeight * targetAspect;
      }

      const offsetX = (inputWidth - cropWidth) / 2;
      const offsetY = (inputHeight - cropHeight) / 2;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.translate(cropWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => {
        const updated = [...prev];
        updated[currentIndex] = dataUrl;
        return updated;
      });
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleCapture = async () => {
    if (isCapturing || currentIndex >= photoCount) return;
    setIsCapturing(true);

    if (timer > 0) {
      let count = timer;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          setCountdown(null);
          doCapture();
          setIsCapturing(false);
        }
      }, 1000);
    } else {
      doCapture();
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    setPhotos(Array(photoCount).fill(null));
    setCurrentIndex(0);
    setCountdown(null);
    setIsCapturing(false);
  };

  const handleNext = () => {
    localStorage.setItem("capturedPhotos", JSON.stringify(photos));
    navigate("/design");
  };

  const stripPreview = (
    <div className="strip-preview" ref={stripPreviewRef}>
      <div className="strip-preview-grid-container">
        <div className="strip-preview-grid">
          {Array.from({ length: photoCount }).map((_, idx) => (
            <div
              key={idx}
              className={[
                "strip-preview-photo",
                photos[idx] && "strip-preview-photo-hasimg",
                idx === currentIndex ? "strip-preview-photo-active" : "",
                "strip-preview-photo-clickable"
              ].filter(Boolean).join(" ")}
              onClick={() => setCurrentIndex(idx)}
              title={photos[idx] ? "Retake this photo" : "Take this photo"}
              style={{ cursor: "pointer" }}
            >
              {photos[idx] ? (
                <img
                  src={photos[idx]}
                  alt={`photo-${idx + 1}`}
                  className="strip-preview-photo-img"
                  key={photos[idx]}
                />
              ) : (
                <span className="strip-preview-photo-empty">No Photo</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="capture-bg">
      <div className="capture-container">
        <div className="capture-content-row">
          <div className="capture-left">
            <div className="pixel-title capture-title">Camera Preview</div>
            {permissionDenied ? (
              <p className="text-red-500">Camera access denied. Please enable it in browser settings.</p>
            ) : (
              <>
                <div className="pixel-border camera-preview" style={{ position: 'relative' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="camera-video flipped-video"
                  />
                  <canvas ref={canvasRef} className="canvas-hidden" />
                </div>
                <div className="capture-controls">
                  <div className="capture-btn-row">
                    <select
                      className="pixel-btn"
                      value={timer}
                      onChange={(e) => setTimer(parseInt(e.target.value))}
                      disabled={isCapturing}
                    >
                      <option value={0}>No Timer</option>
                      <option value={3}>3 sec</option>
                      <option value={5}>5 sec</option>
                      <option value={10}>10 sec</option>
                    </select>

                    <button
                      className="pixel-btn capture-fixed-width"
                      onClick={handleCapture}
                      disabled={isCapturing}
                    >
                      {photos[currentIndex]
                        ? "Retake"
                        : "Capture"}
                    </button>

                    <button className="pixel-btn" onClick={handleReset} disabled={isCapturing}>
                      Reset
                    </button>

                    {photos.every((p) => p) && (
                      <button className="pixel-btn pixel-btn-primary" onClick={handleNext}>
                        Next
                      </button>
                    )}
                  </div>
                  {countdown !== null && (
                    <div className="camera-countdown-below">
                      Capturing in {countdown}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="capture-right">
            {stripPreview}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturePage;

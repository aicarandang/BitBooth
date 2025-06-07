import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import StripSizePage from "./pages/StripSizePage";
import CapturePage from "./pages/CapturePage";
import DesignStripPage from "./pages/DesignStripPage";
import GalleryPage from "./pages/GalleryPage";
import { useEffect } from "react";

function CameraCleanup() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/capture") return;
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    });
  }, [location]);
  return null;
}

function App() {
  return (
    <Router>
      <CameraCleanup />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/strip-size" element={<StripSizePage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/design" element={<DesignStripPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
}

export default App;

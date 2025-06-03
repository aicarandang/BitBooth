import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import StripSizePage from "./pages/StripSizePage";
import CapturePage from "./pages/CapturePage";
import DesignStripPage from "./pages/DesignStripPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/strip-size" element={<StripSizePage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/design" element={<DesignStripPage />} />
      </Routes>
    </Router>
  );
}

export default App;

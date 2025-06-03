import { useNavigate } from "react-router-dom";
import PixelHeart from "../components/PixelHeart";
import PixelStar from "../components/PixelStar";
import PixelCloud from "../components/PixelCloud";
import "../styles/Welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-bg">
      <div className="pixel-border welcome-card">
        <div className="pixel-title welcome-title">
          <PixelCloud size={40} />
          <span className="welcome-logo">[logo] welcome!</span>
          <PixelCloud size={40} />
        </div>
        <div className="welcome-btn-row">
          <button className="pixel-btn" onClick={() => navigate("/strip-size")}>[start photobooth]</button>
          <button className="pixel-btn" onClick={() => navigate("/gallery")}>[view gallery]</button>
        </div>
        <div className="welcome-deco-row">
          <PixelStar size={28} />
          <span>Retro camera animation</span>
          <PixelHeart size={28} />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

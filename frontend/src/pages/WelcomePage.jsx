import { useNavigate } from "react-router-dom";
import PixelCamera from "../components/PixelCamera";
import canopyImg from "../assets/images/Canopy.png";
import starImg from "../assets/images/Star.png";
import heartImg from "../assets/images/Heart.png";
import "../styles/Welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-bg">
      <div className="welcome-scale-wrapper">
        <div className="welcome-card">
          <img src={canopyImg} alt="canopy" className="canopy-img" />
          <h1 className="welcome-title">welcome!</h1>
          <div className="welcome-actions">
            <button className="start-btn" onClick={() => navigate("/strip-size")}>
              start photobooth
            </button>
            <button className="gallery-btn" onClick={() => navigate("/gallery")}>
              view gallery
            </button>
          </div>
          <div className="welcome-decoration">
            <img src={starImg} alt="star" style={{ width: 28, height: 28 }} />
            {[...Array(5)].map((_, index) => (
              <PixelCamera key={index} size={44} />
            ))}
            <img src={heartImg} alt="heart" style={{ width: 28, height: 28 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

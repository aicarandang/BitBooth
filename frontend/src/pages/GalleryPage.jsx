import { useNavigate } from "react-router-dom";
import FilterImg from "../assets/images/Filter.jpg";
import "../styles/Gallery.css";

const GalleryPage = () => {
  const navigate = useNavigate();
  return (
    <div className="gallery-bg">
      <div className="gallery-center">
        <h1 className="gallery-title">𝓴𝓪𝓽𝓪𝓶𝓪𝓭</h1>
        <div className="anim-container">
          <img src={FilterImg} alt="meme" className="anim-img" />
        </div>
        <button className="gallery-back-btn" onClick={() => navigate("/")}>back</button>
      </div>
    </div>
  );
};

export default GalleryPage;

import "./Settings.css";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="user-home-page">
      {/* Background */}
      <img src="/Image2.png" className="background-image" alt="Background" />

      <p className="page-label">Account Settings</p>

      <div></div>

      <ul>
        <li>
          <a href="https://google.com" className="no-color-link">
            Test
          </a>
        </li>
      </ul>

      <div className="bottom-nav">
        <Link to="/home" className="nav-item">
          <img src="/Home.png" alt="Home" className="nav-icon" />
          <p className="nav-text">Home</p>
        </Link>
        <Link to="/favorites" className="nav-item">
          <img src="/Favorites.png" alt="Favorites" className="nav-icon" />
          <p className="nav-text">Favorites</p>
        </Link>
        <Link to="/settings" className="nav-item active">
          <img
            src="/Settings Selected.png"
            alt="Account"
            className="nav-icon"
          />
          <p className="nav-text">Account</p>
        </Link>
      </div>
    </div>
  );
}

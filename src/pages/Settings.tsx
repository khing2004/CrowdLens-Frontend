import "./Settings.css";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="user-home-page">
      <p className="page-label">Account Settings</p>

      <div className="user-info">
        <img src="/Logo.png" alt="Profile" className="profile-picture" />
        <p className="username">test</p>
        <p className="email">test@example.com</p>
      </div>

      <ul className="settings-options">
        {/* Change to links/buttons */}
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Profile
          </a>
        </li>
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Location Sharing
          </a>
        </li>
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Notifications
          </a>
        </li>
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
        </li>
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>
        </li>
        <li className="settings-option">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Logout
          </a>
        </li>
      </ul>

      <div className="bottom-nav">
        <div className="nav-section">
          <Link to="/home" className="nav-item">
            <img src="/Home.png" alt="Home" className="nav-icon" />
            <p className="nav-text">Home</p>
          </Link>
        </div>

        <div className="nav-section">
          <Link to="/favorites" className="nav-item">
            <img src="/Favorites.png" alt="Favorites" className="nav-icon" />
            <p className="nav-text">Favorites</p>
          </Link>
        </div>
        <div className="nav-section">
          <Link to="/settings" className="nav-item">
            <img
              src="/Settings Selected.png"
              alt="Account"
              className="nav-icon"
            />
            <p className="nav-text">Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

import "./Settings.css";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="user-home-page">
      <p className="page-label">Account Settings</p>

      <div className="user-info">
        <p className="username">test</p>
        <p className="email">test@example.com</p>
      </div>

      <div>
        <ul className="settings-options">
          {/* Change to links/buttons */}
          <li className="settings-option">Profile</li>
          <li className="settings-option">Location Sharing</li>
          <li className="settings-option">Notifications</li>
          <li className="settings-option">Privacy Policy</li>
          <li className="settings-option">Terms of Service</li>
          <li className="settings-option">Logout</li>
        </ul>
      </div>

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
    </div>
  );
}

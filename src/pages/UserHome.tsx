// src/pages/UserHome.tsx
import "./UserHome.css";
import { Link } from "react-router-dom";

export default function UserHomePage() {
  const handleClick = (name: string) => alert(`${name} clicked!`);

  return (
    <div className="user-home-page">
      {/* Background */}
      <img src="/Image2.png" className="background-image" alt="Background" />

      {/* Welcome text */}
      <p className="welcome-text">Welcome back, User!</p>

      {/* Info Cards */}
      <div className="info-card" style={{ top: 171, left: 29 }}></div>
      <div className="info-card" style={{ top: 269, left: 29 }}></div>

      {/* Map */}
      <img src="/Map.png" alt="Map" className="map" />

      {/* Labels (clickable) */}
      <div
        className="label"
        style={{ top: 175, left: 39 }}
        onClick={() => handleClick("Last Check-in Location")}
      >
        Last Check-in Location
      </div>
      <div
        className="label"
        style={{ top: 275, left: 39 }}
        onClick={() => handleClick("Last Check-in Details")}
      >
        Last Check-in Details
      </div>
      <div
        className="label"
        style={{ top: 380, left: 39, zIndex: 10, position: "absolute" }}
        onClick={() => handleClick("Pinned Locations")}
      >
        Pinned Locations
      </div>

      {/* Pins */}
      <div
        className="pin"
        style={{ top: 550, left: 72 }}
        onClick={() => handleClick("Pin 1")}
      >
        <img src="/Pin.png" alt="Pin 1" />
      </div>
      <div
        className="pin"
        style={{ top: 700, left: 186 }}
        onClick={() => handleClick("Pin 2")}
      >
        <img src="/Pin.png" alt="Pin 2" />
      </div>
      <div
        className="pin"
        style={{ top: 439, left: 228 }}
        onClick={() => handleClick("Pin 3")}
      >
        <img src="/Pin.png" alt="Pin 3" />
      </div>

      {/* Zoom Button */}
      <div
        className="zoom-button"
        style={{ top: 850, left: 430 }}
        onClick={() => handleClick("Zoom Button")}
      >
        <img src="/ZoomButton.png" alt="Zoom" />
      </div>

      {/* Bottom navigation */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item active">
          <img src="/Home Selected.png" alt="Home" className="nav-icon" />
          <p className="nav-text">Home</p>
        </Link>
        <Link to="/favorites" className="nav-item">
          <img src="/Favorites.png" alt="Favorites" className="nav-icon" />
          <p className="nav-text">Favorites</p>
        </Link>
        <Link to="/settings" className="nav-item">
          <img src="/Settings.png" alt="Account" className="nav-icon" />
          <p className="nav-text">Account</p>
        </Link>
      </div>
    </div>
  );
}

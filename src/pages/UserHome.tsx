// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import { Link } from "react-router-dom";

// for pulse marker
const createPulseIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="pulse-marker" style="background-color: ${color};"></div>`,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function UserHomePage() {

  // Center of Cebu 
  const center: [number, number] = [10.3223, 123.8982];

  //Mock data for Areas (replace with api call later)
  const areas = [
    { id: 1, name: "IT Park", pos: [10.3280, 123.9055], density: "High", color: "#d32f2f" },
    { id: 2, name: "Fuente Circle", pos: [10.3103, 123.8935], density: "Low", color: "#388e3c" }
  ];

  return (
    <div className="user-home-page">
      {/* Header Section */}
      <header className="home-header">
        <h1 className="welcome-title">CrowdLens</h1>
        <p className="welcome-subtitle">Welcome back, Khing</p>
      </header>

      {/* Stats/Info Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Active Alerts</span>
          <strong>3 Areas</strong>
        </div>
        <div className="stat-card">
          <span>Last Check-in</span>
          <strong>Downtown</strong>
        </div>
      </div>

      {/* Map Section */}
      <main className="map-section">
        <MapContainer center={center} zoom={14} className="main-map" style={{ height: "800px", width: "100%" }}> {/* Add this inline to be sure */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Clean grey map style
            attribution='&copy; OpenStreetMap'
          />
          {areas.map(area => (
            <Marker 
              key={area.id} 
              position={area.pos as [number, number]} 
              icon={createPulseIcon(area.color)}
            >
              <Popup>
                <strong>{area.name}</strong><br/>
                Status: {area.density} Density
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* Bottom Navigation (Icon-less or using Emoji/Text) */}
      <nav className="bottom-nav">
        <button className="nav-btn active">Home</button>
        <button className="nav-btn">Forecast</button>
        <button className="nav-btn">Account</button>
      </nav>
    </div>
  );
}
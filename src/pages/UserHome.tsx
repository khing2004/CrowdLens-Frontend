// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import { Link } from "react-router-dom";
import AreaModal from "../components/AreaModal"; // components folder has reusable components which can be used at any page.
import { useState, useEffect } from "react";

// Helper component to handle programmatic panning
function RecenterAutomatically({ location }: { location: any }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location.pos, 16, {
        animate: true,
        duration: 0.7, // Smooth pan duration in seconds
      });
    }
  }, [location, map]);  
  return null;
}

// for pulse marker
const createPulseIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="pulse-marker" style="background-color: ${color};"></div>`,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const densityClasses: Record<string, string> = {
  "High": "high",
  "Medium": "medium",
  "Low": "low"
};

export default function UserHomePage() {

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);


  const getIconByDensity = (density: string) => {
    if (density == "High") return createPulseIcon("#d32f2f");
    if (density == "Medium") return createPulseIcon("#f57c00");
    return createPulseIcon("#388e3c");

  }
  // Center of Cebu 
  const center: [number, number] = [10.3223, 123.8982];

  //Mock data for Areas (replace with api call later)
  const locations = [
  { 
    id: 1, 
    name: "Cebu City Public Library", 
    type: "Public Library",
    pos: [10.3095, 123.8931], 
    density: "Medium", 
    lastUpdated: "5 mins ago" 
    
  },
  { 
    id: 2, 
    name: "Vicente Sotto Medical Center", 
    type: "Hospital",
    pos: [10.3117, 123.8915], 
    density: "High", 
    lastUpdated: "2 mins ago" 
  }

  
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

          {selectedLocation && (
            <RecenterAutomatically 
              location ={selectedLocation} 
            />
          )}

          {locations.map(location => (
            <Marker 
              key={location.id} 
              position={location.pos as [number, number]} 
              icon={getIconByDensity(location.density)}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-container">
                  <div className="popup-header">
                    <div className="title-row">
                      <span className="star-icon">☆</span>
                      <h2>{location.name}</h2>
                    </div>
                    <div className="status-row">
                      <span className={`badge ${densityClasses[location.density]}`}>● {location.density} Crowd Level</span>
                      <span className="updated-text">    Updated 2 minutes ago.</span>
                    </div>
                    <p className="quieter-nearby">Quieter Nearby: Lahug Area (Light Crowd)</p>
                  </div>

                  <div className="congestion-info">
                    <h3>Peak Lunchtime Congestion</h3>
                    <p>Most establishments are busy. Expect 10-20 minute waits and limited seating availability.</p>
                  </div>

                  <button className="input-btn">
                    <span className="plus-icon">+</span> Input Crowd Level
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

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

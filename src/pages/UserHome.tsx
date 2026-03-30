// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import "../components/Home/CustomPopup.css"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { densityClasses, getIconByDensity } from "../utils/crowdHelper";
import ReportModal from "../components/Home/ReportModal";
import { Bookmark } from 'lucide-react';

// helper component to handle panning
function RecenterAutomatically({ location }: { location: any }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location.pos, 18, {
        animate: true,
        duration: 0.7, // Smooth pan duration in seconds
      });
    }
  }, [location, map]);  
  return null;
}


export default function UserHomePage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleReportSubmit = (level: string) => {
    console.log(`Reporting ${level} for ${selectedLocation.name}`);
    // In your special problem, this will be an API call to your backend
    alert("Thank you for your report!");
    setIsReportModalOpen(false);
  };

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
        <MapContainer
          center={center}
          zoom={14}
          className="main-map"
          style={{ height: "800px", width: "100%" }}
        >
          {" "}
          {/* Add this inline to be sure */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Clean grey map style
            attribution="&copy; OpenStreetMap"
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
                    <div className="badge-wrapper">
                      <p style={{ fontSize: '12px', color: '#30924C', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                        {location.type}
                      </p>
                      <button
                        className="save-link-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(location.id);
                        }}
                      >
                        <Bookmark
                          size={18}
                          fill={favoriteIds.includes(location.id) ? "#1f2937" : "none"}
                          stroke="#1f2937"
                          strokeWidth={2}
                        />
                      </button>
                      </div>
                    <div className="title-row">
                      <h2>{location.name}</h2>
                    </div>
                   
                    <div className="status-row">
                      <div className="badge-wrapper">
                        <span className={`badge ${densityClasses[location.density]}`}>
                          ● {location.density} Crowd Level
                        </span>
                        <span className="updated-text">Updated {location.lastUpdated}</span>
                      </div>
                    </div>
                    <p className="quieter-nearby">
                      <strong>Tip:</strong> Lahug Area is currently quieter.
                    </p>
                  </div>

                  <div className="congestion-info">
                    <h3>Live Insights</h3>
                    <p>Based on connection data, wait times are approximately 10-20 minutes.</p>
                  </div>

                  <button className="input-btn" onClick={
                    (e) => {
                      e.stopPropagation();
                      setIsReportModalOpen(true);
                      console.log("Modal should be open now.");
                      }}
                  >
                    <span>+</span> Input Crowd Level
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* Bottom navigation */}
      <div className="bottom-nav">
        <div className="nav-section">
          <Link to="/home" className="nav-item">
            <img src="/Home Selected.png" alt="Home" className="nav-icon" />
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
            <img src="/Settings.png" alt="Account" className="nav-icon" />
            <p className="nav-text">Account</p>
          </Link>
        </div>
      </div>
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        locationName={selectedLocation?.name || ""}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

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
import type { CrowdLocation } from "../types/crowd";
import { submitCrowdReport, getLocations } from "../api/crowdService";
import ConfirmReportModal from "../components/Home/ConfirmReportModal";


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
  const [locations, setLocations] = useState<CrowdLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);  

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await getLocations();
        // Map the backend 'pos' (List<double>) to React's [number, number]
        setLocations(data);
      } catch (error) {
        console.error("Failed to load map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {return <div className="loading-screen">Loading CrowdLens Map...</div>;}

  const handleInitialSelect = (level: string) => {
    setPendingLevel(level);
    setIsConfirmOpen(true);
  };

  const handleFinalConfirm = async () => {
    if (!selectedLocation || !pendingLevel) return;
    
    console.log(`Report level ${pendingLevel} for location ID ${selectedLocation.id}`);

    try {
      await submitCrowdReport(selectedLocation.id, pendingLevel);
      alert(`Thank you! You reported ${pendingLevel} for ${selectedLocation.name}`);
      
      // Close everything
      setIsConfirmOpen(false);
      setIsReportModalOpen(false);
      
      // Refresh map data
      const updatedData = await getLocations();
      setLocations(updatedData);
    } catch (error: any) {
      // Handle the 15-minute cooldown error from backend
      if (error.response?.status === 400) {
        alert(error.response.data);
      }
      setIsConfirmOpen(false);
    }
  };
  // Center of Cebu 
  const center: [number, number] = [10.3223, 123.8982];

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
                      <button className="save-link-btn">
                          <Bookmark/>
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
                        <span className="updated-text">{location.lastUpdated}</span>
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
        onSubmit={handleInitialSelect} // trigger confirmation
      />

      <ConfirmReportModal 
        isOpen={isConfirmOpen}
        level={pendingLevel || ""}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalConfirm} // Triggers the actual API call
      />
    </div>
  );
}


// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import "../components/Home/CustomPopup.css"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { densityClasses, getIconByDensity, getWaitTime } from "../utils/crowdHelper";
import ReportModal from "../components/Home/ReportModal";
import { Bookmark } from 'lucide-react';
import type { CrowdLocation } from "../types/crowd";
import { submitCrowdReport, getLocations, getForecast } from "../api/crowdService";
import ConfirmReportModal from "../components/Home/ConfirmReportModal";


// ── Forecast mini-chart types ─────────────────────────────────────────────────
interface ForecastSlot { densityScore: number; isoTime: string; }

// SVG sparkline — renders the next 6 predicted scores as a polyline + dots.
// No external library needed; safe inside a Leaflet popup.
function Sparkline({ slots, modelType }: { slots: ForecastSlot[]; modelType: string }) {
  const W = 168, H = 40, PAD = 6;
  const n = slots.length;
  if (n < 2) return null;

  const scoreColors: Record<number, string> = {
    1: "#4caf50", 2: "#8bc34a", 3: "#ff9800", 4: "#f44336", 5: "#b71c1c"
  };

  const pts = slots.map((s, i) => {
    const x = PAD + (i / (n - 1)) * (W - PAD * 2);
    const y = PAD + ((5 - s.densityScore) / 4) * (H - PAD * 2);
    return { x, y, score: s.densityScore };
  });

  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const peakScore = Math.max(...slots.map(s => s.densityScore));
  const lineColor = scoreColors[peakScore] ?? "#30924C";
  const isLSTM = modelType === "lstm";

  return (
    <div style={{ marginTop: 10 }}>
      <p style={{ fontSize: 10, color: "#888", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>
        Predicted Trend
        <span style={{
          marginLeft: 6, padding: "1px 6px", borderRadius: 10, fontSize: 9, fontWeight: 700,
          background: isLSTM ? "#e8eaf6" : "#e0f2f1",
          color: isLSTM ? "#3949ab" : "#00695c"
        }}>
          {isLSTM ? "⚡ LSTM" : "📊 Statistical"}
        </span>
      </p>
      <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
        <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth={1.8}
                  strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5}
                  fill={scoreColors[p.score] ?? "#999"} stroke="white" strokeWidth={1} />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        {slots.map((s, i) => {
          const d = new Date(s.isoTime);
          const h = d.getHours();
          return (
            <span key={i} style={{ fontSize: 9, color: "#aaa", width: `${100 / n}%`, textAlign: "center" }}>
              {h % 12 === 0 ? 12 : h % 12}{h >= 12 ? "p" : "a"}
            </span>
          );
        })}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

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

  // Popup forecast mini-chart state
  const [popupForecast, setPopupForecast]           = useState<{ slots: ForecastSlot[]; modelType: string } | null>(null);
  const [popupForecastLoading, setPopupForecastLoading] = useState(false);

  // Fetch a 6-hour forecast whenever the user clicks a marker
  useEffect(() => {
    if (!selectedLocation) return;
    setPopupForecast(null);
    setPopupForecastLoading(true);
    getForecast(selectedLocation.id, 6)
      .then((data: any) => {
        if (!data.forecastUnavailable && data.forecast?.length) {
          setPopupForecast({ slots: data.forecast, modelType: data.modelType ?? "statistical" });
        }
      })
      .catch(() => {/* silently skip — popup still works without the chart */})
      .finally(() => setPopupForecastLoading(false));
  }, [selectedLocation?.id]);

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
    
    // Ask the browser for the user's current GPS coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
    console.log(`Report level ${pendingLevel} for location ID ${selectedLocation.id} at coordinates ${lat}, ${lng}`);

    try {
      await submitCrowdReport(selectedLocation.id, pendingLevel, lat, lng);
      alert(`Thank you! You reported ${pendingLevel} for ${selectedLocation.name}`);
      console.log("Report submitted successfully. You are at coordinates:", lat, lng);
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
  },
  (error) => {
    alert("Unable to access your location. Please allow GPS access to submit a report.");
    setIsConfirmOpen(false);
  });
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
                    <p>Based on connection data, wait times are approximately {getWaitTime(location.density)}.</p>
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

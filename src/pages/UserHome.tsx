// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import "../components/Home/CustomPopup.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { densityClasses, getIconByDensity } from "../utils/crowdHelper";
import ReportModal from "../components/Home/ReportModal";
import {
  TrendingUp,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  BarChart2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// helper component to handle panning
function RecenterAutomatically({ location }: { location: any }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location.pos, 18, {
        animate: true,
        duration: 0.7,
      });
    }
  }, [location, map]);
  return null;
}

// --- Dashboard Component ---
function DashboardSection() {
  const analyticsCards = [
    {
      label: "Total Reports Today",
      value: "128",
      change: "+12%",
      trend: "up",
      icon: <Activity size={18} />,
      color: "#30924C",
    },
    {
      label: "Active Crowd Alerts",
      value: "3",
      change: "+1",
      trend: "up",
      icon: <AlertTriangle size={18} />,
      color: "#e17055",
    },
    {
      label: "Avg. Crowd Level",
      value: "Medium",
      change: "Stable",
      trend: "neutral",
      icon: <Users size={18} />,
      color: "#0984e3",
    },
    {
      label: "Locations Tracked",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <MapPin size={18} />,
      color: "#6c5ce7",
    },
  ];

  const recentActivity = [
    {
      location: "Cebu City Public Library",
      level: "Medium",
      time: "5 mins ago",
      density: "Medium",
    },
    {
      location: "Vicente Sotto Medical Center",
      level: "High",
      time: "2 mins ago",
      density: "High",
    },
    {
      location: "SM City Cebu",
      level: "Low",
      time: "11 mins ago",
      density: "Low",
    },
    {
      location: "Ayala Center Cebu",
      level: "High",
      time: "18 mins ago",
      density: "High",
    },
  ];

  const densityBar = [
    { label: "Low", pct: 35, color: "#30924C" },
    { label: "Medium", pct: 45, color: "#fdcb6e" },
    { label: "High", pct: 20, color: "#e17055" },
  ];

  return (
    <div className="dashboard-view">
      {/* Analytics Cards */}
      <div className="analytics-grid">
        {analyticsCards.map((card) => (
          <div className="analytics-card" key={card.label}>
            <div className="analytics-card-top">
              <span
                className="analytics-icon"
                style={{ color: card.color, background: `${card.color}18` }}
              >
                {card.icon}
              </span>
              <span className={`analytics-change ${card.trend}`}>
                {card.trend === "up" && <ArrowUpRight size={12} />}
                {card.trend === "down" && <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <strong className="analytics-value">{card.value}</strong>
            <span className="analytics-label">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Crowd Distribution */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">
            <BarChart2 size={16} color="#30924C" />
            <h3>Crowd Distribution</h3>
          </div>
          <span className="dashboard-card-subtitle">Current snapshot</span>
        </div>
        <div className="density-bars">
          {densityBar.map((bar) => (
            <div className="density-bar-row" key={bar.label}>
              <span className="density-bar-label">{bar.label}</span>
              <div className="density-bar-track">
                <div
                  className="density-bar-fill"
                  style={{ width: `${bar.pct}%`, background: bar.color }}
                />
              </div>
              <span className="density-bar-pct">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Placeholder */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">
            <TrendingUp size={16} color="#30924C" />
            <h3>Peak Hours</h3>
          </div>
          <span className="dashboard-card-subtitle">Today</span>
        </div>
        <div className="peak-hours-chart">
          {["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"].map(
            (label, i) => {
              const heights = [20, 55, 40, 80, 65, 90, 70, 35];
              const isActive = i === 5;
              return (
                <div className="peak-bar-col" key={label}>
                  <div className="peak-bar-wrap">
                    <div
                      className={`peak-bar ${isActive ? "peak-bar-active" : ""}`}
                      style={{ height: `${heights[i]}%` }}
                    />
                  </div>
                  <span className="peak-bar-label">{label}</span>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">
            <Clock size={16} color="#30924C" />
            <h3>Recent Reports</h3>
          </div>
          <span className="dashboard-card-subtitle">Last 30 min</span>
        </div>
        <div className="activity-list">
          {recentActivity.map((item, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-dot-col">
                <span
                  className="activity-dot"
                  style={{
                    background:
                      item.density === "High"
                        ? "#e17055"
                        : item.density === "Medium"
                          ? "#fdcb6e"
                          : "#30924C",
                  }}
                />
              </div>
              <div className="activity-info">
                <span className="activity-location">{item.location}</span>
                <span className="activity-time">{item.time}</span>
              </div>
              <span
                className="activity-level"
                style={{
                  color:
                    item.density === "High"
                      ? "#e17055"
                      : item.density === "Medium"
                        ? "#b7930a"
                        : "#30924C",
                  background:
                    item.density === "High"
                      ? "#e1705518"
                      : item.density === "Medium"
                        ? "#fdcb6e22"
                        : "#30924C18",
                }}
              >
                {item.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function UserHomePage() {
  const userType: "admin" | "user" = "user";
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "dashboard">("home");

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleReportSubmit = (level: string) => {
    console.log(`Reporting ${level} for ${selectedLocation.name}`);
    alert("Thank you for your report!");
    setIsReportModalOpen(false);
  };

  const center: [number, number] = [10.3223, 123.8982];

  const locations = [
    {
      id: 1,
      name: "Cebu City Public Library",
      type: "Public Library",
      pos: [10.3095, 123.8931],
      density: "Medium",
      lastUpdated: "5 mins ago",
    },
    {
      id: 2,
      name: "Vicente Sotto Medical Center",
      type: "Hospital",
      pos: [10.3117, 123.8915],
      density: "High",
      lastUpdated: "2 mins ago",
    },
  ];

  return (
    <div className="user-home-page">
      {/* Header Section */}
      <header className="home-header">
        <h1 className="welcome-title">CrowdLens</h1>
        <p className="welcome-subtitle">Welcome back, Khing</p>
      </header>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === "home" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
      </div>

      {/* ── HOME TAB ── */}
      {activeTab === "home" && (
        <>
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
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              {selectedLocation && (
                <RecenterAutomatically location={selectedLocation} />
              )}
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.pos as [number, number]}
                  icon={getIconByDensity(location.density)}
                  eventHandlers={{
                    click: () => setSelectedLocation(location),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="popup-container">
                      <div className="popup-header">
                        <div className="badge-wrapper">
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#30924C",
                              fontWeight: "bold",
                              margin: "0 0 4px 0",
                              textTransform: "uppercase",
                            }}
                          >
                            {location.type}
                          </p>
                          <button
                            className="save-link-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(location.id);
                            }}
                          >
                            <img
                              src={
                                favoriteIds.includes(location.id)
                                  ? "/Favorites Selected.png"
                                  : "/Favorites.png"
                              }
                              alt={
                                favoriteIds.includes(location.id)
                                  ? "Saved"
                                  : "Save"
                              }
                              style={{
                                width: 20,
                                height: 20,
                                objectFit: "contain",
                              }}
                            />
                          </button>
                        </div>
                        <div className="title-row">
                          <h2>{location.name}</h2>
                        </div>
                        <div className="status-row">
                          <div className="badge-wrapper">
                            <span
                              className={`badge ${densityClasses[location.density]}`}
                            >
                              ● {location.density} Crowd Level
                            </span>
                            <span className="updated-text">
                              Updated {location.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <p className="quieter-nearby">
                          <strong>Tip:</strong> Lahug Area is currently quieter.
                        </p>
                      </div>
                      <div className="congestion-info">
                        <h3>Live Insights</h3>
                        <p>
                          Based on connection data, wait times are approximately
                          10-20 minutes.
                        </p>
                      </div>
                      <button
                        className="input-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReportModalOpen(true);
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
        </>
      )}

      {/* ── DASHBOARD TAB ── */}
      {activeTab === "dashboard" && <DashboardSection />}

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

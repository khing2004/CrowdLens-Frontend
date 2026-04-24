// src/pages/UserHome.tsx
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./UserHome.css";
import "../components/Home/CustomPopup.css";
import { useState, useEffect } from "react";
import { densityClasses, getIconByDensity, densityRank, getDistance } from "../utils/crowdHelper";
import ReportModal from "../components/Home/ReportModal";
import BottomNav from "../components/BottomNav";
import { toastSuccess, toastError, toastWarning } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import {
  Bookmark,
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
import type { CrowdLocation } from "../types/crowd";
import { submitCrowdReport, getLocations, getForecast } from "../api/crowdService";
import ConfirmReportModal from "../components/Home/ConfirmReportModal";

// ── Forecast mini-chart types ─────────────────────────────────────────────────
interface ForecastSlot { densityScore: number; isoTime: string; }

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

function RecenterAutomatically({ location }: { location: any }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location.pos, 18, { animate: true, duration: 0.7 });
    }
  }, [location, map]);
  return null;
}

// --- Dashboard Component ---
function DashboardSection() {
  const analyticsCards = [
    { label: "Total Reports Today", value: "128", change: "+12%", trend: "up", icon: <Activity size={18} />, color: "#30924C" },
    { label: "Active Crowd Alerts", value: "3",   change: "+1",   trend: "up", icon: <AlertTriangle size={18} />, color: "#e17055" },
    { label: "Avg. Crowd Level",    value: "Medium", change: "Stable", trend: "neutral", icon: <Users size={18} />, color: "#0984e3" },
    { label: "Locations Tracked",   value: "24",  change: "+2",   trend: "up", icon: <MapPin size={18} />, color: "#6c5ce7" },
  ];

  const recentActivity = [
    { location: "Cebu City Public Library",    level: "Medium", time: "5 mins ago",  density: "Medium" },
    { location: "Vicente Sotto Medical Center", level: "High",   time: "2 mins ago",  density: "High" },
    { location: "SM City Cebu",                level: "Low",    time: "11 mins ago", density: "Low" },
    { location: "Ayala Center Cebu",           level: "High",   time: "18 mins ago", density: "High" },
  ];

  const densityBar = [
    { label: "Low",    pct: 35, color: "#30924C" },
    { label: "Medium", pct: 45, color: "#fdcb6e" },
    { label: "High",   pct: 20, color: "#e17055" },
  ];

  return (
    <div className="dashboard-view">
      <div className="analytics-grid">
        {analyticsCards.map((card) => (
          <div className="analytics-card" key={card.label}>
            <div className="analytics-card-top">
              <span className="analytics-icon" style={{ color: card.color, background: `${card.color}18` }}>
                {card.icon}
              </span>
              <span className={`analytics-change ${card.trend}`}>
                {card.trend === "up"   && <ArrowUpRight size={12} />}
                {card.trend === "down" && <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <strong className="analytics-value">{card.value}</strong>
            <span className="analytics-label">{card.label}</span>
          </div>
        ))}
      </div>

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
                <div className="density-bar-fill" style={{ width: `${bar.pct}%`, background: bar.color }} />
              </div>
              <span className="density-bar-pct">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">
            <TrendingUp size={16} color="#30924C" />
            <h3>Peak Hours</h3>
          </div>
          <span className="dashboard-card-subtitle">Today</span>
        </div>
        <div className="peak-hours-chart">
          {["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"].map((label, i) => {
            const heights = [20, 55, 40, 80, 65, 90, 70, 35];
            const isActive = i === 5;
            return (
              <div className="peak-bar-col" key={label}>
                <div className="peak-bar-wrap">
                  <div className={`peak-bar ${isActive ? "peak-bar-active" : ""}`} style={{ height: `${heights[i]}%` }} />
                </div>
                <span className="peak-bar-label">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

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
                <span className="activity-dot" style={{
                  background: item.density === "High" ? "#e17055" : item.density === "Medium" ? "#fdcb6e" : "#30924C",
                }} />
              </div>
              <div className="activity-info">
                <span className="activity-location">{item.location}</span>
                <span className="activity-time">{item.time}</span>
              </div>
              <span className="activity-level" style={{
                color: item.density === "High" ? "#e17055" : item.density === "Medium" ? "#b7930a" : "#30924C",
                background: item.density === "High" ? "#e1705518" : item.density === "Medium" ? "#fdcb6e22" : "#30924C18",
              }}>
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
  const { user } = useAuth();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<CrowdLocation | null>(null);
  const [locations, setLocations] = useState<CrowdLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "dashboard">("home");

  const [popupForecast, setPopupForecast] = useState<{ slots: ForecastSlot[]; modelType: string } | null>(null);
  const [popupForecastLoading, setPopupForecastLoading] = useState(false);

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
      .catch(() => {})
      .finally(() => setPopupForecastLoading(false));
  }, [selectedLocation?.id]);

  useEffect(() => {
    getLocations()
      .then((data) => setLocations(data))
      .catch(() => toastError("Failed to load map data. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading CrowdLens Map...</div>;
  }

  const handleInitialSelect = (level: string) => {
    setPendingLevel(level);
    setIsConfirmOpen(true);
  };

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinalConfirm = async () => {
    if (!selectedLocation || !pendingLevel) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          await submitCrowdReport(selectedLocation.id, pendingLevel, lat, lng);
          toastSuccess(`Reported ${pendingLevel} for ${selectedLocation.name}`);
          setIsConfirmOpen(false);
          setIsReportModalOpen(false);
          const updatedData = await getLocations();
          setLocations(updatedData);
        } catch (error: any) {
          if (error.response?.status === 400) {
            toastWarning(error.response.data);
          } else {
            toastError("Failed to submit report. Please try again.");
          }
          setIsConfirmOpen(false);
        }
      },
      () => {
        toastError("Unable to access your location. Please allow GPS access to submit a report.");
        setIsConfirmOpen(false);
      }
    );
  };

  const center: [number, number] = [10.3223, 123.8982];
  const displayName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="user-home-page">
      <header className="home-header">
        <h1 className="welcome-title">CrowdLens</h1>
        <p className="welcome-subtitle">Welcome back, {displayName}</p>
      </header>

      <div className="tab-switcher">
        <button className={`tab-btn ${activeTab === "home" ? "tab-btn-active" : ""}`} onClick={() => setActiveTab("home")}>
          Home
        </button>
        <button className={`tab-btn ${activeTab === "dashboard" ? "tab-btn-active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
      </div>

      {activeTab === "home" && (
        <>
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

          <div className="dashboard-section">
            <h2>Recent Activity</h2>
            <p>You have no recent activity to display.</p>
          </div>

          <main className="map-section">
            <MapContainer center={center} zoom={14} className="main-map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              {selectedLocation && <RecenterAutomatically location={selectedLocation} />}
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.pos as [number, number]}
                  icon={getIconByDensity(location.density)}
                  eventHandlers={{ click: () => setSelectedLocation(location) }}
                >
                  <Popup className="custom-popup">
                    <div className="popup-container">
                      <div className="popup-header">
                        <div className="badge-wrapper">
                          <p style={{ fontSize: "12px", color: "#30924C", fontWeight: "bold", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                            {location.type}
                          </p>
                          <button
                            className="save-link-btn"
                            aria-label={favoriteIds.includes(location.id) ? "Remove from favorites" : "Save to favorites"}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(location.id); }}
                          >
                            <img
                              src={favoriteIds.includes(location.id) ? "/Favorites Selected.png" : "/Favorites.png"}
                              alt=""
                              style={{ width: 20, height: 20, objectFit: "contain" }}
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
                      {popupForecast && selectedLocation?.id === location.id && (
                        <Sparkline slots={popupForecast.slots} modelType={popupForecast.modelType} />
                      )}
                      <button
                        className="input-btn"
                        onClick={(e) => { e.stopPropagation(); setIsReportModalOpen(true); }}
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

      {activeTab === "dashboard" && <DashboardSection />}

      <BottomNav />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        locationName={selectedLocation?.name || ""}
        onSubmit={handleInitialSelect}
      />

      <ConfirmReportModal
        isOpen={isConfirmOpen}
        level={pendingLevel || ""}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalConfirm}
      />
    </div>
  );
}

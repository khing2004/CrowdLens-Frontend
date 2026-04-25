import "./Settings.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";

export default function Settings() {
  const userType: "admin" | "user" = "user"; // TODO: replace with real user type from auth context
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [pendingLocationEnabled, setPendingLocationEnabled] =
    useState(locationEnabled);
  const [notificationsSetting, setNotificationsSetting] = useState<
    "All" | "Mentions" | "None"
  >("All");
  const [pendingNotificationsSetting, setPendingNotificationsSetting] =
    useState<"All" | "Mentions" | "None">("All");

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activePanel) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;
      const targetNode = event.target as Node;
      if (!panelRef.current.contains(targetNode)) {
        setActivePanel(null);
        setPendingLocationEnabled(locationEnabled);
        setPendingNotificationsSetting(notificationsSetting);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [activePanel, locationEnabled, notificationsSetting]);

  const handleOptionClick = (item: string) => {
    if (item === "Location Sharing") {
      setPendingLocationEnabled(locationEnabled);
      setActivePanel((open) => (open === item ? null : item));
      return;
    }
    if (item === "Notifications") {
      setPendingNotificationsSetting(notificationsSetting);
      setActivePanel((open) => (open === item ? null : item));
      return;
    }

    setActivePanel(null);

    switch (item) {
      case "Profile":
        navigate("/profile");
        break;
      case "Privacy Policy":
        window.open("/privacy-policy", "_blank");
        break;
      case "Terms of Service":
        window.open("/terms-of-service", "_blank");
        break;
      case "Logout":
        console.log("Logout clicked");
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const optionItems = [
    { label: "Profile", icon: "👤" },
    { label: "Location Sharing", icon: "📍" },
    { label: "Notifications", icon: "🔔" },
    { label: "Privacy Policy", icon: "🔒" },
    { label: "Terms of Service", icon: "📄" },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-header-title">Account</h1>
        <p className="settings-header-sub">Manage your profile & preferences</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar-wrapper">
          <img src="/Logo.png" alt="Profile" className="profile-picture" />
          <span className="profile-avatar-badge" />
        </div>
        <div className="profile-info">
          <p className="profile-name">test</p>
          <p className="profile-email">test@example.com</p>
          <p className="profile-bio">
            This is a sample bio for the user. It can be edited in the profile settings.
          </p>
        </div>
        <button className="profile-edit-btn" onClick={() => navigate("/profile")}>
          Edit
        </button>
      </div>

      {/* Admin Button */}
      {userType === "admin" && (
        <>
          <p className="settings-section-label">Admin</p>
          <div className="admin-section">
            <button className="admin-btn" onClick={() => navigate("/locations")}>
              🗂 Manage Locations
            </button>
          </div>
        </>
      )}

      {/* Settings Options */}
      <p className="settings-section-label">Preferences</p>
      <ul className="settings-options">
        {optionItems.map(({ label, icon }) => {
          const isActivePanel = activePanel === label;
          return (
            <li key={label} className="settings-option">
              <button
                className="settings-action"
                onClick={() => handleOptionClick(label)}
              >
                <span className="settings-action-icon">{icon}</span>
                <span className="settings-action-label">{label}</span>
                <span className="settings-action-chevron">›</span>
              </button>

              {isActivePanel && label === "Location Sharing" && (
                <div
                  ref={panelRef}
                  className="settings-panel"
                  role="dialog"
                  aria-label="Location Sharing settings"
                >
                  <div className="panel-row">
                    <label htmlFor="location-toggle">Location Sharing</label>
                    <button
                      id="location-toggle"
                      className={`toggle-button ${pendingLocationEnabled ? "enabled" : "disabled"}`}
                      onClick={() => setPendingLocationEnabled((prev) => !prev)}
                    >
                      {pendingLocationEnabled ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="panel-actions">
                    <button
                      onClick={() => {
                        setLocationEnabled(pendingLocationEnabled);
                        setActivePanel(null);
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setPendingLocationEnabled(locationEnabled);
                        setActivePanel(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isActivePanel && label === "Notifications" && (
                <div
                  ref={panelRef}
                  className="settings-panel"
                  role="dialog"
                  aria-label="Notification preferences"
                >
                  <fieldset>
                    <legend>Notification preferences</legend>
                    {(["All", "Mentions", "None"] as const).map((opt) => (
                      <label key={opt}>
                        <input
                          type="radio"
                          name="notification-mode"
                          value={opt}
                          checked={pendingNotificationsSetting === opt}
                          onChange={() => setPendingNotificationsSetting(opt)}
                        />
                        {opt === "All"
                          ? "All notifications"
                          : opt === "Mentions"
                          ? "Mentions only"
                          : "None"}
                      </label>
                    ))}
                  </fieldset>
                  <div className="panel-actions">
                    <button
                      onClick={() => {
                        setNotificationsSetting(pendingNotificationsSetting);
                        setActivePanel(null);
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setPendingNotificationsSetting(notificationsSetting);
                        setActivePanel(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Logout — separated */}
      <p className="settings-section-label">Account</p>
      <ul className="settings-options">
        <li className="settings-option logout-option">
          <button
            className="settings-action"
            onClick={() => handleOptionClick("Logout")}
          >
            <span className="settings-action-icon">🚪</span>
            <span className="settings-action-label">Logout</span>
            <span className="settings-action-chevron">›</span>
          </button>
        </li>
      </ul>

      {/* Bottom Nav */}
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
            <img src="/Settings Selected.png" alt="Account" className="nav-icon" />
            <p className="nav-text">Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

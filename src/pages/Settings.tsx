import "./Settings.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [pendingLocationEnabled, setPendingLocationEnabled] = useState(locationEnabled);
  const [notificationsSetting, setNotificationsSetting] = useState<"All" | "Mentions" | "None">("All");
  const [pendingNotificationsSetting, setPendingNotificationsSetting] = useState<"All" | "Mentions" | "None">("All");

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activePanel) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setActivePanel(null);
        setPendingLocationEnabled(locationEnabled);
        setPendingNotificationsSetting(notificationsSetting);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [activePanel, locationEnabled, notificationsSetting]);

  const handleOptionClick = (item: string) => {
    if (item === "Location Sharing" || item === "Notifications") {
      if (item === "Location Sharing") setPendingLocationEnabled(locationEnabled);
      if (item === "Notifications") setPendingNotificationsSetting(notificationsSetting);
      setActivePanel((open) => (open === item ? null : item));
      return;
    }

    setActivePanel(null);

    switch (item) {
      case "Logout":
        logout();
        navigate("/");
        break;
      default:
        break;
    }
  };

  const optionItems = [
    "Location Sharing",
    "Notifications",
    "Logout",
  ];

  const isAdmin = user?.role === "admin" || user?.role === "Admin";
  const displayName = user?.name ?? "—";
  const displayEmail = user?.email ?? "—";

  return (
    <div className="settings-page">
      <p className="page-label">Account Settings</p>

      <div className="user-info">
        <img src="/Logo.png" alt="Profile" className="profile-picture" />
        <p className="username">{displayName}</p>
        <p className="email">{displayEmail}</p>
      </div>

      <div className="bio">
        <h2>Bio</h2>
        <p className="bio-text">
          This is a sample bio for the user. It can be edited in the profile settings.
        </p>
      </div>

      {isAdmin && (
        <div className="settings-option" style={{ margin: "0 auto 8px", maxWidth: 320 }}>
          <button className="settings-action" onClick={() => navigate("/locations")}>
            Manage Locations
          </button>
        </div>
      )}

      <ul className="settings-options">
        {optionItems.map((item) => {
          const isActivePanel = activePanel === item;
          const isLogout = item === "Logout";

          return (
            <li key={item} className="settings-option">
              <button
                className={`settings-action${isLogout ? " settings-action-logout" : ""}`}
                onClick={() => handleOptionClick(item)}
              >
                {item}
              </button>

              {isActivePanel && item === "Location Sharing" && (
                <div ref={panelRef} className="settings-panel" role="dialog" aria-label="Location Sharing settings">
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
                    <button onClick={() => { setLocationEnabled(pendingLocationEnabled); setActivePanel(null); }}>
                      Save
                    </button>
                    <button onClick={() => { setPendingLocationEnabled(locationEnabled); setActivePanel(null); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isActivePanel && item === "Notifications" && (
                <div ref={panelRef} className="settings-panel" role="dialog" aria-label="Notification preferences">
                  <fieldset>
                    <legend>Notification preferences</legend>
                    {(["All", "Mentions", "None"] as const).map((val) => (
                      <label key={val}>
                        <input
                          type="radio"
                          name="notification-mode"
                          value={val}
                          checked={pendingNotificationsSetting === val}
                          onChange={() => setPendingNotificationsSetting(val)}
                        />
                        {val === "All" ? "All notifications" : val === "Mentions" ? "Mentions only" : "None"}
                      </label>
                    ))}
                  </fieldset>
                  <div className="panel-actions">
                    <button onClick={() => { setNotificationsSetting(pendingNotificationsSetting); setActivePanel(null); }}>
                      Save
                    </button>
                    <button onClick={() => { setPendingNotificationsSetting(notificationsSetting); setActivePanel(null); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <BottomNav />
    </div>
  );
}

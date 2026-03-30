import "./Settings.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
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
    if (!activePanel) {
      return;
    }

    const onClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) {
        return;
      }

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
        // TODO: replace with real logout API call
        console.log("Logout clicked");
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const optionItems = [
    "Profile",
    "Location Sharing",
    "Notifications",
    "Privacy Policy",
    "Terms of Service",
    "Logout",
  ];

  return (
    <div className="user-home-page">
      <p className="page-label">Account Settings</p>

      <div className="user-info">
        <img src="/Logo.png" alt="Profile" className="profile-picture" />
        <p className="username">test</p>
        <p className="email">test@example.com</p>
      </div>

      <div className="bio">
        <h2>Bio</h2>
        <p className="bio-text">
          This is a sample bio for the user. It can be edited in the profile
          settings.
        </p>
      </div>

      <ul className="settings-options">
        {optionItems.map((item) => {
          const isActivePanel = activePanel === item;

          return (
            <li key={item} className="settings-option">
              <button
                className="settings-action"
                onClick={() => handleOptionClick(item)}
              >
                {item}
              </button>

              {isActivePanel && item === "Location Sharing" && (
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

              {isActivePanel && item === "Notifications" && (
                <div
                  ref={panelRef}
                  className="settings-panel"
                  role="dialog"
                  aria-label="Notification preferences"
                >
                  <fieldset>
                    <legend>Notification preferences</legend>
                    <label>
                      <input
                        type="radio"
                        name="notification-mode"
                        value="All"
                        checked={pendingNotificationsSetting === "All"}
                        onChange={() => setPendingNotificationsSetting("All")}
                      />
                      All notifications
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="notification-mode"
                        value="Mentions"
                        checked={pendingNotificationsSetting === "Mentions"}
                        onChange={() =>
                          setPendingNotificationsSetting("Mentions")
                        }
                      />
                      Mentions only
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="notification-mode"
                        value="None"
                        checked={pendingNotificationsSetting === "None"}
                        onChange={() => setPendingNotificationsSetting("None")}
                      />
                      None
                    </label>
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
            <img
              src="/Settings Selected.png"
              alt="Account"
              className="nav-icon"
            />
            <p className="nav-text">Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

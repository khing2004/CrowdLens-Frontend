import "./ManageLocations.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type AvailableLocation = {
  id: number;
  name: string;
  type: string;
  density: string;
  lastUpdated: string;
  address: string;
};

export default function ManageLocations() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [pendingLocationEnabled, setPendingLocationEnabled] =
    useState(locationEnabled);

  const [locations, manageLocations] = useState<AvailableLocation[]>([
    {
      id: 1,
      name: "Cebu City Public Library",
      type: "Public Library",
      density: "Medium",
      lastUpdated: "5 mins ago",
      address: "Osmeña Blvd, Cebu City",
    },
    {
      id: 2,
      name: "Vicente Sotto Medical Center",
      type: "Hospital",
      density: "High",
      lastUpdated: "2 mins ago",
      address: "M. Velez St, Cebu City",
    },
  ]);

  return (
    <div className="manage-locations-page">
      <h1>Manage Locations</h1>
      <div className="favorites-list">
        {locations.length === 0 ? (
          <p className="empty-text">No locations added yet.</p>
        ) : (
          locations.map((location) => (
            <div key={location.id} className="favorite-card">
              <h3>{location.name}</h3>
              <p className="favorite-type">{location.type}</p>
              <p className="favorite-item">Density: {location.density}</p>
              <p className="favorite-item">
                Last updated: {location.lastUpdated}
              </p>
              <p className="favorite-item">Address: {location.address}</p>
            </div>
          ))
        )}
      </div>

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
          <Link to="/locations" className="nav-item">
            <img
              src="/Locations Selected.png"
              alt="Locations"
              className="nav-icon"
            />
            <p className="nav-text">Locations</p>
          </Link>
        </div>
        <div className="nav-section">
          <Link to="/settings" className="nav-item">
            <img src="/Settings.png" alt="Account" className="nav-icon" />
            <p className="nav-text">Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

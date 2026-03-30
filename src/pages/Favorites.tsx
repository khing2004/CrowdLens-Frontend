import "./Favorites.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FavoriteLocation = {
  id: number;
  name: string;
  type: string;
  density: string;
  lastUpdated: string;
  address: string;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([
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
    <div className="favorites-page">
      <p className="page-label">Favorites</p>

      <div className="favorites-list">
        {favorites.length === 0 ? (
          <p className="empty-text">No favorites added yet.</p>
        ) : (
          favorites.map((fav) => (
            <div key={fav.id} className="favorite-card">
              <h3>{fav.name}</h3>
              <p className="favorite-type">{fav.type}</p>
              <p className="favorite-item">Density: {fav.density}</p>
              <p className="favorite-item">Last updated: {fav.lastUpdated}</p>
              <p className="favorite-item">Address: {fav.address}</p>
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
            <img
              src="/Favorites Selected.png"
              alt="Favorites"
              className="nav-icon"
            />
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
    </div>
  );
}

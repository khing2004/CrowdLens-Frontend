import "./Favorites.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { submitCrowdReport } from "../api/crowdService";
import ReportModal from "../components/Home/ReportModal";

type FavoriteLocation = {
  id: number;
  name: string;
  type: string;
  density: string;
  lastUpdated: string;
  address: string;
  pos: [number, number];
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
      pos: [10.3095, 123.8931],
    },
    {
      id: 2,
      name: "Vicente Sotto Medical Center",
      type: "Hospital",
      density: "High",
      lastUpdated: "2 mins ago",
      address: "M. Velez St, Cebu City",
      pos: [10.3117, 123.8915],
    },
  ]);
  const [selectedFavorite, setSelectedFavorite] =
    useState<FavoriteLocation | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openReportModal = (fav: FavoriteLocation) => {
    setSelectedFavorite(fav);
    setError(null);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (level: string) => {
    if (!selectedFavorite) return;

    setError(null);

    let success = false;
    try {
      await submitCrowdReport(selectedFavorite.id, level);
      success = true;
    } catch (err) {
      console.warn(
        "Report API failed, but we'll still show success for UX:",
        err,
      );
      success = true;
    }

    if (success) {
      setFavorites((prev) =>
        prev.map((fav) =>
          fav.id === selectedFavorite.id
            ? { ...fav, density: level, lastUpdated: "Just now" }
            : fav,
        ),
      );
      setIsReportModalOpen(false);
      setSelectedFavorite(null);
      window.alert("Thank you for your report!");
    }
  };

  const handleDelete = (locationId: number) => {
    const target = favorites.find((fav) => fav.id === locationId);
    if (!target) return;

    const confirmed = window.confirm(`Delete favorite \"${target.name}\"?`);
    if (!confirmed) return;

    setFavorites((prev) => prev.filter((fav) => fav.id !== locationId));
  };

  return (
    <div className="favorites-page">
      <p className="page-label">Favorites</p>

      {error && <p className="error-message">{error}</p>}

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

              <div className="favorite-actions">
                <button
                  className="create-report-btn"
                  onClick={() => openReportModal(fav)}
                >
                  Create Report
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(fav.id)}
                >
                  Delete
                </button>
              </div>
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedFavorite(null);
        }}
        locationName={selectedFavorite?.name || ""}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

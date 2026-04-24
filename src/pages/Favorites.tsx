import "./Favorites.css";
import { useState } from "react";
import { submitCrowdReport } from "../api/crowdService";
import ReportModal from "../components/Home/ReportModal";
import BottomNav from "../components/BottomNav";
import { toastSuccess, toastError } from "../components/Toast";

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
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteLocation | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openReportModal = (fav: FavoriteLocation) => {
    setSelectedFavorite(fav);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (level: string) => {
    if (!selectedFavorite) return;
    try {
      await submitCrowdReport(selectedFavorite.id, level);
    } catch {
      // silently continue — optimistic update below
    }
    setFavorites((prev) =>
      prev.map((fav) =>
        fav.id === selectedFavorite.id ? { ...fav, density: level, lastUpdated: "Just now" } : fav
      )
    );
    setIsReportModalOpen(false);
    setSelectedFavorite(null);
    toastSuccess("Report submitted. Thank you!");
  };

  const handleDelete = (locationId: number) => {
    const target = favorites.find((fav) => fav.id === locationId);
    if (!target) return;
    // Replace window.confirm with inline confirmation state
    setDeletingId(locationId);
  };

  const confirmDelete = (locationId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== locationId));
    setDeletingId(null);
    toastSuccess("Favorite removed.");
  };

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

              {deletingId === fav.id ? (
                <div className="delete-confirm">
                  <p className="delete-confirm-text">Remove &ldquo;{fav.name}&rdquo;?</p>
                  <div className="favorite-actions">
                    <button className="delete-btn" onClick={() => confirmDelete(fav.id)}>
                      Yes, Remove
                    </button>
                    <button className="cancel-btn" onClick={() => setDeletingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="favorite-actions">
                  <button className="create-report-btn" onClick={() => openReportModal(fav)}>
                    Create Report
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(fav.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => { setIsReportModalOpen(false); setSelectedFavorite(null); }}
        locationName={selectedFavorite?.name || ""}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

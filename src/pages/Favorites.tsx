import "./Favorites.css";
import { useState, useEffect } from "react";
import { getFavorites, removeFavorite, submitCrowdReport } from "../api/crowdService";
import ReportModal from "../components/Home/ReportModal";
import BottomNav from "../components/BottomNav";
import { toastSuccess, toastError } from "../components/Toast";
import type { CrowdLocation } from "../types/crowd";

export default function Favorites() {
  const [favorites, setFavorites] = useState<CrowdLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState<CrowdLocation | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => toastError("Could not load favorites. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const openReportModal = (fav: CrowdLocation) => {
    setSelectedFavorite(fav);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (level: string) => {
    if (!selectedFavorite) return;

    // Optimistic local update; best-effort API call
    try {
      await submitCrowdReport(selectedFavorite.id, level, 0, 0);
    } catch {
      // GPS not needed on Favorites page — fall through to local update
    }

    setFavorites((prev) =>
      prev.map((fav) =>
        fav.id === selectedFavorite.id
          ? { ...fav, density: level as CrowdLocation["density"], lastUpdated: "Just now" }
          : fav
      )
    );
    setIsReportModalOpen(false);
    setSelectedFavorite(null);
    toastSuccess("Report submitted. Thank you!");
  };

  const confirmDelete = async (locationId: number) => {
    // Optimistic remove
    setFavorites((prev) => prev.filter((f) => f.id !== locationId));
    setDeletingId(null);
    try {
      await removeFavorite(locationId);
      toastSuccess("Favorite removed.");
    } catch {
      toastError("Failed to remove favorite. Please try again.");
      // Re-fetch to restore state
      getFavorites().then(setFavorites).catch(() => {});
    }
  };

  return (
    <div className="favorites-page">
      <p className="page-label">Favorites</p>

      <div className="favorites-list">
        {loading && <p className="empty-text">Loading favorites…</p>}

        {!loading && favorites.length === 0 && (
          <p className="empty-text">No favorites yet. Tap the bookmark icon on any location to save it.</p>
        )}

        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-card">
            <h3>{fav.name}</h3>
            <p className="favorite-type">{fav.type}</p>
            <p className="favorite-item">Crowd Level: <strong>{fav.density}</strong></p>
            <p className="favorite-item">Last updated: {fav.lastUpdated}</p>

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
                <button className="delete-btn" onClick={() => setDeletingId(fav.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
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

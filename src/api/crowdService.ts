import { apiClient } from "./authService";
import type { CrowdLocation } from "../types/crowd";
import type { AlertedLocation } from "../components/AlertModal";

export const submitCrowdReport = async (
  locationId: number,
  level: string,
  latitude: number,
  longitude: number
) => {
  return await apiClient.post("/api/Crowd/report", {
    locationId,
    SelectedLevel: level,
    latitude,
    longitude,
    timestamp: new Date().toISOString(),
  });
};

export const getLocations = async (): Promise<CrowdLocation[]> => {
  const response = await apiClient.get("/api/Crowd/locations");
  return response.data;
};

export const getForecast = async (locationId: number, hoursAhead: number = 6) => {
  const response = await apiClient.get(`/api/Forecast/${locationId}?hoursAhead=${hoursAhead}`);
  return response.data;
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface RecentReport {
  locationId: number;
  locationName: string;
  densityLevel: string;
  reportedAt: string; // ISO timestamp
}

export const getRecentReports = async (): Promise<RecentReport[]> => {
  const response = await apiClient.get("/api/Crowd/recent-reports");
  return response.data;
};

// ── Favorites ─────────────────────────────────────────────────────────────────

export const getFavorites = async (): Promise<CrowdLocation[]> => {
  const response = await apiClient.get("/api/Favorites");
  return response.data;
};

// threshold: "None" | "Very Low" | "Low" | "Medium"
export const addFavorite = async (locationId: number, threshold: string = "Low"): Promise<void> => {
  await apiClient.post(`/api/Favorites/${locationId}`, { alertThreshold: threshold });
};

export const updateFavoriteThreshold = async (locationId: number, threshold: string): Promise<void> => {
  await apiClient.put(`/api/Favorites/${locationId}/threshold`, { alertThreshold: threshold });
};

export const removeFavorite = async (locationId: number): Promise<void> => {
  await apiClient.delete(`/api/Favorites/${locationId}`);
};

// ── Alerts ────────────────────────────────────────────────────────────────────

export const checkAlerts = async (): Promise<AlertedLocation[]> => {
  const response = await apiClient.get("/api/Alerts/check");
  return response.data;
};

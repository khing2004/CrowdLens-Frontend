// src/utils/crowdHelpers.ts
import L from "leaflet";

// used in UserHome.tsx
export const createPulseIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="pulse-marker" style="background-color: ${color};"></div>`,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Used in UserHome.tsx
export const getIconByDensity = (densityLevel: string) => {
  if (densityLevel === "Very High") return createPulseIcon("#6c1313");
  if (densityLevel === "High") return createPulseIcon("#d32f2f");
  if (densityLevel === "Medium") return createPulseIcon("#f57c00");
  if (densityLevel === "Low") return createPulseIcon("#15803d");
  if (densityLevel === "Very Low") return createPulseIcon("#84cc16");
  return createPulseIcon("#64748b");
};

// used in UserHome.tsx
export const densityClasses: Record<string, string> = {
  "Very High": "very-high",
  "High": "high",
  "Medium": "moderate",
  "Low": "low",
  "Very Low": "very-low"
};
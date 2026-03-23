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
export const getIconByDensity = (density: string) => {
  if (density === "High") return createPulseIcon("#d32f2f");
  if (density === "Medium") return createPulseIcon("#f57c00");
  return createPulseIcon("#388e3c");
};

// used in UserHome.tsx
export const densityClasses: Record<string, string> = {
  "High": "high",
  "Medium": "medium",
  "Low": "low"
};
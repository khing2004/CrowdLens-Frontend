// Define specific union types for better IDE autocompletion
export type DensityLevel = "Very High" | "High" | "Medium" | "Low" | "Very Low";

// used in ReportModals as options
export const Options = [
  { level: "Very Low", desc: "Plenty of space, no waiting time." },
  { level: "Low", desc: "A few people around, very comfortable." },
  { level: "Moderate", desc: "Moderate crowd, some waiting may occur." },
  { level: "High", desc: "Crowded, limited seating and longer waits." },
  { level: "Very High", desc: "Extremely packed, avoid if possible." },
];

// used 
export interface CrowdLocation {
  id: number;
  name: string;
  type: string; // e.g., "Public Library", "Hospital"
  pos: [number, number]; // [latitude, longitude]
  densityLevel: DensityLevel;
  lastUpdated: string;
  votes: {
    "Very Low": number;
    "Low": number;
    "Moderate": number;
    "High": number;
    "Very High": number;
  };
}

// used in ReportModal.tsx
export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  onSubmit: (level: string) => void;
}
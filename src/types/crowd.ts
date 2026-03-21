// Define specific union types for better IDE autocompletion
export type DensityLevel = "High" | "Medium" | "Low";

export interface CrowdLocation {
  id: number;
  name: string;
  type: string; // e.g., "Public Library", "Hospital"
  pos: [number, number]; // [latitude, longitude]
  density: DensityLevel;
  lastUpdated: string;
}
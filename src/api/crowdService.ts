import axios from "axios";

export const submitCrowdReport = async (locationId: number, level: string) => {
  // This is the "industry standard" place for this logic
  return await axios.post("/api/reports", {
    locationId,
    crowdLevel: level,
    timestamp: new Date().toISOString()
  });
};
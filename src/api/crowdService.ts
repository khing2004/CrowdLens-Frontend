import { apiClient } from "./authService";

export const submitCrowdReport = async (
  locationId: number, 
  level: string, 
  latitude: number, 
  longitude: number) => {
  return await apiClient.post("/api/Crowd/report", {
    locationId,
    SelectedLevel: level, //crowdlevel
    latitude,
    longitude,
    timestamp: new Date().toISOString(),

  });
  
};

export const getLocations = async () => {
  const response = await apiClient.get('/api/Crowd/locations');
  console.log("Fetched locations:", response.data);
  return response.data;
};

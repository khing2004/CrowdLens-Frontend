import { apiClient } from "./authService";

export const submitCrowdReport = async (locationId: number, level: string) => {
  return await apiClient.post("http://localhost:5041/api/Crowd/report", {
    locationId,
    SelectedLevel: level, //crowdlevel
    timestamp: new Date().toISOString()
  });
  
};

export const getLocations = async () => {
  const response = await apiClient.get('/api/Crowd/locations');
  console.log("Fetched locations:", response.data);
  return response.data;
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forecast.css";

const AREAS = ["Downtown", "North District", "Shopping Mall", "Public Park"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function Forecast() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleForecast = () => {
    if (!area || !time) {
      alert("Please select both an area and a time.");
      return;
    }
    
    // Mock Logic: In a real app, this would call your Laravel backend
    const densities = ["Low", "Medium", "High"];
    const randomDensity = densities[Math.floor(Math.random() * densities.length)];
    setResult(randomDensity);
  };

  return (
    <div className="forecast-page">
      <button className="back-btn" onClick={() => navigate("/home")}>← Back</button>
      
      <div className="forecast-card">
        <h1 className="title">Crowd Forecast</h1>
        <p className="subtitle">Predict density before you go</p>

        <label>Select Area</label>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Choose an area...</option>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <label>Select Time</label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="">Choose a time...</option>
          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <button className="forecast-btn" onClick={handleForecast}>
          Check Density
        </button>

        {result && (
          <div className={`result-box ${result.toLowerCase()}`}>
            <p>Predicted Density:</p>
            <h2>{result}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
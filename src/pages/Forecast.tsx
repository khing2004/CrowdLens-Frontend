import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getLocations, getForecast } from "../api/crowdService";
import "./Forecast.css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Location {
  id: number;
  name: string;
  type: string;
}

interface ForecastSlot {
  hour: string;
  isoTime: string;
  densityScore: number;
  densityLevel: string;
  confidencePct: number;
  lowDataWarning: boolean;
}

interface ForecastAlternative {
  locationId: number;
  locationName: string;
  peakDensityScore: number;
  peakDensityLevel: string;
}

interface ForecastResponse {
  locationId: number;
  locationName: string;
  forecast: ForecastSlot[];
  suggestedAlternative: ForecastAlternative | null;
  forecastUnavailable: boolean;
  modelType: string;   // "lstm" | "statistical"
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SCORE_META: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Very Low",  color: "#2e7d32", bg: "#e8f5e9" },
  2: { label: "Low",       color: "#558b2f", bg: "#f1f8e9" },
  3: { label: "Medium",    color: "#e65100", bg: "#fff3e0" },
  4: { label: "High",      color: "#c62828", bg: "#ffebee" },
  5: { label: "Very High", color: "#b71c1c", bg: "#ffcdd2" },
};

// Gradient stop colours for the AreaChart fill
const AREA_GRADIENT = [
  { score: 1, stop: "#4caf50" },
  { score: 2, stop: "#8bc34a" },
  { score: 3, stop: "#ff9800" },
  { score: 4, stop: "#f44336" },
  { score: 5, stop: "#b71c1c" },
];

function scoreMeta(score: number) {
  return SCORE_META[score] ?? SCORE_META[2];
}

function peakColor(slots: ForecastSlot[]) {
  const max = Math.max(...slots.map(s => s.densityScore));
  return scoreMeta(max).color;
}

function formatHour(isoTime: string) {
  const d = new Date(isoTime);
  const h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${ampm}`;
}

// Custom Recharts tooltip
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value as number;
  const meta  = scoreMeta(Math.round(score));
  return (
    <div style={{ background: meta.bg, border: `1px solid ${meta.color}`, borderRadius: 8, padding: "6px 10px", fontSize: 12 }}>
      <strong style={{ color: meta.color }}>{label}</strong>
      <br />
      Score: <strong style={{ color: meta.color }}>{score.toFixed(1)}</strong> — {meta.label}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Forecast() {
  const navigate = useNavigate();

  const [locations, setLocations]       = useState<Location[]>([]);
  const [locLoading, setLocLoading]     = useState(true);
  const [selectedId, setSelectedId]     = useState<number | "">("");
  const [hoursAhead, setHoursAhead]     = useState(6);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    getLocations()
      .then((data: Location[]) => setLocations(data))
      .catch(() => setError("Could not load locations. Please try again."))
      .finally(() => setLocLoading(false));
  }, []);

  const handleForecast = async () => {
    if (selectedId === "") { setError("Please select a location."); return; }
    setError(null);
    setLoading(true);
    setForecastData(null);
    try {
      const data: ForecastResponse = await getForecast(Number(selectedId), hoursAhead);
      setForecastData(data);
    } catch {
      setForecastData({ locationId: Number(selectedId), locationName: "", forecast: [],
                        suggestedAlternative: null, forecastUnavailable: true, modelType: "" });
    } finally {
      setLoading(false);
    }
  };

  const anyLowData = forecastData?.forecast.some(s => s.lowDataWarning) ?? false;
  const hasHighPeak = forecastData?.forecast.some(s => s.densityScore >= 4) ?? false;

  // Build data array for Recharts
  const chartData = forecastData?.forecast.map(s => ({
    hour:  formatHour(s.isoTime),
    score: s.densityScore,
  })) ?? [];

  const isLSTM = forecastData?.modelType === "lstm";

  return (
    <div className="forecast-page">
      <button className="back-btn" onClick={() => navigate("/home")}>← Back</button>

      <div className="forecast-card">
        <h1 className="fc-title">Crowd Forecast</h1>
        <p className="fc-subtitle">AI-based crowd predictions for the next few hours</p>

        {/* ── Controls ── */}
        <div className="fc-controls">
          <div className="fc-field">
            <label className="fc-label">Location</label>
            {locLoading
              ? <div className="fc-skeleton fc-skeleton-select" />
              : (
                <select className="fc-select" value={selectedId}
                  onChange={e => { setSelectedId(e.target.value === "" ? "" : Number(e.target.value)); setForecastData(null); setError(null); }}>
                  <option value="">Choose a location…</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              )}
          </div>
          <div className="fc-field">
            <label className="fc-label">Time period</label>
            <select className="fc-select" value={hoursAhead}
              onChange={e => { setHoursAhead(Number(e.target.value)); setForecastData(null); }}>
              <option value={3}>Next 3 hours</option>
              <option value={6}>Next 6 hours</option>
              <option value={12}>Next 12 hours</option>
            </select>
          </div>
        </div>

        <button className="fc-btn" onClick={handleForecast} disabled={loading || selectedId === ""}>
          {loading ? "Generating forecast…" : "Get Forecast"}
        </button>

        {error && <p className="fc-error">{error}</p>}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="fc-slots">
            {Array.from({ length: hoursAhead }).map((_, i) => (
              <div key={i} className="fc-slot fc-slot-skeleton" />
            ))}
          </div>
        )}

        {/* ── Forecast unavailable ── */}
        {forecastData?.forecastUnavailable && (
          <div className="fc-unavailable">
            <span className="fc-unavailable-icon">⚠</span>
            <p>Forecast not available for this location right now.</p>
            <p className="fc-unavailable-sub">Please try again later.</p>
          </div>
        )}

        {/* ── Results ── */}
        {forecastData && !forecastData.forecastUnavailable && (
          <>
            {/* Model type badge */}
            <div className="fc-model-row">
              <p className="fc-location-label">
                Next {hoursAhead} hours for <strong>{forecastData.locationName}</strong>
              </p>
              <span className={`fc-model-badge ${isLSTM ? "fc-badge-lstm" : "fc-badge-stat"}`}>
                {isLSTM ? "⚡ LSTM" : "📊 Statistical"}
              </span>
            </div>

            {/* Score cards */}
            <div className="fc-slots">
              {forecastData.forecast.map(slot => {
                const meta = scoreMeta(slot.densityScore);
                return (
                  <div key={slot.isoTime} className="fc-slot"
                    style={{ background: meta.bg, borderColor: meta.color }}>
                    <span className="fc-slot-hour">{formatHour(slot.isoTime)}</span>
                    <span className="fc-slot-score" style={{ color: meta.color }}>{slot.densityScore}</span>
                    <span className="fc-slot-level" style={{ color: meta.color }}>{slot.densityLevel}</span>
                    <span className="fc-slot-conf"
                      style={{ color: slot.confidencePct < 60 ? "#e65100" : "#757575" }}>
                      {slot.confidencePct}% conf.
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Trend chart */}
            <div className="fc-chart-wrapper">
              <p className="fc-chart-title">Predicted Trend</p>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={peakColor(forecastData.forecast)} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={peakColor(forecastData.forecast)} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={peakColor(forecastData.forecast)}
                    strokeWidth={2}
                    fill="url(#densityGrad)"
                    dot={{ r: 4, fill: peakColor(forecastData.forecast) }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* High congestion alert */}
            {hasHighPeak && (
              <div className="fc-alert">
                <span className="fc-alert-icon">⚠</span>
                <span>High congestion expected during this period.</span>
              </div>
            )}

            {/* Alternative suggestion */}
            {forecastData.suggestedAlternative && (
              <div className="fc-alternative">
                <p className="fc-alt-title">Suggested alternative</p>
                <div className="fc-alt-card"
                  style={{
                    borderColor: scoreMeta(forecastData.suggestedAlternative.peakDensityScore).color,
                    background:  scoreMeta(forecastData.suggestedAlternative.peakDensityScore).bg,
                  }}>
                  <span className="fc-alt-name">{forecastData.suggestedAlternative.locationName}</span>
                  <span className="fc-alt-level"
                    style={{ color: scoreMeta(forecastData.suggestedAlternative.peakDensityScore).color }}>
                    Peak: {forecastData.suggestedAlternative.peakDensityLevel}{" "}
                    ({forecastData.suggestedAlternative.peakDensityScore}/5)
                  </span>
                </div>
              </div>
            )}

            {/* Disclaimers */}
            {anyLowData && (
              <p className="fc-disclaimer fc-disclaimer-warn">
                ⚠ Limited historical data for some time slots — predictions may be less accurate.
              </p>
            )}
            <p className="fc-disclaimer">
              {isLSTM
                ? "Predictions generated by an LSTM neural network trained on historical crowd data. Real-time conditions may vary."
                : "Predictions use a statistical pattern model. For LSTM predictions, start the ML service (serve.py)."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

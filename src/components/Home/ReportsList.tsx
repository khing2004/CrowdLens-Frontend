import { useEffect, useState } from "react";
import { getLocationReports, voteOnReport, type ReportDetail } from "../../api/crowdService";
import { toastError, toastWarning } from "../Toast";
import { useAuth } from "../../context/AuthContext";
import "./ReportsList.css";

const DENSITY_COLOR: Record<string, string> = {
  "Very High": "#b71c1c",
  "High":      "#e17055",
  "Medium":    "#fdcb6e",
  "Low":       "#30924C",
  "Very Low":  "#84cc16",
};

function timeAgo(isoStr: string): string {
  const mins = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function isLocationSharingEnabled(email: string | undefined): boolean {
  if (!email) return true;
  try {
    const saved = localStorage.getItem(`cl_settings_${email}`);
    return saved ? (JSON.parse(saved)?.locationEnabled ?? true) : true;
  } catch {
    return true;
  }
}

interface Props {
  locationId: number;
}

export default function ReportsList({ locationId }: Props) {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getLocationReports(locationId)
      .then(setReports)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [locationId]);

  const handleVote = (reportId: number, voteType: "Up" | "Down") => {
    if (votingId !== null) return;

    if (!isLocationSharingEnabled(user?.email)) {
      toastError("Location sharing is disabled. Enable it in Settings to vote on reports.");
      return;
    }

    setVotingId(reportId);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await voteOnReport(reportId, voteType, latitude, longitude);

          setReports((prev) =>
            prev.map((r) =>
              r.id === reportId
                ? { ...r, upvotes: result.upvotes, downvotes: result.downvotes, userVote: result.userVote }
                : r
            )
          );
        } catch (error: any) {
          if (error.response?.status === 400) {
            toastWarning(error.response.data);
          } else {
            toastError("Failed to vote. Please try again.");
          }
        } finally {
          setVotingId(null);
        }
      },
      () => {
        toastError("Enable GPS to vote on reports.");
        setVotingId(null);
      },
      { timeout: 5000 }
    );
  };

  if (loading) return <p className="rl-empty">Loading reports…</p>;
  if (reports.length === 0) return <p className="rl-empty">No reports in the last hour.</p>;

  return (
    <div className="rl-list">
      {reports.map((r) => {
        const color = DENSITY_COLOR[r.densityLevel] ?? "#30924C";
        const karma = r.upvotes - r.downvotes;
        const isVoting = votingId === r.id;
        return (
          <div className="rl-card" key={r.id}>
            <div className="rl-top">
              <span className="rl-badge" style={{ color, background: `${color}18` }}>
                ● {r.densityLevel}
              </span>
              <span className="rl-meta">{r.userName} · {timeAgo(r.reportedAt)}</span>
            </div>

            {r.remark && <p className="rl-remark">"{r.remark}"</p>}

            <div className="rl-votes">
              <button
                className={`rl-vote-btn up ${r.userVote === "Up" ? "active" : ""}`}
                onClick={() => handleVote(r.id, "Up")}
                disabled={isVoting}
                title="Upvote"
              >
                ▲
              </button>
              <span className={`rl-karma ${karma > 0 ? "pos" : karma < 0 ? "neg" : ""}`}>
                {isVoting ? "…" : karma > 0 ? `+${karma}` : karma}
              </span>
              <button
                className={`rl-vote-btn down ${r.userVote === "Down" ? "active" : ""}`}
                onClick={() => handleVote(r.id, "Down")}
                disabled={isVoting}
                title="Downvote"
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

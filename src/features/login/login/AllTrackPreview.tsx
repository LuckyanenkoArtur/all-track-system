import { useEffect, useState, type CSSProperties } from "react";
import {
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import "./AllTrackPreview.scss";

const TASKS = [
  { name: "API integration", assignee: "Alex M.", status: "In Progress", tone: "blue" },
  { name: "Budget review Q2", assignee: "Sarah K.", status: "Done", tone: "green" },
  { name: "Sprint planning", assignee: "James R.", status: "Pending", tone: "amber" },
];

const TIME_BARS = [42, 68, 55, 82, 61, 74, 48];

export default function AllTrackPreview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`at-preview ${mounted ? "at-preview--ready" : ""}`}>
      <div className="at-preview__copy">
        <h2 className="at-preview__title">
          Time, tasks &amp; budget — all in one place.
        </h2>
        <p className="at-preview__subtitle">
          Log in to access your AllTrack workspace and manage your team
          operations effortlessly.
        </p>
      </div>

      <div className="at-preview__board">
        <div className="at-preview__stats">
          <div className="at-preview__stat at-preview__anim" style={{ "--delay": "0.1s" } as CSSProperties}>
            <div className="at-preview__stat-icon at-preview__stat-icon--time">
              <FiClock />
            </div>
            <div>
              <span className="at-preview__stat-label">Hours Tracked</span>
              <strong className="at-preview__stat-value">1,284h</strong>
              <span className="at-preview__stat-trend at-preview__stat-trend--up">
                <FiTrendingUp /> +12.4%
              </span>
            </div>
          </div>

          <div className="at-preview__stat at-preview__anim" style={{ "--delay": "0.2s" } as CSSProperties}>
            <div className="at-preview__stat-icon at-preview__stat-icon--task">
              <FiCheckSquare />
            </div>
            <div>
              <span className="at-preview__stat-label">Active Tasks</span>
              <strong className="at-preview__stat-value">48</strong>
              <span className="at-preview__stat-trend at-preview__stat-trend--up">
                <FiTrendingUp /> +6 today
              </span>
            </div>
          </div>

          <div className="at-preview__stat at-preview__anim" style={{ "--delay": "0.3s" } as CSSProperties}>
            <div className="at-preview__stat-icon at-preview__stat-icon--finance">
              <FiDollarSign />
            </div>
            <div>
              <span className="at-preview__stat-label">Budget Used</span>
              <strong className="at-preview__stat-value">$84,210</strong>
              <span className="at-preview__stat-trend">72% of plan</span>
            </div>
          </div>
        </div>

        <div className="at-preview__grid">
          <div className="at-preview__card at-preview__anim" style={{ "--delay": "0.35s" } as CSSProperties}>
            <div className="at-preview__card-head">
              <h3>Weekly Time</h3>
              <span>Team hours</span>
            </div>
            <div className="at-preview__bars">
              {TIME_BARS.map((height, i) => (
                <div key={i} className="at-preview__bar-wrap">
                  <div
                    className="at-preview__bar"
                    style={{ "--h": `${height}%`, "--i": i } as CSSProperties}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="at-preview__card at-preview__card--gauge at-preview__anim" style={{ "--delay": "0.45s" } as CSSProperties}>
            <div className="at-preview__card-head">
              <h3>Budget</h3>
              <span>Q2 overview</span>
            </div>
            <div className="at-preview__gauge">
              <svg viewBox="0 0 120 70" className="at-preview__gauge-svg">
                <path
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  fill="none"
                  stroke="rgba(79,70,229,0.15)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  className="at-preview__gauge-arc"
                  d="M 12 60 A 48 48 0 0 1 108 60"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="151"
                  strokeDashoffset="42"
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop stopColor="#4f46e5" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="at-preview__gauge-value">
                <strong>72%</strong>
                <span>utilized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="at-preview__card at-preview__card--table at-preview__anim" style={{ "--delay": "0.55s" } as CSSProperties}>
          <div className="at-preview__card-head">
            <h3>Recent Tasks</h3>
            <span>Assigned to team</span>
          </div>
          <div className="at-preview__table">
            <div className="at-preview__table-row at-preview__table-row--head">
              <span>Task</span>
              <span>Member</span>
              <span>Status</span>
            </div>
            {TASKS.map((task) => (
              <div key={task.name} className="at-preview__table-row">
                <span className="at-preview__task-name">{task.name}</span>
                <span>{task.assignee}</span>
                <span className={`at-preview__pill at-preview__pill--${task.tone}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

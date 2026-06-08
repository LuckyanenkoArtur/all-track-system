import { useEffect, useState, type CSSProperties } from "react";
import {
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import "./NotFoundVisual.scss";

export default function NotFoundVisual() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`nf-visual ${ready ? "nf-visual--ready" : ""}`}>
      <div className="nf-visual__map">
        <svg
          className="nf-visual__svg"
          viewBox="0 0 400 320"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nfRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[80, 160, 240, 320].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="40"
              x2={x}
              y2="280"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
          {[80, 160, 240].map((y) => (
            <line
              key={`h${y}`}
              x1="40"
              y1={y}
              x2="360"
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Tracked route — stops abruptly */}
          <path
            className="nf-visual__route"
            d="M 60 240 C 100 200, 140 180, 180 170 C 220 160, 260 130, 290 100"
            stroke="url(#nfRouteGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Waypoints */}
          <circle cx="60" cy="240" r="5" fill="rgba(255,255,255,0.5)" />
          <circle cx="180" cy="170" r="4" fill="rgba(255,255,255,0.7)" />

          {/* Lost signal */}
          <circle className="nf-visual__signal" cx="290" cy="100" r="28" />
          <circle className="nf-visual__signal nf-visual__signal--2" cx="290" cy="100" r="40" />
          <circle cx="290" cy="100" r="6" fill="#f87171" />
          <text x="290" y="148" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">
            Signal lost
          </text>
        </svg>

        <div className="nf-visual__pin nf-visual__anim" style={{ "--d": "0.3s" } as CSSProperties}>
          <FiMapPin />
          <span>404</span>
        </div>
      </div>

      <div className="nf-visual__cards">
        <div className="nf-visual__card nf-visual__anim" style={{ "--d": "0.45s" } as CSSProperties}>
          <div className="nf-visual__card-icon nf-visual__card-icon--time">
            <FiClock />
          </div>
          <div>
            <span className="nf-visual__card-label">Time</span>
            <strong>Untracked</strong>
          </div>
        </div>

        <div className="nf-visual__card nf-visual__anim" style={{ "--d": "0.55s" } as CSSProperties}>
          <div className="nf-visual__card-icon nf-visual__card-icon--task">
            <FiCheckSquare />
          </div>
          <div>
            <span className="nf-visual__card-label">Tasks</span>
            <strong>Not found</strong>
          </div>
        </div>

        <div className="nf-visual__card nf-visual__anim" style={{ "--d": "0.65s" } as CSSProperties}>
          <div className="nf-visual__card-icon nf-visual__card-icon--budget">
            <FiDollarSign />
          </div>
          <div>
            <span className="nf-visual__card-label">Budget</span>
            <strong>No route</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

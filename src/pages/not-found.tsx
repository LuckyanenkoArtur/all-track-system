import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";
import NotFoundVisual from "../components/not-found/NotFoundVisual";
import AllTrackLogoIcon from "../components/sidebar/AllTrackLogoIcon";
import "./not-found.scss";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const authed = isAuthenticated();

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 50);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`not-found ${mounted ? "not-found--ready" : ""}`}>
      <section className="not-found__content">
        <Link
          to={authed ? "/" : "/login"}
          className="not-found__brand"
          aria-label="AllTrack home"
        >
          <AllTrackLogoIcon className="not-found__brand-icon" />
          <span className="not-found__brand-text">
            <span className="not-found__brand-all">All</span>
            <span className="not-found__brand-track">Track</span>
          </span>
        </Link>

        <div className="not-found__body">
          <p className="not-found__code">
            <span className="not-found__digit">4</span>
            <span className="not-found__digit not-found__digit--mid">0</span>
            <span className="not-found__digit">4</span>
          </p>

          <h1 className="not-found__title">Route not tracked</h1>
          <p className="not-found__desc">
            The page you&apos;re looking for isn&apos;t on our map. It may have
            been moved, deleted, or the URL was mistyped — time, tasks, and
            budget all live elsewhere in AllTrack.
          </p>

          <div className="not-found__tags">
            <span className="not-found__tag">
              <span className="not-found__tag-dot not-found__tag-dot--time" />
              Time
            </span>
            <span className="not-found__tag">
              <span className="not-found__tag-dot not-found__tag-dot--task" />
              Tasks
            </span>
            <span className="not-found__tag">
              <span className="not-found__tag-dot not-found__tag-dot--budget" />
              Budget
            </span>
          </div>

          <div className="not-found__actions">
            <Link
              to={authed ? "/" : "/login"}
              className="not-found__btn not-found__btn--primary"
            >
              {authed ? "Back to Dashboard" : "Back to Login"}
            </Link>
            <button
              type="button"
              className="not-found__btn not-found__btn--ghost"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </section>

      <section className="not-found__visual" aria-hidden="true">
        <div className="not-found__visual-bg">
          <div className="not-found__orb not-found__orb--1" />
          <div className="not-found__orb not-found__orb--2" />
        </div>
        <NotFoundVisual />
      </section>
    </div>
  );
}

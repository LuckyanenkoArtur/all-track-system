import { useId } from "react";
import styles from "./icon.module.scss";

type AllTrackLogoIconProps = {
  className?: string;
};

export default function AllTrackLogoIcon({ className }: AllTrackLogoIconProps) {
  const gradId = useId();

  return (
    <svg
      className={className ? `${styles.logoIcon} ${className}` : styles.logoIcon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="6"
          y1="4"
          x2="26"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="9" fill={`url(#${gradId})`} />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {/* Subtle map grid */}
      <path
        d="M10 8v16M16 8v16M22 8v16M8 12h16M8 18h16"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="0.75"
      />

      {/* Route path */}
      <path
        d="M8 22 C10.5 18, 12.5 14, 16 15.5 C19.5 17, 22 11, 24 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Waypoints */}
      <circle cx="8" cy="22" r="2" fill="white" fillOpacity="0.45" />
      <circle cx="16" cy="15.5" r="1.6" fill="white" fillOpacity="0.85" />
      <circle cx="24" cy="9" r="2.2" fill="white" />

      {/* Live-tracking pulse ring */}
      <circle
        cx="24"
        cy="9"
        r="4.8"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />
      <circle cx="24" cy="9" r="1" fill="#4f46e5" />
    </svg>
  );
}

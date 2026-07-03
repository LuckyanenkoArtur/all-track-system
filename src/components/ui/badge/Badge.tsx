import type { PropsWithChildren } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "success" | "info" | "error" | "neutral" | "warning";

type BadgeProps = PropsWithChildren & {
  variant: BadgeVariant;
};

const Badge = ({ children, variant }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
  );
};

export default Badge;

Badge.Icon = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

Badge.Label = ({ children }: PropsWithChildren) => {
  return <span>{children}</span>;
};

import styles from "./text.module.scss";

type AllTrackLogoTextProps = {
  collapsed?: boolean;
};

const AllTrackLogoText = ({ collapsed = false }: AllTrackLogoTextProps) => {
  return (
    <span
      className={`${styles.logo} ${collapsed ? styles.collapsed : ""}`}
      aria-hidden={collapsed}
    >
      <span className={styles.logoAll}>All</span>
      <span className={styles.logoTrack}>Track</span>
    </span>
  );
};

export default AllTrackLogoText;

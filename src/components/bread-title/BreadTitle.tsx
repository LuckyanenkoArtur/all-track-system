import styles from "./BreadTitle.module.scss";

export type BreadTitleProps = {
  title: string;
};

export function BreadTitle({ title }: BreadTitleProps) {
  return (
    <div className={styles.pageHeading}>
      <h1>{title}</h1>
    </div>
  );
}

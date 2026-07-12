import type { FC, PropsWithChildren, ReactNode } from "react";

import styles from "./Section.module.scss";

type SectionTitleProps = PropsWithChildren<{
  icon?: ReactNode;
}>;

interface SectionComponent extends FC<PropsWithChildren> {
  Title: FC<SectionTitleProps>;
  Content: FC<PropsWithChildren>;
  Grid: FC<PropsWithChildren>;
  Column: FC<PropsWithChildren>;
  Row: FC<PropsWithChildren>;
}

export const Section: SectionComponent = ({ children }) => {
  return <section className={styles.section}>{children}</section>;
};

Section.Title = ({ children, icon }) => {
  return (
    <div className={styles.title}>
      {icon ? <span className={styles.titleIcon}>{icon}</span> : null}
      <span className={styles.titleText}>{children}</span>
    </div>
  );
};

Section.Content = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

Section.Grid = ({ children }) => {
  return <div className={styles.grid}>{children}</div>;
};

Section.Column = ({ children }) => {
  return <div className={styles.column}>{children}</div>;
};

Section.Row = ({ children }) => {
  return <div className={styles.row}>{children}</div>;
};

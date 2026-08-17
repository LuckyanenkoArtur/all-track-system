import type { FC, PropsWithChildren } from "react";

import styles from "./Panel.module.scss";

type PanelProps = PropsWithChildren<{
  className?: string;
}>;

interface PanelSectionComponent extends FC<PropsWithChildren> {
  Icon: FC<PropsWithChildren>;
  Title: FC<PropsWithChildren>;
  Content: FC<PropsWithChildren>;
}

interface PanelComponent extends FC<PanelProps> {
  Section: PanelSectionComponent;
}

const PanelSection: PanelSectionComponent = ({ children }) => {
  return <section className={styles.section}>{children}</section>;
};

PanelSection.Icon = ({ children }) => {
  return <span className={styles.sectionIcon}>{children}</span>;
};

PanelSection.Title = ({ children }) => {
  return <h3 className={styles.sectionTitle}>{children}</h3>;
};

PanelSection.Content = ({ children }) => {
  return <div className={styles.sectionContent}>{children}</div>;
};

export const Panel: PanelComponent = ({ className, children }) => {
  return (
    <section className={[styles.root, className].filter(Boolean).join(" ")}>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

Panel.Section = PanelSection;

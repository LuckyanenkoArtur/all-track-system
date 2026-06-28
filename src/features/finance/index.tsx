import { Outlet } from "react-router-dom";

import { BreadTitle } from "../../components/bread-title/BreadTitle";
import styles from "./finance.module.scss";

export function FinanceLayout() {
  return (
    <div className={styles.financePage}>
      <Outlet />
    </div>
  );
}

export function FinanceSection({ title }: { title: string }) {
  return (
    <div className={styles.sectionPage}>
      <BreadTitle title={title} />
      <p className={styles.pageHint}>In development...</p>
    </div>
  );
}

export { FinanceDashboard } from "./FinanceDashboard";

import {
  FiSearch,
  FiBell,
  FiSettings,
  FiPlus,
} from "react-icons/fi";
import styles from "./finance.module.scss";

export function FinanceDashboard() {
  return (
    <div className={styles.mainContent}>
      <header className={styles.header}>
        <div className={styles.searchBar}>
          <FiSearch color="var(--finance-text-muted)" />
          <input type="text" placeholder="Quick search..." />
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.iconBtn} aria-label="Notifications">
            <FiBell />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Settings">
            <FiSettings />
          </button>
          <div className={styles.profile}>
            <div className={styles.avatar} />
            <div className={styles.info}>
              <span>Michael Johnson</span>
              <small>m.johnson@finex.com</small>
            </div>
          </div>
          <button type="button" className={`${styles.iconBtn} ${styles.addWidget}`}>
            <FiPlus /> <span className={styles.addWidgetLabel}>Add widget</span>
          </button>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={`${styles.widget} ${styles.balanceOverview}`}>
          <span className={styles.metricSub}>Balance overview</span>
          <div className={styles.metricLarge}>$12,450</div>
          <div className={styles.chartPlaceholder}>
            [ Charting Library Canvas Placeholder (e.g., Recharts BarChart) ]
          </div>
        </div>

        <div className={`${styles.widget} ${styles.myCard}`}>
          <h3>My card</h3>
          <div className={styles.cardMockup}>
            <div className={styles.cardMockupTop}>
              <span>Debit card</span>
              <strong>VISA</strong>
            </div>
            <div className={styles.cardNumber}>**** **** **** 7890</div>
            <div className={styles.cardMockupBottom}>
              <span>Michael Johnson</span>
              <span>03/30</span>
            </div>
          </div>
          <div className={styles.cardActions}>
            {["Top up", "Send", "Request", "History", "More"].map((action) => (
              <div key={action} className={styles.cardAction}>
                <div className={styles.cardActionIcon} />
                <small>{action}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.widget} ${styles.spendingLimit}`}>
          <h3>Monthly spending limit</h3>
          <div className={styles.metricLarge}>
            $8,600 <span className={styles.metricMuted}>/ $10,000</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: "86%" }} />
          </div>
        </div>

        <div className={`${styles.widget} ${styles.budgetTips}`}>
          <h3>Optimize your budget</h3>
          <p className={styles.metricSub}>
            Start preparing for the 2025 tax season by saving 10-15% for
            deductions.
          </p>
        </div>

        <div className={`${styles.widget} ${styles.costAnalysis}`}>
          <span className={styles.metricSub}>Cost analysis</span>
          <div className={styles.metricLarge}>$8,450</div>
          <div className={styles.stackedBar}>
            <div style={{ flex: 1.8 }} className={styles.barAmber} />
            <div style={{ flex: 0.7 }} className={styles.barRed} />
            <div style={{ flex: 0.6 }} className={styles.barBlue} />
            <div style={{ flex: 3.3 }} className={styles.barGreen} />
          </div>
          <div className={styles.metricSub}>
            Housing 18% | Transportation 10% | Other 33%
          </div>
        </div>

        <div className={`${styles.widget} ${styles.financialHealth}`}>
          <h3>Financial health</h3>
          <div className={styles.metricLarge}>$15,780</div>
          <div className={styles.healthScore}>75%</div>
          <p className={`${styles.metricSub} ${styles.healthCaption}`}>
            Of monthly income saved
          </p>
        </div>

        <div className={`${styles.widget} ${styles.transactionHistory}`}>
          <div className={styles.widgetHeader}>
            <h3>Transaction history</h3>
            <span className={styles.metricSub}>7d v</span>
          </div>

          <div className={styles.txList}>
            {[
              {
                name: "Dividend payout",
                date: "25 Feb 2025",
                amt: "+$1,100",
                positive: true,
              },
              {
                name: "Corporate subscriptions",
                date: "24 Feb 2025",
                amt: "-$6,400",
                positive: false,
              },
              {
                name: "Investment in ETF",
                date: "21 Feb 2025",
                amt: "-$900",
                positive: false,
              },
            ].map((tx) => (
              <div key={tx.name} className={styles.txRow}>
                <div className={styles.txMain}>
                  <div className={styles.txIcon} />
                  <div>
                    <span className={styles.txName}>{tx.name}</span>
                    <span className={styles.txDate}>{tx.date}</span>
                  </div>
                </div>
                <strong
                  className={tx.positive ? styles.txPositive : styles.txNegative}
                >
                  {tx.amt}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

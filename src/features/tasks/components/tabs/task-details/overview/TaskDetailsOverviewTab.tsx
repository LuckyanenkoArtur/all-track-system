import type { ReactNode } from "react";

import {
  FiArrowRight,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiEye,
  FiFileText,
  FiFlag,
  FiLayers,
  FiPlay,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import type { Task } from "../../../../domain/others.ts";

import { formatDueDate } from "../../../../utils/dateUtils.ts";

import { formatBudget, formatDate } from "../../../../utils/taskListUtils.ts";

import styles from "./TaskDetailsOverviewTab.module.scss";

import { useTranslation } from "../../../../../../i18n/index.ts";

import Badge from "../../../../../../components/ui/badge/Badge.tsx";

import PriorityBadge from "../../../badges/PriorityBadge.tsx";

import StatusBadge from "../../../badges/StatusBadge.tsx";

import { TaskDetailsStepsTab } from "../steps/Tab.tsx";

type TaskDetailsOverviewTabProps = {
  task: Task;

  onToggleStep?: (stepId: string) => void;

  stepsReadOnly?: boolean;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TaskDetailsOverviewTab({
  task,
  onToggleStep,
  stepsReadOnly = false,
}: TaskDetailsOverviewTabProps) {
  const { t } = useTranslation();
  const details = t.tasks.details;

  return (
    <div className={styles.overview}>
      <header className={styles.taskHeader}>
        <div className={styles.taskHeading}>
          <span className={styles.taskId}>{task.id}</span>
          <span className={styles.taskHeadingDivider} aria-hidden />
          <h1 className={styles.taskTitle} title={task.title}>
            {task.title}
          </h1>
        </div>

        <div className={styles.headerMeta}>
          {task.requiresResultReview && (
            <>
              <span className={styles.reviewChip} role="status">
                <span className={styles.reviewChipIcon} aria-hidden>
                  <FiEye size={13} />
                </span>
                <span className={styles.reviewChipText}>
                  {details.requiresResultReview}
                </span>
              </span>

              <span className={styles.metaChipDivider} aria-hidden />
            </>
          )}

          <span className={styles.metaChip}>
            <span className={styles.metaChipIcon} aria-hidden>
              <FiUser size={13} />
            </span>
            <span className={styles.metaChipText}>{task.initiator}</span>
          </span>

          <span className={styles.metaChipDivider} aria-hidden />

          <span className={styles.metaChip}>
            <span className={styles.metaChipIcon} aria-hidden>
              <FiCalendar size={13} />
            </span>
            <time className={styles.metaChipText} dateTime={task.createdAt}>
              {formatDate(task.createdAt)}
            </time>
          </span>
        </div>
      </header>

      <div className={styles.body}>
        <main className={styles.mainColumn}>
          <Panel>
            <div className={styles.sectionsStack}>
              <PanelSection
                title="Status & Priority"
                icon={<FiFlag size={15} aria-hidden />}
              >
                <div className={styles.splitFields}>
                  <div className={styles.splitField}>
                    <span className={styles.splitFieldLabel}>
                      {t.tasks.priority}
                    </span>
                    <div className={styles.splitFieldValue}>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>

                  <SplitDivider icon={<FiFlag size={11} aria-hidden />} />

                  <div className={styles.splitField}>
                    <span className={styles.splitFieldLabel}>
                      {t.tasks.status}
                    </span>
                    <div className={styles.splitFieldValue}>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              </PanelSection>

              <PanelSection
                title={t.tasks.responsible}
                icon={<FiUser size={15} aria-hidden />}
              >
                {task.responsible.length > 0 ? (
                  <div className={styles.assigneeList}>
                    {task.responsible.map((person) => (
                      <span key={person} className={styles.assignee}>
                        <span className={styles.avatar}>
                          {getInitials(person)}
                        </span>
                        {person}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.emptyValue}>—</span>
                )}
              </PanelSection>

              <PanelSection
                title={t.tasks.observables}
                icon={<FiUsers size={15} aria-hidden />}
              >
                {task.observables.length > 0 ? (
                  <div className={styles.assigneeList}>
                    {task.observables.map((person) => (
                      <span key={person} className={styles.assignee}>
                        <span className={styles.avatar}>
                          {getInitials(person)}
                        </span>
                        {person}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.emptyValue}>—</span>
                )}
              </PanelSection>

              <PanelSection
                title="Timeline"
                icon={<FiClock size={15} aria-hidden />}
              >
                <div className={styles.splitFields}>
                  <div className={styles.splitField}>
                    <span className={styles.splitFieldLabel}>
                      {details.startDate}
                    </span>
                    <div className={styles.splitFieldValue}>
                      <Badge variant="neutral">
                        <Badge.Icon>
                          <FiPlay size={16} aria-hidden />
                        </Badge.Icon>
                        <Badge.Label>
                          {formatDueDate(task.startDate)}
                        </Badge.Label>
                      </Badge>
                    </div>
                  </div>

                  <SplitDivider icon={<FiArrowRight size={11} aria-hidden />} />

                  <div className={styles.splitField}>
                    <span className={styles.splitFieldLabel}>
                      {t.tasks.dueDate}
                    </span>
                    <div className={styles.splitFieldValue}>
                      <Badge variant="info">
                        <Badge.Icon>
                          <FiCalendar size={16} aria-hidden />
                        </Badge.Icon>
                        <Badge.Label>{formatDueDate(task.dueDate)}</Badge.Label>
                      </Badge>
                    </div>
                  </div>
                </div>
              </PanelSection>
              <PanelSection
                title="Financials"
                icon={<FiDollarSign size={15} aria-hidden />}
              >
                <div className={styles.timelineBudget}>
                  <div className={styles.timelineField}>
                    <span className={styles.timelineFieldLabel}>
                      {t.tasks.budget}
                    </span>
                    <Badge variant="success">
                      <Badge.Icon>
                        <FiDollarSign size={16} aria-hidden />
                      </Badge.Icon>
                      <Badge.Label>{formatBudget(task.budget)}</Badge.Label>
                    </Badge>
                  </div>
                </div>
              </PanelSection>

              {task.groups.length > 0 && (
                <PanelSection
                  title={t.tasks.groups}
                  icon={<FiLayers size={15} aria-hidden />}
                >
                  <div className={styles.tagList}>
                    {task.groups.map((group) => (
                      <span key={group} className={styles.tag}>
                        {group}
                      </span>
                    ))}
                  </div>
                </PanelSection>
              )}
            </div>
          </Panel>
        </main>

        <aside className={styles.sidebar}>
          <Panel>
            <div className={styles.descriptionSteps}>
              <h3 className={styles.descriptionStepsTitle}>
                <FiFileText size={15} aria-hidden />
                {details.description}
              </h3>

              {task.description?.trim() ? (
                <p className={styles.descriptionText}>{task.description}</p>
              ) : (
                <p className={styles.descriptionPlaceholder}>
                  {details.descriptionEmpty}
                </p>
              )}
            </div>

            <div className={styles.descriptionSteps}>
              <h3 className={styles.descriptionStepsTitle}>
                <FiCheckSquare size={15} aria-hidden />
                {details.tabs.steps}
              </h3>

              <TaskDetailsStepsTab
                steps={task.steps ?? []}
                onToggleStep={onToggleStep}
                readOnly={stepsReadOnly}
                embedded
              />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      {title ? (
        <h2 className={styles.panelTitle}>
          {icon}
          {title}
        </h2>
      ) : null}
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

function PanelSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.panelSection}>
      <h3 className={styles.panelSectionTitle}>
        {icon}
        {title}
      </h3>
      <div className={styles.panelSectionBody}>{children}</div>
    </section>
  );
}

function SplitDivider({ icon }: { icon?: ReactNode }) {
  return (
    <div className={styles.splitDivider} aria-hidden>
      {icon}
    </div>
  );
}

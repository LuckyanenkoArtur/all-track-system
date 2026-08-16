import type { ReactNode } from "react";

import {
  FiArrowRight,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiFlag,
  FiLayers,
  FiPlay,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import type { Task } from "../../../../domain/others.ts";

import { formatDueDate } from "../../../../utils/dateUtils.ts";

import { formatBudget } from "../../../../utils/taskListUtils.ts";

import styles from "./TaskDetailsOverviewTab.module.scss";

import { useTranslation } from "../../../../../../i18n/index.ts";

import Badge from "../../../../../../components/ui/badge/Badge.tsx";

import { Title } from "../../../../../../components/ui/title/Title.tsx";

import AuthorBadge from "../../../badges/AuthorBadge.tsx";

import DateTimeBadge from "../../../badges/DateTimeBadge.tsx";

import PriorityBadge from "../../../badges/PriorityBadge.tsx";

import RequiresResultReviewBadge from "../../../badges/RequiresResultReviewBadge.tsx";

import StatusBadge from "../../../badges/StatusBadge.tsx";

import type { CheckListStep } from "../../../../../../components/ui/step-check-list/step";

import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";

import ProgressBar from "../../../../../../components/ui/progress-bar/ProgressBar.tsx";

import StepCheckList from "../../../../../../components/ui/step-check-list/StepCheckList.tsx";

import { Initials } from "../../utils/Initials.ts";

type TaskDetailsOverviewTabProps = {
  task: Task; //! This should be done using the TaskService for getting the task details
  onToggleStep?: (stepId: string) => void;
  stepsReadOnly?: boolean;
};

export function TaskDetailsOverviewTab({
  task,
  onToggleStep,
  stepsReadOnly = false,
}: TaskDetailsOverviewTabProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.overview}>
      <div className={styles.taskHeader}>
        <div className={styles.taskHeading}>
          <Badge variant="info" className={styles.taskId}>
            {task.id}
          </Badge>
          <span className={styles.taskHeadingDivider} aria-hidden />
          <div className={styles.taskTitle} title={task.title}>
            <Title text={task.title} />
          </div>
        </div>

        <div className={styles.headerMeta}>
          <RequiresResultReviewBadge
            requiresResultReview={task.requiresResultReview}
          />
          <AuthorBadge text={task.initiator} />
          <DateTimeBadge time={task.createdAt} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.mainColumn}>
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
                          {new Initials(person).get()}
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
                          {new Initials(person).get()}
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
                      {t.tasks.details.startDate}
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
        </div>

        <div className={styles.sidebar}>
          <Panel>
            <div className={styles.descriptionSteps}>
              <h3 className={styles.descriptionStepsTitle}>
                <FiFileText size={15} aria-hidden />
                {t.tasks.details.description}
              </h3>

              {task.description?.trim() ? (
                <p className={styles.descriptionText}>{task.description}</p>
              ) : (
                <p className={styles.descriptionPlaceholder}>
                  {t.tasks.details.descriptionEmpty}
                </p>
              )}
            </div>

            <div className={styles.descriptionSteps}>
              <h3 className={styles.descriptionStepsTitle}>
                <FiCheckSquare size={15} aria-hidden />
                {t.tasks.details.tabs.steps}
              </h3>

              <TaskDetailsStepsTab
                steps={task.steps ?? []}
                onToggleStep={onToggleStep}
                readOnly={stepsReadOnly}
                embedded
              />
            </div>
          </Panel>
        </div>
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

type TaskDetailsStepsTabProps = {
  steps: CheckListStep[];
  onToggleStep?: (stepId: string) => void;
  readOnly?: boolean;
  embedded?: boolean;
};

function TaskDetailsStepsTab({
  steps,
  onToggleStep,
  readOnly = false,
  embedded = false,
}: TaskDetailsStepsTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details.tabs;

  const completed = steps.filter((step) => step.completed).length;
  const total = steps.length;

  if (steps.length === 0) {
    if (embedded) {
      return <p className={styles.empty}>{labels.stepsEmpty}</p>;
    }

    return (
      <TaskDetailsTabPlaceholder
        icon={<FiCheckSquare size={22} aria-hidden />}
        title={labels.steps}
        message={labels.stepsEmpty}
      />
    );
  }

  return (
    <div className={[styles.root, !embedded && styles.card].filter(Boolean).join(" ")}>
      <ProgressBar completed={completed} total={total}>
        <ProgressBar.Header text={labels.stepsProgress} />
        <ProgressBar.Body />
      </ProgressBar>

      <StepCheckList onToggleStep={onToggleStep}>
        {steps.map((step, index) => (
          <StepCheckList.Item key={step.id} step={step} index={index} />
        ))}
      </StepCheckList>

      {readOnly && (
        <p className={styles.readOnlyHint}>{labels.stepsReadOnlyResponsible}</p>
      )}
    </div>
  );
}

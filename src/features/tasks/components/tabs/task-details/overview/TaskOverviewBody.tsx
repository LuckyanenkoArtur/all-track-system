import {
  FiArrowRight,
  FiCheckCircle,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiFlag,
  FiLayers,
  FiPlayCircle,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import type {
  Task,
  TaskPriorityId,
  TaskStatus,
} from "../../../../domain/others.ts";
import styles from "./TaskOverviewBody.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";
import Badge from "../../../../../../components/ui/badge/Badge.tsx";
import { Button } from "../../../../../../components/ui/button/Button.tsx";
import buttonStyles from "../../../../../../components/ui/button/Button.module.scss";
import Divider from "../../../../../../components/ui/divider/Divider.tsx";
import { Panel } from "../../../../../../components/ui/info-panel/Panel.tsx";
import ProgressBar from "../../../../../../components/ui/progress-bar/ProgressBar.tsx";
import StepCheckList from "../../../../../../components/ui/step-check-list/StepCheckList.tsx";

import { BudgetCard } from "../../../cards/BudgetCard.tsx";
import { DueDateCard } from "../../../cards/DueDateCard.tsx";
import { PriorityCard } from "../../../cards/PriorityCard.tsx";
import { StartDateCard } from "../../../cards/StartDateCard.tsx";
import { StatusCard } from "../../../cards/StatusCard.tsx";
import { TaskTrackingBar } from "../../../tracking/TaskTrackingBar.tsx";

import { Initials } from "../../utils/Initials.ts";
import { isTerminalTaskStatus } from "../../../../utils/taskStatusUtils.ts";

export type TaskOverviewBodyProps = {
  task: Task;
  onToggleStep?: (stepId: string) => void;
  stepsReadOnly?: boolean;
  onStatusChange?: (status: TaskStatus) => void;
  onPriorityChange?: (priority: TaskPriorityId) => void;
  isTracking?: boolean;
  sessionTimer?: string;
  onToggleTracking?: () => void;
  onEditTask?: () => void;
  onCompleteTask?: () => void;
};

export function TaskOverviewBody({
  task,
  onToggleStep,
  stepsReadOnly = false,
  onStatusChange,
  onPriorityChange,
  isTracking,
  sessionTimer,
  onToggleTracking,
  onEditTask,
  onCompleteTask,
}: TaskOverviewBodyProps) {
  const { t } = useTranslation();
  const closed = isTerminalTaskStatus(task.status);
  const steps = task.steps ?? [];
  const completedSteps = steps.filter((step) => step.completed).length;
  const stepsLocked = closed || stepsReadOnly;
  const showComplete = Boolean(onCompleteTask) && !closed;
  const showTaskActions = showComplete || Boolean(onEditTask);

  return (
    <div className={styles.body}>
      <Panel className={styles.mainColumn}>
        <Panel.Section>
          <Panel.Section.Icon>
            <FiFlag size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>Status & Priority</Panel.Section.Title>
          <Panel.Section.Content>
            <div className={styles.splitFields}>
              <PriorityCard
                title={t.tasks.priority}
                priority={task.priority}
                onPriorityChange={onPriorityChange}
              />
              <Divider icon={<FiFlag size={11} aria-hidden />} />
              <StatusCard
                title={t.tasks.status}
                status={task.status}
                onStatusChange={onStatusChange}
              />
            </div>
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiUser size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>{t.tasks.responsible}</Panel.Section.Title>
          <Panel.Section.Content>
            {task.responsible.length > 0 ? (
              <div className={styles.assigneeList}>
                {task.responsible.map((person) => (
                  <Badge key={person} variant="info">
                    <Badge.Icon>{new Initials(person).get()}</Badge.Icon>
                    <Badge.Label>{person}</Badge.Label>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className={styles.emptyValue}>—</span>
            )}
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiUsers size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>{t.tasks.observables}</Panel.Section.Title>
          <Panel.Section.Content>
            {task.observables.length > 0 ? (
              <div className={styles.assigneeList}>
                {task.observables.map((person) => (
                  <Badge key={person} variant="info">
                    <Badge.Icon>{new Initials(person).get()}</Badge.Icon>
                    <Badge.Label>{person}</Badge.Label>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className={styles.emptyValue}>—</span>
            )}
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiClock size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>Timeline</Panel.Section.Title>
          <Panel.Section.Content>
            <div className={styles.splitFields}>
              <StartDateCard
                title={t.tasks.details.startDate}
                startDate={task.startDate}
              />
              <Divider icon={<FiArrowRight size={11} aria-hidden />} />
              <DueDateCard title={t.tasks.dueDate} dueDate={task.dueDate} />
            </div>
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiDollarSign size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>Financials</Panel.Section.Title>
          <Panel.Section.Content>
            <BudgetCard title={t.tasks.budget} budget={task.budget} />
          </Panel.Section.Content>
        </Panel.Section>

        {task.groups.length > 0 && (
          <Panel.Section>
            <Panel.Section.Icon>
              <FiLayers size={15} aria-hidden />
            </Panel.Section.Icon>
            <Panel.Section.Title>{t.tasks.groups}</Panel.Section.Title>
            <Panel.Section.Content>
              <div className={styles.groupList}>
                {task.groups.map((group) => (
                  <Badge
                    key={group}
                    variant="info"
                    className={styles.groupBadge}
                  >
                    <Badge.Icon>
                      <FiLayers size={16} aria-hidden />
                    </Badge.Icon>
                    <Badge.Label>{group}</Badge.Label>
                  </Badge>
                ))}
              </div>
            </Panel.Section.Content>
          </Panel.Section>
        )}
      </Panel>

      <Panel className={styles.sidebar}>
        <Panel.Section>
          <Panel.Section.Icon>
            <FiFileText size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>
            {t.tasks.details.description}
          </Panel.Section.Title>
          <Panel.Section.Content>
            {task.description?.trim() ? (
              <div className={styles.descriptionText}>{task.description}</div>
            ) : (
              <div className={styles.descriptionPlaceholder}>
                {t.tasks.details.descriptionEmpty}
              </div>
            )}
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiCheckSquare size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>
            {t.tasks.details.tabs.steps}
          </Panel.Section.Title>
          <Panel.Section.Content>
            {steps.length === 0 ? (
              <p className={styles.empty}>{t.tasks.details.tabs.stepsEmpty}</p>
            ) : (
              <div className={styles.root}>
                <ProgressBar completed={completedSteps} total={steps.length}>
                  <ProgressBar.Header
                    text={t.tasks.details.tabs.stepsProgress}
                  />
                  <ProgressBar.Body />
                </ProgressBar>
                <StepCheckList
                  onToggleStep={stepsLocked ? undefined : onToggleStep}
                >
                  {steps.map((step, index) => (
                    <StepCheckList.Item
                      key={step.id}
                      step={{ ...step, completed: Boolean(step.completed) }}
                      index={index}
                    />
                  ))}
                </StepCheckList>
                {stepsReadOnly && !closed && (
                  <p className={styles.readOnlyHint}>
                    {t.tasks.details.tabs.stepsReadOnlyResponsible}
                  </p>
                )}
              </div>
            )}
          </Panel.Section.Content>
        </Panel.Section>

        <Panel.Section>
          <Panel.Section.Icon>
            <FiPlayCircle size={15} aria-hidden />
          </Panel.Section.Icon>
          <Panel.Section.Title>
            {t.tasks.details.overviewActions}
          </Panel.Section.Title>
          <Panel.Section.Content>
            <div className={styles.actionsStack}>
              <TaskTrackingBar
                task={task}
                isTracking={isTracking}
                sessionTimer={sessionTimer}
                onToggleTracking={onToggleTracking}
                className={styles.trackingBarFull}
              />
              {showTaskActions && (
                <div className={styles.actionButtons}>
                  {showComplete && onCompleteTask && (
                    <Button
                      onClick={onCompleteTask}
                      className={styles.actionBtn}
                    >
                      <Button.Icon>
                        <FiCheckCircle size={15} />
                      </Button.Icon>
                      <Button.Text>{t.tasks.details.completeTask}</Button.Text>
                    </Button>
                  )}
                  {onEditTask && (
                    <Button
                      onClick={onEditTask}
                      className={`${buttonStyles.secondary} ${styles.actionBtn}`}
                    >
                      <Button.Icon>
                        <FiEdit2 size={15} />
                      </Button.Icon>
                      <Button.Text>{t.tasks.details.editTask}</Button.Text>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Panel.Section.Content>
        </Panel.Section>
      </Panel>
    </div>
  );
}

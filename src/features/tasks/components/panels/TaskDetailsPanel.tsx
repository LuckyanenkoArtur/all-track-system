import { useTranslation } from "../../../../i18n/index.ts";
import type { Task } from "../../domain/others.ts";
import TaskDetailsTabulator from "../tabulator/details/Tabulator.tsx";
import { Panel } from "../../../../components/ui/panel/Panel.tsx";

type TaskDetailsPanelProps = {
  task: Task | null;
};

export function TaskDetailsPanel({ task }: TaskDetailsPanelProps) {
  const { t } = useTranslation();
  const open = task !== null;
  const expandUrl = task ? `/app/tasks/${task.id}` : undefined;

  return (
    <Panel open={open} expander={expandUrl}>
      <Panel.Header>
        <Panel.Title>{t.tasks.details.panelTitle}</Panel.Title>
        <Panel.Desciption>{t.tasks.details.panelSubtitle}</Panel.Desciption>
      </Panel.Header>
      <Panel.Content>
        <TaskDetailsTabulator task={task} />
      </Panel.Content>
    </Panel>
  );
}

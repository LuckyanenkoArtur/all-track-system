import type { Task, TaskStatus } from "../types";
import { formatBudget, parseBudget, parseTimeMinutes } from "./taskListUtils";

export type DeadlineTone = "ok" | "warning" | "critical" | "overdue";

export interface DeadlineInfo {
  tone: DeadlineTone;
  label: string;
  isTimeUp: boolean;
  msLeft: number;
}

export type BudgetTone = "ok" | "warning" | "critical";

export interface BudgetInfo {
  total: number;
  spent: number;
  remaining: number;
  spentPercent: number;
  remainingPercent: number;
  remainingTone: BudgetTone;
  spentTone: BudgetTone;
}

export function formatCurrency(amount: number): string {
  return formatBudget(amount);
}

export function getTaskBudgetSpent(task: Task): number {
  if (task.budgetSpent) {
    return parseBudget(task.budgetSpent);
  }

  const budgetTotal = parseBudget(task.budget);
  if (budgetTotal <= 0) return 0;

  const hoursSpent = parseTimeMinutes(task.timeSpent) / 60;
  const estimatedSpend = Math.round(hoursSpent * 75);
  return Math.min(budgetTotal, estimatedSpend);
}

export function getDeadlineInfo(dueDate: string, status: TaskStatus): DeadlineInfo {
  const msLeft = new Date(dueDate).getTime() - Date.now();

  if (status === "done") {
    return {
      tone: "ok",
      label: "Completed on time",
      isTimeUp: false,
      msLeft,
    };
  }

  if (msLeft <= 0) {
    return {
      tone: "overdue",
      label: "TIME IS UP",
      isTimeUp: true,
      msLeft,
    };
  }

  const hoursLeft = msLeft / (1000 * 60 * 60);
  const daysLeft = msLeft / (1000 * 60 * 60 * 24);

  let label: string;
  if (daysLeft >= 1) {
    const days = Math.ceil(daysLeft);
    label = `${days} day${days === 1 ? "" : "s"} left`;
  } else {
    const hours = Math.ceil(hoursLeft);
    label = `${hours} hour${hours === 1 ? "" : "s"} left`;
  }

  if (hoursLeft <= 24) {
    return { tone: "critical", label, isTimeUp: false, msLeft };
  }

  if (daysLeft <= 3) {
    return { tone: "warning", label, isTimeUp: false, msLeft };
  }

  return { tone: "ok", label, isTimeUp: false, msLeft };
}

export function getBudgetInfo(task: Task): BudgetInfo {
  const total = parseBudget(task.budget);
  const spent = getTaskBudgetSpent(task);
  const remaining = Math.max(0, total - spent);
  const spentPercent = total > 0 ? Math.min(100, (spent / total) * 100) : 0;
  const remainingPercent = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;

  let remainingTone: BudgetTone = "ok";
  if (spent > total || remainingPercent <= 10) {
    remainingTone = "critical";
  } else if (remainingPercent <= 30) {
    remainingTone = "warning";
  }

  let spentTone: BudgetTone = "ok";
  if (spentPercent >= 90) {
    spentTone = "critical";
  } else if (spentPercent >= 70) {
    spentTone = "warning";
  }

  return {
    total,
    spent,
    remaining,
    spentPercent,
    remainingPercent,
    remainingTone,
    spentTone,
  };
}

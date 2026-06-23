import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_TASKS } from "../data/mockTasks";
import { MOCK_TASK_COMMENTS } from "../data/mockTaskComments";
import type {
  AddBudgetExpenseInput,
  AddManualTimeInput,
  AddTaskCommentInput,
  BudgetTransaction,
  CompleteTaskReportInput,
  CreateTaskInput,
  Task,
  TaskComment,
  TaskHistoryEntry,
  TaskStatus,
  TaskStep,
  UpdateTaskInput,
} from "../domain/types";
import {
  addElapsedToTimeSpent,
  formatTimeSpent,
} from "../utils/timeTrackingUtils";
import { parseTimeMinutes } from "../utils/taskListUtils";

const STORAGE_KEY = "alltrack-tasks";
const COMMENTS_STORAGE_KEY = "alltrack-task-comments";
const HISTORY_STORAGE_KEY = "alltrack-task-history";
const TRACKING_STORAGE_KEY = "alltrack-task-tracking";
const BUDGET_TRANSACTIONS_STORAGE_KEY = "alltrack-task-budget-transactions";

export interface TaskTracking {
  taskId: string;
  startedAt: number;
}

interface TasksContextValue {
  tasks: Task[];
  tracking: TaskTracking | null;
  budgetTransactions: BudgetTransaction[];
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  updateTaskSteps: (id: string, steps: TaskStep[]) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  startTracking: (taskId: string) => void;
  stopTracking: () => void;
  toggleTracking: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  completeTaskWithReport: (input: CompleteTaskReportInput) => void;
  addManualTime: (input: AddManualTimeInput) => void;
  addBudgetExpense: (input: AddBudgetExpenseInput) => void;
  getBudgetTransactions: (taskId: string) => BudgetTransaction[];
  isTracking: (taskId: string) => boolean;
  getTrackingElapsedMs: () => number;
  getTaskComments: (taskId: string) => TaskComment[];
  getTaskHistory: (taskId: string) => TaskHistoryEntry[];
  addTaskComment: (input: AddTaskCommentInput) => TaskComment;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export { TasksContext };

function normalizeTask(task: Task): Task {
  return {
    ...task,
    observables: task.observables ?? [],
    startDate: task.startDate ?? task.createdAt,
    steps: task.steps ?? [],
    attachments: task.attachments ?? [],
    requiresResultReview: task.requiresResultReview ?? false,
  };
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Task[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeTask);
      }
    }
  } catch {
    /* use seed data */
  }
  return MOCK_TASKS.map(normalizeTask);
}

function loadTracking(): TaskTracking | null {
  try {
    const stored = localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as TaskTracking;
    if (parsed?.taskId && parsed?.startedAt) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function loadComments(): TaskComment[] {
  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TaskComment[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    /* use seed data */
  }
  return MOCK_TASK_COMMENTS;
}

function persistComments(comments: TaskComment[]) {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}

function loadHistory(): TaskHistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TaskHistoryEntry[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    /* use empty history */
  }
  return [];
}

function persistHistory(history: TaskHistoryEntry[]) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function loadBudgetTransactions(): BudgetTransaction[] {
  try {
    const stored = localStorage.getItem(BUDGET_TRANSACTIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BudgetTransaction[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    /* use empty list */
  }
  return [];
}

function persistBudgetTransactions(transactions: BudgetTransaction[]) {
  localStorage.setItem(
    BUDGET_TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions),
  );
}

function persistTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function persistTracking(tracking: TaskTracking | null) {
  if (tracking) {
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));
  } else {
    localStorage.removeItem(TRACKING_STORAGE_KEY);
  }
}

function createTaskId(tasks: Task[]) {
  const maxId = tasks.reduce((max, task) => {
    const numeric = Number(task.id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `TSK-${String(maxId + 1).padStart(3, "0")}`;
}

function createCommentId(comments: TaskComment[]) {
  const maxId = comments.reduce((max, comment) => {
    const numeric = Number(comment.id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `CMT-${String(maxId + 1).padStart(3, "0")}`;
}

function createHistoryId(history: TaskHistoryEntry[]) {
  const maxId = history.reduce((max, entry) => {
    const numeric = Number(entry.id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `HIS-${String(maxId + 1).padStart(3, "0")}`;
}

function createBudgetTransactionId(transactions: BudgetTransaction[]) {
  const maxId = transactions.reduce((max, entry) => {
    const numeric = Number(entry.id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `BTX-${String(maxId + 1).padStart(3, "0")}`;
}

function createAttachmentId() {
  return `ATT-${crypto.randomUUID().slice(0, 8)}`;
}

function applyTrackingElapsed(tasks: Task[], tracking: TaskTracking): Task[] {
  const elapsedMs = Date.now() - tracking.startedAt;
  return tasks.map((task) =>
    task.id === tracking.taskId
      ? { ...task, timeSpent: addElapsedToTimeSpent(task.timeSpent, elapsedMs) }
      : task,
  );
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [comments, setComments] = useState<TaskComment[]>(loadComments);
  const [history, setHistory] = useState<TaskHistoryEntry[]>(loadHistory);
  const [budgetTransactions, setBudgetTransactions] = useState<
    BudgetTransaction[]
  >(loadBudgetTransactions);
  const [tracking, setTracking] = useState<TaskTracking | null>(() => {
    const saved = loadTracking();
    if (!saved) return null;
    const taskExists = loadTasks().some((task) => task.id === saved.taskId);
    return taskExists ? saved : null;
  });

  const flushTracking = useCallback((currentTracking: TaskTracking | null) => {
    if (!currentTracking) return;

    setTasks((prev) => {
      const next = applyTrackingElapsed(prev, currentTracking);
      persistTasks(next);
      return next;
    });
    setTracking(null);
    persistTracking(null);
  }, []);

  const startTracking = useCallback(
    (taskId: string) => {
      if (tracking?.taskId === taskId) return;

      setTasks((prev) => {
        let next = prev;

        if (tracking) {
          next = applyTrackingElapsed(next, tracking);
        }

        next = next.map((task) => {
          if (task.id !== taskId) return task;
          if (task.status === "pending") {
            return { ...task, status: "inProgress" as TaskStatus };
          }
          return task;
        });

        persistTasks(next);
        return next;
      });

      const nextTracking = { taskId, startedAt: Date.now() };
      setTracking(nextTracking);
      persistTracking(nextTracking);
    },
    [tracking],
  );

  const stopTracking = useCallback(() => {
    if (!tracking) return;
    flushTracking(tracking);
  }, [flushTracking, tracking]);

  const toggleTracking = useCallback(
    (taskId: string) => {
      if (tracking?.taskId === taskId) {
        stopTracking();
        return;
      }
      startTracking(taskId);
    },
    [startTracking, stopTracking, tracking],
  );

  const completeTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        let next = prev;

        if (tracking?.taskId === taskId) {
          next = applyTrackingElapsed(next, tracking);
        }

        next = next.map((task) =>
          task.id === taskId ? { ...task, status: "done" as TaskStatus } : task,
        );
        persistTasks(next);
        return next;
      });

      if (tracking?.taskId === taskId) {
        setTracking(null);
        persistTracking(null);
      }
    },
    [tracking],
  );

  const completeTaskWithReport = useCallback(
    (input: CompleteTaskReportInput) => {
      const description = input.description.trim();
      const steps = input.steps
        .map((step) => ({ ...step, text: step.text.trim() }))
        .filter((step) => step.text.length > 0);
      const now = new Date().toISOString();

      setTasks((prev) => {
        let next = prev;

        if (tracking?.taskId === input.taskId) {
          next = applyTrackingElapsed(next, tracking);
        }

        next = next.map((task) =>
          task.id === input.taskId
            ? { ...task, status: "done" as TaskStatus }
            : task,
        );
        persistTasks(next);
        return next;
      });

      if (tracking?.taskId === input.taskId) {
        setTracking(null);
        persistTracking(null);
      }

      setComments((prev) => {
        const createdComment: TaskComment = {
          id: createCommentId(prev),
          taskId: input.taskId,
          author: input.author,
          authorInitials: input.authorInitials,
          body: description,
          createdAt: now,
          attachments: [],
          kind: "completion",
          completionSteps: steps.length > 0 ? steps : undefined,
        };

        const next = [...prev, createdComment];
        persistComments(next);
        return next;
      });

      setHistory((prev) => {
        const entry: TaskHistoryEntry = {
          id: createHistoryId(prev),
          taskId: input.taskId,
          type: "task_completed",
          author: input.author,
          authorInitials: input.authorInitials,
          description,
          steps,
          createdAt: now,
        };

        const next = [...prev, entry];
        persistHistory(next);
        return next;
      });
    },
    [tracking],
  );

  const addTask = useCallback((input: CreateTaskInput) => {
    let createdTask: Task | null = null;
    const now = new Date().toISOString();

    setTasks((prev) => {
      createdTask = {
        id: createTaskId(prev),
        title: input.title.trim(),
        status: "pending",
        priority: input.priority,
        groups: input.groups.filter(Boolean),
        observables: input.observables.filter(Boolean),
        createdAt: now,
        startDate: input.startDate
          ? new Date(input.startDate).toISOString()
          : now,
        dueDate: new Date(input.dueDate).toISOString(),
        initiator: input.initiator.trim(),
        responsible: input.responsible.filter(Boolean),
        budget: input.budget.trim() || "$0",
        timeSpent: "0h 00m",
        description: input.description?.trim() || undefined,
        steps: input.steps ?? [],
        attachments: (input.attachments ?? []).map((attachment) => ({
          name: attachment.name,
          size: attachment.size,
          mimeType: attachment.mimeType,
          dataUrl: attachment.dataUrl,
          id: attachment.id?.startsWith("ATT-")
            ? attachment.id
            : createAttachmentId(),
        })),
        requiresResultReview: input.requiresResultReview,
      };

      const next = [createdTask, ...prev];
      persistTasks(next);
      return next;
    });

    return createdTask!;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: input.title.trim(),
              priority: input.priority,
              groups: input.groups.filter(Boolean),
              observables: input.observables.filter(Boolean),
              startDate: input.startDate
                ? new Date(input.startDate).toISOString()
                : task.startDate,
              dueDate: new Date(input.dueDate).toISOString(),
              initiator: input.initiator.trim(),
              responsible: input.responsible.filter(Boolean),
              budget: input.budget.trim() || "$0",
              description: input.description?.trim() || undefined,
              steps: input.steps ?? task.steps ?? [],
              attachments: input.attachments
                ? input.attachments.map((attachment) => ({
                    name: attachment.name,
                    size: attachment.size,
                    mimeType: attachment.mimeType,
                    dataUrl: attachment.dataUrl,
                    id: attachment.id?.startsWith("ATT-")
                      ? attachment.id
                      : createAttachmentId(),
                  }))
                : (task.attachments ?? []),
              requiresResultReview: input.requiresResultReview,
            }
          : task,
      );
      persistTasks(next);
      return next;
    });
  }, []);

  const updateTaskSteps = useCallback((id: string, steps: TaskStep[]) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === id ? { ...task, steps } : task,
      );
      persistTasks(next);
      return next;
    });
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === id ? { ...task, status } : task,
      );
      persistTasks(next);
      return next;
    });
  }, []);

  const isTracking = useCallback(
    (taskId: string) => tracking?.taskId === taskId,
    [tracking],
  );

  const getTrackingElapsedMs = useCallback(() => {
    if (!tracking) return 0;
    return Date.now() - tracking.startedAt;
  }, [tracking]);

  const getTaskComments = useCallback(
    (taskId: string) =>
      comments
        .filter((comment) => comment.taskId === taskId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [comments],
  );

  const addTaskComment = useCallback((input: AddTaskCommentInput) => {
    let createdComment: TaskComment | null = null;

    setComments((prev) => {
      createdComment = {
        id: createCommentId(prev),
        taskId: input.taskId,
        author: input.author,
        authorInitials: input.authorInitials,
        body: input.body,
        createdAt: new Date().toISOString(),
        attachments: input.attachments.map((attachment) => ({
          ...attachment,
          id: createAttachmentId(),
        })),
        kind: input.kind ?? "default",
        completionSteps: input.completionSteps,
      };

      const next = [...prev, createdComment];
      persistComments(next);
      return next;
    });

    return createdComment!;
  }, []);

  const getTaskHistory = useCallback(
    (taskId: string) =>
      history
        .filter((entry) => entry.taskId === taskId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [history],
  );

  const getBudgetTransactions = useCallback(
    (taskId: string) =>
      budgetTransactions
        .filter((entry) => entry.taskId === taskId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [budgetTransactions],
  );

  const addManualTime = useCallback((input: AddManualTimeInput) => {
    const totalMinutes =
      Math.max(0, input.hours) * 60 + Math.max(0, input.minutes);
    if (totalMinutes <= 0) return;

    const note = input.note?.trim() ?? "";
    const now = new Date().toISOString();

    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === input.taskId
          ? {
              ...task,
              timeSpent: formatTimeSpent(
                parseTimeMinutes(task.timeSpent) + totalMinutes,
              ),
            }
          : task,
      );
      persistTasks(next);
      return next;
    });

    setHistory((prev) => {
      const entry: TaskHistoryEntry = {
        id: createHistoryId(prev),
        taskId: input.taskId,
        type: "manual_time_added",
        author: input.author,
        authorInitials: input.authorInitials,
        description: note || `Added ${totalMinutes} minutes manually`,
        steps: [],
        createdAt: now,
        minutesAdded: totalMinutes,
      };

      const next = [...prev, entry];
      persistHistory(next);
      return next;
    });
  }, []);

  const addBudgetExpense = useCallback((input: AddBudgetExpenseInput) => {
    const amount = Math.max(0, input.amount);
    const description = input.description.trim();
    if (amount <= 0 || !description) return;

    const now = new Date().toISOString();

    setBudgetTransactions((prev) => {
      const created: BudgetTransaction = {
        id: createBudgetTransactionId(prev),
        taskId: input.taskId,
        amount,
        description,
        createdAt: now,
        author: input.author,
      };

      const next = [...prev, created];
      persistBudgetTransactions(next);
      return next;
    });

    setHistory((prev) => {
      const entry: TaskHistoryEntry = {
        id: createHistoryId(prev),
        taskId: input.taskId,
        type: "budget_expense_added",
        author: input.author,
        authorInitials: input.authorInitials,
        description,
        steps: [],
        createdAt: now,
        amount,
      };

      const next = [...prev, entry];
      persistHistory(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      tracking,
      budgetTransactions,
      addTask,
      updateTask,
      updateTaskSteps,
      updateTaskStatus,
      startTracking,
      stopTracking,
      toggleTracking,
      completeTask,
      completeTaskWithReport,
      addManualTime,
      addBudgetExpense,
      getBudgetTransactions,
      isTracking,
      getTrackingElapsedMs,
      getTaskComments,
      getTaskHistory,
      addTaskComment,
    }),
    [
      tasks,
      tracking,
      budgetTransactions,
      addTask,
      updateTask,
      updateTaskSteps,
      updateTaskStatus,
      startTracking,
      stopTracking,
      toggleTracking,
      completeTask,
      completeTaskWithReport,
      addManualTime,
      addBudgetExpense,
      getBudgetTransactions,
      isTracking,
      getTrackingElapsedMs,
      getTaskComments,
      getTaskHistory,
      addTaskComment,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

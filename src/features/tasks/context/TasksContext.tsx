import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_TASKS } from "../mockTasks";
import { MOCK_TASK_COMMENTS } from "../mockTaskComments";
import type { AddTaskCommentInput, CreateTaskInput, Task, TaskComment, TaskStatus } from "../types";
import { addElapsedToTimeSpent } from "../utils/timeTrackingUtils";

const STORAGE_KEY = "alltrack-tasks";
const COMMENTS_STORAGE_KEY = "alltrack-task-comments";
const TRACKING_STORAGE_KEY = "alltrack-task-tracking";

export interface TaskTracking {
  taskId: string;
  startedAt: number;
}

interface TasksContextValue {
  tasks: Task[];
  tracking: TaskTracking | null;
  addTask: (input: CreateTaskInput) => Task;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  startTracking: (taskId: string) => void;
  stopTracking: () => void;
  toggleTracking: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  isTracking: (taskId: string) => boolean;
  getTrackingElapsedMs: () => number;
  getTaskComments: (taskId: string) => TaskComment[];
  addTaskComment: (input: AddTaskCommentInput) => TaskComment;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export { TasksContext };

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Task[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    /* use seed data */
  }
  return MOCK_TASKS;
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

  const addTask = useCallback((input: CreateTaskInput) => {
    let createdTask: Task | null = null;

    setTasks((prev) => {
      createdTask = {
        id: createTaskId(prev),
        title: input.title.trim(),
        status: "pending",
        priority: input.priority,
        groups: input.groups.filter(Boolean),
        createdAt: new Date().toISOString(),
        dueDate: new Date(input.dueDate).toISOString(),
        initiator: input.initiator.trim(),
        responsible: input.responsible.filter(Boolean),
        budget: input.budget.trim() || "$0",
        timeSpent: "0h 00m",
      };

      const next = [createdTask, ...prev];
      persistTasks(next);
      return next;
    });

    return createdTask!;
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
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
      };

      const next = [...prev, createdComment];
      persistComments(next);
      return next;
    });

    return createdComment!;
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      tracking,
      addTask,
      updateTaskStatus,
      startTracking,
      stopTracking,
      toggleTracking,
      completeTask,
      isTracking,
      getTrackingElapsedMs,
      getTaskComments,
      addTaskComment,
    }),
    [
      tasks,
      tracking,
      addTask,
      updateTaskStatus,
      startTracking,
      stopTracking,
      toggleTracking,
      completeTask,
      isTracking,
      getTrackingElapsedMs,
      getTaskComments,
      addTaskComment,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

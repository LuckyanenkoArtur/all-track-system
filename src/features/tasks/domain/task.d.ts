export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    groups: string[];
    observables: string[];
    createdAt: string;
    startDate: string;
    dueDate: string;
    initiator: string;
    responsible: string[];
    budget: string;
    timeSpent: string;
    description?: string;
    steps?: TaskStep[];
    attachments?: Attachment[];
    requiresResultReview?: boolean;
    budgetSpent?: string;
  }
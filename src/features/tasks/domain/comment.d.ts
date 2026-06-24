export interface TaskCommentAttachment {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    dataUrl: string;
  }
  
  export interface TaskComment {
    id: string;
    taskId: string;
    author: string;
    authorInitials: string;
    body: string;
    createdAt: string;
    attachments: TaskCommentAttachment[];
    kind?: "default" | "completion";
    completionSteps?: CompletionReportStep[];
  }
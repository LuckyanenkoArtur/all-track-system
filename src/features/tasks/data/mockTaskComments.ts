import type { TaskComment } from "./types";

export const MOCK_TASK_COMMENTS: TaskComment[] = [
  {
    id: "CMT-001",
    taskId: "TSK-002",
    author: "Alex M.",
    authorInitials: "AM",
    body: "Sidebar collapse animation still jumps on nested routes. I'll profile layout shift next.",
    createdAt: "2026-06-08T14:30:00Z",
    attachments: [],
  },
  {
    id: "CMT-002",
    taskId: "TSK-002",
    author: "Sarah K.",
    authorInitials: "SK",
    body: "Attached the QA checklist for the sidebar regression pass.",
    createdAt: "2026-06-09T09:15:00Z",
    attachments: [
      {
        id: "ATT-001",
        name: "sidebar-qa-checklist.pdf",
        size: 245760,
        mimeType: "application/pdf",
        dataUrl: "",
      },
    ],
  },
];

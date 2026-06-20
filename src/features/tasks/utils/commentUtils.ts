export const MAX_COMMENT_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_COMMENT_ATTACHMENTS = 3;

export type PendingAttachment = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  dataUrl: string;
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function createPendingAttachment(file: File, dataUrl: string): PendingAttachment {
  return {
    id: `pending-${crypto.randomUUID()}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    dataUrl,
  };
}

export function formatCommentDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getAuthorInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function downloadAttachment(
  attachment: { name: string; dataUrl: string },
): void {
  if (!attachment.dataUrl) return;

  const link = document.createElement("a");
  link.href = attachment.dataUrl;
  link.download = attachment.name;
  link.click();
}

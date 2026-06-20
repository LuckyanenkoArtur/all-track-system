export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

export function endOfWeek(date: Date): Date {
  const next = startOfWeek(date);
  next.setDate(next.getDate() + 6);
  return endOfDay(next);
}

export function isToday(dateString: string, reference = new Date()): boolean {
  const date = new Date(dateString);
  const start = startOfDay(reference);
  const end = endOfDay(reference);
  return date >= start && date <= end;
}

export function isThisWeek(dateString: string, reference = new Date()): boolean {
  const date = new Date(dateString);
  return date >= startOfWeek(reference) && date <= endOfWeek(reference);
}

export function formatDueDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDueDateShort(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toDateTimeLocalValue(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

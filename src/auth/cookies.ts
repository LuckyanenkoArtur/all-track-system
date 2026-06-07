import { AUTH_COOKIE_NAME } from "./constants";

export function setAuthToken(token: string, days = 7): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function removeAuthToken(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

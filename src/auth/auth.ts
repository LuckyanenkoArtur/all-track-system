import { DEV_CREDENTIALS } from "./constants";
import { getAuthToken, removeAuthToken, setAuthToken } from "./cookies";

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export async function login(
  username: string,
  password: string,
  remember = false,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isValid =
    username === DEV_CREDENTIALS.username &&
    password === DEV_CREDENTIALS.password;

  if (!isValid) return false;

  setAuthToken(`alltrack-session-${Date.now()}`, remember ? 30 : 1);
  return true;
}

export function logout(): void {
  removeAuthToken();
}

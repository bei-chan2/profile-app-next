import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "profile-app-auth";
const AUTH_COOKIE_VALUE = "logged-in";

const BEICHAN_EMAIL = "0000";
const BEICHAN_PASSWORD = "0000";

export function isValidLogin(email: string, password: string): boolean {
  return email === BEICHAN_EMAIL && password === BEICHAN_PASSWORD;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;
}

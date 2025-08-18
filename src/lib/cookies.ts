import Cookies from "js-cookie";

export function setAuthToken(token: string, rememberMe?: boolean) {
  Cookies.set("auth-token", token, {
    expires: rememberMe ? 30 : undefined, // 30 ngày nếu "remember me"
    sameSite: "strict",
    secure: true,
  });
}

export function getAuthToken(): string | null {
  return Cookies.get("auth-token") || null;
}

export function clearAuthToken() {
  Cookies.remove("auth-token");
}

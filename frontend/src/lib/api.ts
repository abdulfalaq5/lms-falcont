const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("lms_access_token"),
    refreshToken: localStorage.getItem("lms_refresh_token"),
  };
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("lms_access_token", accessToken);
  localStorage.setItem("lms_refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("lms_access_token");
  localStorage.removeItem("lms_refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const { accessToken } = getTokens();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(`${API_URL}${path}`, {
        method,
        headers: { ...headers, Authorization: `Bearer ${newToken}` },
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, Array.isArray(message) ? message.join(", ") : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function downloadFile(path: string, filename: string) {
  const { accessToken } = getTokens();
  const res = await fetch(`${API_URL}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!res.ok) throw new ApiError(res.status, "Gagal mengunduh berkas");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export { API_URL };

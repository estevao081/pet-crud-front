const API_BASE = import.meta.env.VITE_API_URL;

export interface AuthUser {
  name: string;
  token: string;
  role: string;
}

function parseJwtRole(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "ROLE_USER";
  } catch {
    return "ROLE_USER";
  }
}

export interface RegisterData {
  name: string;
  number: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface LoginResponseDTO {
  name: string;
  token: string;
}

export async function registerUser(data: RegisterData): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<LoginResponseDTO> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Erro ao cadastrar");
  return { name: json.data.name, token: json.data.token, role: parseJwtRole(json.data.token) };
}

export async function loginUser(data: LoginData): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<LoginResponseDTO> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Credenciais inválidas");
  return { name: json.data.name, token: json.data.token, role: parseJwtRole(json.data.token) };
}

export function getStoredAuth(): AuthUser | null {
  const raw = localStorage.getItem("auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeAuth(user: AuthUser) {
  localStorage.setItem("auth", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("auth");
}

export function getAuthHeaders(): HeadersInit {
  const auth = getStoredAuth();
  if (!auth) return {};
  return { Authorization: `Bearer ${auth.token}` };
}

import { api } from "./api";
import { User } from "../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ORGANIZER";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post("/auth/register", payload);
  return res.data.data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post("/auth/login", payload);
  return res.data.data;
}

export async function getMeRequest(): Promise<User> {
  const res = await api.get("/auth/me");
  return res.data.data;
}

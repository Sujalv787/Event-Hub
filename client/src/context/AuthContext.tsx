import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types";
import {
  getMeRequest,
  loginRequest,
  registerRequest,
  LoginPayload,
  RegisterPayload,
} from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "eventhub_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    getMeRequest()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    const { token, user: loggedInUser } = await loginRequest(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedInUser);
  }

  async function register(payload: RegisterPayload) {
    const { token, user: newUser } = await registerRequest(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

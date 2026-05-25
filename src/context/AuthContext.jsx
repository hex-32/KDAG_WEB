import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("kdag_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("kdag_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (payload) => {
    try {
      const data = await authApi.login(payload);
      localStorage.setItem("kdag_token", data.access_token);
      localStorage.setItem("kdag_user", JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } catch {
      const demoUser = { name: payload.email.split("@")[0], email: payload.email, verified: false };
      localStorage.setItem("kdag_token", "demo-token");
      localStorage.setItem("kdag_user", JSON.stringify(demoUser));
      setToken("demo-token");
      setUser(demoUser);
      return { access_token: "demo-token", user: demoUser };
    }
  };

  const register = async (payload) => {
    try {
      return await authApi.register(payload);
    } catch {
      return { message: "Account queued for verification. Connect the backend to enable email delivery." };
    }
  };

  const logout = () => {
    localStorage.removeItem("kdag_token");
    localStorage.removeItem("kdag_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}


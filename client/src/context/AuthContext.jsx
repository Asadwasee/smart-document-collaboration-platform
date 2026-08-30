import { createContext, useContext, useEffect, useState } from "react";
import api, { updateAccessToken } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token = response.data.accessToken;

    setUser(response.data.user);
    setAccessToken(token);
    updateAccessToken(token);

    return response.data;
  };

  // ================= REGISTER =================

  const register = async (name, email, password) => {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    return response.data;
  };

  // ================= LOGOUT =================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      updateAccessToken(null);
    }
  };

  // ================= REFRESH SESSION =================

  const refreshSession = async () => {
    try {
      const response = await api.post("/auth/refresh");

      const token = response.data.accessToken;

      setAccessToken(token);
      updateAccessToken(token);

      const meResponse = await api.get("/auth/me");

      setUser(meResponse.data.user);
    } catch (error) {
      console.error("Failed to refresh session:", error);

      setUser(null);
      setAccessToken(null);
      updateAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL SESSION =================

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service.js";
import { analyticsService } from "../services/analytics.service.js";



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Periodic Activity Ping
  useEffect(() => {
    if (!user) return;
    
    // Initial ping
    analyticsService.ping().catch(() => {});
    
    const interval = setInterval(() => {
      analyticsService.ping().catch(() => {});
    }, 60000); // every 60s

    
    return () => clearInterval(interval);
  }, [user]);


  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {}
    setUser(null);
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

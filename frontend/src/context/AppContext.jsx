import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCurrentUser(api.getCurrentUser());
    setInitializing(false);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const login = useCallback(async (email, password) => {
    const user = await api.loginUser(email, password);
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload) => {
    const user = await api.registerApplicant(payload);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    api.logoutUser();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    initializing,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    isApplicant: currentUser?.role === "applicant",
    login,
    register,
    logout,
    toast,
    showToast,
    clearToast: () => setToast(null),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

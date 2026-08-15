import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ role, children }) {
  const { currentUser, initializing } = useApp();
  const location = useLocation();

  if (initializing) return null;

  if (!currentUser) {
    const loginPath = role === "admin" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === "admin" ? "/admin/dashboard" : "/applicant/dashboard"} replace />;
  }

  return children;
}

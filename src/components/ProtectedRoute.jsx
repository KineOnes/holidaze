// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // send user to login, remember where they tried to go
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

// Only venue managers should see some pages
export function ManagerRoute({ children }) {
  const { isLoggedIn, venueManager } = useAuth();
  const location = useLocation();

  if (!isLoggedIn || !venueManager) {
    // you can choose where to send them instead
    return (
      <Navigate
        to="/profile"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

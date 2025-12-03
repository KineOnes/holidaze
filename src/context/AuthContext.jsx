// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "holidaze_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // profile object from API
  const [token, setToken] = useState("");

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.token) setToken(parsed.token);
      if (parsed.user) setUser(parsed.user);
    } catch {
      // If something is weird in storage, just ignore it
      console.warn("Could not parse stored auth data");
    }
  }, []);

  function login(profile, accessToken) {
    setUser(profile);
    setToken(accessToken);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: profile,
        token: accessToken,
      })
    );
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    venueManager: user?.venueManager ?? false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

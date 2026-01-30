import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();
const STORAGE_KEY = "holidaze_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const stored = readStoredAuth();

  const [user, setUser] = useState(stored?.user ?? null);
  const [token, setToken] = useState(stored?.token ?? "");

  function persist(nextUser, nextToken) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken })
    );
  }

  function login(profile, accessToken) {
    setUser(profile);
    setToken(accessToken);
    persist(profile, accessToken);
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem(STORAGE_KEY);
  }

  // Use anywhere an update of user fields is needed(avatar, banner, etc)
  function updateUser(updater) {
    setUser((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next, token);
      return next;
    });
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: !!token,
      venueManager: user?.venueManager ?? false,
      login,
      logout,
      updateUser,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

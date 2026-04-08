import { createContext, useEffect, useState } from "react";

import { AUTH_STORAGE_KEY } from "../constants";

export const AuthContext = createContext(null);

const getStoredAuth = () => {
  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawAuth) {
    return null;
  }

  try {
    return JSON.parse(rawAuth);
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  const saveAuth = (authPayload) => {
    setAuth(authPayload);
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth,
        token: auth?.token || null,
        isAuthenticated: Boolean(auth?.token),
        saveAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

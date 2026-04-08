import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { THEME_STORAGE_KEY } from "./constants";

const getInitialTheme = () => localStorage.getItem(THEME_STORAGE_KEY) || "light";

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={<LoginPage theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/register"
        element={<RegisterPage theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage theme={theme} toggleTheme={toggleTheme} />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

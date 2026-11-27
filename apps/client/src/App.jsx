import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAppDispatch } from "./hooks/useAppDispatch";
import { initializeAuth, resetAuth } from "./features/auth/authSlice";
import { setAuthenticationFailureHandler } from "./services/api";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function DashboardPlaceholder() {
  return <div className="p-10">Dashboard implementation coming next.</div>;
}

function NotFoundPage() {
  return <div className="p-10">404 - Page Not Found</div>;
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setAuthenticationFailureHandler(() => {
      dispatch(resetAuth());
    });

    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
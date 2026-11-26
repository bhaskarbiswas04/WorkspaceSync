import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

function DashboardPlaceholder() {
  return <div className="p-10">Dashboard implementation coming next.</div>;
}

function NotFoundPage() {
  return <div className="p-10">404 – Page Not Found</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPlaceholder />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
import { Routes, Route, Navigate } from "react-router-dom";

function LoginPage() {
  return <div>Login Page – Coming Soon</div>;
}

function RegisterPage() {
  return <div>Register Page – Coming Soon</div>;
}

function NotFoundPage() {
  return <div>404 – Page Not Found</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-email" element={<VerifyEmail />}  />

        <Route
          path="/dashboard"
          element={<div>Dashboard Page</div>}
        />

        <Route
          path="/workspaces"
          element={<div>Workspace Page</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
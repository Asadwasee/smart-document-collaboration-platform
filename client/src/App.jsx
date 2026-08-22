import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import WorkSpace from "./pages/workspace/WorkSpace";
import Editor from "./pages/editor/Editor";

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
          path="/workspace"
          element={<WorkSpace/>}
        />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Topbar from "./components/layout/Topbar";
import WorkSpace from "./pages/workspace/WorkSpace";
import Editor from "./pages/editor/Editor";
import FileManagement from "./components/files/FileManagement";
function App() {
  return (

    <BrowserRouter>
    <Topbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-email" element={<VerifyEmail />}  />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/workspace"
          element={<WorkSpace/>}
        />
        <Route path="/editor" element={<Editor />} />
        <Route path="/filemanagement" element={<FileManagement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
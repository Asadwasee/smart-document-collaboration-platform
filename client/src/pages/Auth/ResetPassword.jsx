import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../api/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Password reset token is missing or invalid.");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setSuccess(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been updated successfully."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-2xl text-[#14B8A6]">
            ✓
          </div>

          <p className="text-sm leading-6 text-slate-500">
            You can now log in using your new password.
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Continue to login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter a new password for your SmartDocs account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="New password"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setError("");
          }}
          placeholder="Enter your new password"
          required
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setError("");
          }}
          placeholder="Confirm your new password"
          error={error}
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-[#4F46E5] hover:text-[#3730A3]"
        >
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;

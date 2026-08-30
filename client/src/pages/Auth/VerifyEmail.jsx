import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/common/Button";
import api from "../../api/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api.post("/auth/verify-email", {
          token,
        });

        setStatus("success");
        setMessage(
          response.data.message || "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyAccount();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      setMessage("Email address is missing.");
      setStatus("error");
      return;
    }

    try {
      setResending(true);
      setMessage("");

      const response = await api.post("/auth/resend-verification", {
        email,
      });

      setStatus("resent");
      setMessage(
        response.data.message || "A new verification email has been sent."
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Unable to resend verification email."
      );
    } finally {
      setResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <AuthLayout
        title="Verifying your email"
        subtitle="Please wait while we verify your email address."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-2xl text-[#4F46E5]">
            ✓
          </div>

          <p className="text-sm leading-6 text-slate-500">
            Verifying your account...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle="Your SmartDocs account is now active."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-2xl text-[#14B8A6]">
            ✓
          </div>

          <p className="text-sm leading-6 text-slate-500">{message}</p>

          <Link to="/login">
            <Button type="button" className="w-full">
              Continue to login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a verification link to your email address."
    >
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-2xl text-[#4F46E5]">
          ✉
        </div>

        <div>
          <p className="text-sm leading-6 text-slate-500">
            {email ? (
              <>
                Please check your inbox at{" "}
                <strong className="text-[#1E293B]">{email}</strong>.
              </>
            ) : (
              "Please check your inbox."
            )}
          </p>

          {message && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Click the verification link in the email to activate your account.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleResend}
          loading={resending}
        >
          Resend verification email
        </Button>

        <Link
          to="/login"
          className="block text-sm font-medium text-[#4F46E5] hover:text-[#3730A3]"
        >
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
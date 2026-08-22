import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setError("");
    setSubmitted(true);

    console.log("Forgot password request:", email);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="If an account exists with this email, we will send password reset instructions."
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-[#14B8A6]">
            ✓
          </div>

          <p className="text-sm leading-6 text-slate-500">
            Please check your inbox and follow the instructions to reset your
            password.
          </p>

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

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you reset instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="you@example.com"
          error={error}
          required
        />

        <Button type="submit" className="w-full">
          Send reset link
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

export default ForgotPassword;
import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
const { register } = useAuth();

const [loading, setLoading] = useState(false);
const [serverError, setServerError] = useState("");

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));

  setErrors((previous) => ({
    ...previous,
    [name]: "",
  }));

  setServerError("");
};

  const handleSubmit = async (event) => {
  event.preventDefault();

  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required.";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required.";
  }

  if (!formData.password) {
    newErrors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters.";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  try {
    setLoading(true);
    setServerError("");

    await register(
      formData.name,
      formData.email,
      formData.password
    );

    navigate(
      `/verify-email?email=${encodeURIComponent(formData.email)}`
    );
  } catch (error) {
    setServerError(
      error.response?.data?.message ||
        "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with your smart workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
          required
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          required
        />

        {serverError && (
  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
    {serverError}
  </p>
)}

        <Button type="submit" className="w-full"
        loading={loading}>
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-[#4F46E5] hover:text-[#3730A3]"
        >
          Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  onClick,
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-[#4F46E5] text-white hover:bg-[#3730A3] focus:ring-[#4F46E5]",

    secondary:
      "border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50 focus:ring-[#4F46E5]",

    danger:
      "bg-[#EF4444] text-white hover:bg-red-600 focus:ring-[#EF4444]",

    ghost:
      "bg-transparent text-[#1E293B] hover:bg-gray-100 focus:ring-[#4F46E5]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
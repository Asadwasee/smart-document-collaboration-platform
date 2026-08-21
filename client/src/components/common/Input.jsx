function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-[#1E293B]"
        >
          {label}
          {required && <span className="ml-1 text-[#EF4444]">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition
          placeholder:text-slate-400
          focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10
          disabled:cursor-not-allowed disabled:bg-slate-100
          ${
            error
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10"
              : "border-[#E2E8F0]"
          }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
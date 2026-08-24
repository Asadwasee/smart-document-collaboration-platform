function EmptyState({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[#1E293B]">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
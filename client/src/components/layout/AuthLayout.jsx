function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5] text-xl font-bold text-white">
              S
            </div>

            <h1 className="text-2xl font-semibold text-[#1E293B]">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
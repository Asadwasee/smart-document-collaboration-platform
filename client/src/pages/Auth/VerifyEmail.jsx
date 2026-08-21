import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/common/Button";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

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
            Please check your inbox
            {email && (
              <>
                {" "}
                at <strong className="text-[#1E293B]">{email}</strong>
              </>
            )}
            .
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Click the verification link in the email to activate your account.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => console.log("Resend verification email")}
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
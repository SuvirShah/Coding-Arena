import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./authSlice";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least three letters"),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    await dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 font-sans relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Brand Logo / Heading */}
      <div className="mb-10 text-center z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm ring-1 ring-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
          CodeArena
        </h1>
        <p className="text-base-content/60 font-medium mt-2">
          Master algorithms. Ace interviews.
        </p>
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 rounded-3xl z-10 relative backdrop-blur-sm bg-base-100/90">
        <div className="card-body p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-1 text-base-content tracking-tight">Create your account</h2>
          <p className="text-sm text-base-content/60 mb-8 font-medium">
            Join thousands of developers leveling up their skills.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold text-base-content/80 text-sm">First Name</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="John"
                className={`input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.firstName ? 'border-error focus:ring-error/30' : ''}`}
              />
              {errors.firstName && (
                <span className="text-error text-xs mt-2 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold text-base-content/80 text-sm">Email Address</span>
              </label>
              <input
                {...register("emailId")}
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.emailId ? 'border-error focus:ring-error/30' : ''}`}
              />
              {errors.emailId && (
                <span className="text-error text-xs mt-2 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  {errors.emailId.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold text-base-content/80 text-sm">Password</span>
              </label>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 pr-12 transition-all ${errors.password ? 'border-error focus:ring-error/30' : ''}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-base-content/40 hover:text-base-content/80 transition-colors rounded-lg"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="text-error text-xs mt-2 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  {errors.password.message}
                </span>
              )}
            </div>

            {error && (
              <div className="p-3 mt-2 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-error mt-0.5 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="form-control mt-6 pt-2">
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-xl font-bold tracking-wide shadow-md transition-all hover:shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
          
          <div className="divider text-base-content/40 text-xs font-semibold my-6 uppercase tracking-wider">or</div>

          <p className="text-sm text-center text-base-content/70 font-medium">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary-focus font-bold transition-colors ml-1 hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
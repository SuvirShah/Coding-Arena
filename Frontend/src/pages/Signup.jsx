import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./authSlice";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least three letters"),
  emailId: z.string().email("Invalid email"),
  password: z.string().min(8, "Password is too weak")
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
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary tracking-tight">
        Coding Companion
      </h1>

      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-2">Create your account</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Sign up to start practicing problems and track your progress.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First name</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className="input input-bordered w-full"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("emailId")}
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
              />
              {errors.emailId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password"
                  className="input input-bordered w-full pr-20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-center text-base-content/70">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="link link-primary"
                >
                  Log in
                </button>
</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-base-content/60">
        Built with React, react-hook-form, zod, Tailwind CSS, and daisyUI.
      </p>
    </div>
  );
}

export default Signup;
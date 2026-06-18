import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { loginUser } from "./authSlice";

const signupSchema = z.object({
  emailId: z.string().email("Invalid email"),
  password: z.string().min(8, "Password is too weak")
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(signupSchema) });

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
    }
  },[isAuthenticated,navigate]);


  const onSubmit = async (data) => {
    await dispatch(loginUser(data));
    // TODO: call your signup API here
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
      {/* Site heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary tracking-tight">
        Coding Companion
      </h1>

      {/* Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-2">Login</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Login to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Small footer text */}
      <p className="mt-6 text-xs text-base-content/60">
        Built with React, react-hook-form, zod, Tailwind CSS, and daisyUI.
      </p>
    </div>
  );
}





export default Login;
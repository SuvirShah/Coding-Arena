import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold text-primary tracking-tight">404</p>
      <h1 className="text-2xl font-bold text-base-content mt-4">Page not found</h1>
      <p className="text-base-content/60 mt-2 max-w-md">
        The page you're looking for doesn't exist or was moved.
      </p>
      <button className="btn btn-primary rounded-xl mt-6" onClick={() => navigate("/")}>
        Back to problems
      </button>
    </div>
  );
}

export default NotFound;
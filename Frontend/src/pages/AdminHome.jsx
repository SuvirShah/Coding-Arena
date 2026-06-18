import { useNavigate } from "react-router";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-base-content mb-2">
            Problem Management Console
          </h1>
          <p className="text-base text-base-content/70">
            Create, update, delete problems, and manage editorial videos for your CodeArena question bank.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              Choose an action
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <button
                className="btn btn-primary btn-lg h-24 flex flex-col items-center justify-center gap-1"
                onClick={() => navigate("/admin/create")}
              >
                <span className="text-lg font-semibold">Create Problem</span>
                <span className="text-xs text-base-100/80">
                  Add a new coding challenge
                </span>
              </button>

              <button
                className="btn btn-secondary btn-lg h-24 flex flex-col items-center justify-center gap-1"
                onClick={() => navigate("/admin/update")}
              >
                <span className="text-lg font-semibold">Update Problem</span>
                <span className="text-xs text-base-100/80">
                  Edit existing problem details
                </span>
              </button>

              <button
                className="btn btn-error btn-lg h-24 flex flex-col items-center justify-center gap-1"
                onClick={() => navigate("/admin/delete")}
              >
                <span className="text-lg font-semibold">Delete Problem</span>
                <span className="text-xs text-base-100/80">
                  Remove a problem permanently
                </span>
              </button>

              <button
                className="btn btn-accent btn-lg h-24 flex flex-col items-center justify-center gap-1"
                onClick={() => navigate("/admin/video")}
              >
                <span className="text-lg font-semibold">Upload Video</span>
                <span className="text-xs text-base-100/80">
                  Add or delete editorial videos
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "./authSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post("/user/getProfile");
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const STATUS_BADGE = {
    accepted: "badge-success",
    pending: "badge-warning",
    "wrong result": "badge-error",
    "runtime error": "badge-error",
    tle: "badge-error",
    mle: "badge-error",
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-8 shadow-sm">
          <div className="flex-1">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost text-xl font-bold text-primary normal-case"
            >
              CodeArena
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-8 shadow-sm">
          <div className="flex-1">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost text-xl font-bold text-primary normal-case"
            >
              CodeArena
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-error text-lg font-medium">{error}</div>
          <button onClick={() => navigate("/")} className="btn btn-primary btn-sm">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { user: profileUser, problemsSolved, submissions } = profile;

  // Calculate total problems for progress bars (use a reasonable ceiling)
  const totalProblemsAvailable = Math.max(
    problemsSolved.total,
    problemsSolved.easy + problemsSolved.medium + problemsSolved.hard,
    1
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar — identical to Homepage */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-8 shadow-sm">
        <div className="flex-1">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost text-xl font-bold text-primary normal-case"
          >
            CodeArena
          </button>
        </div>

        <div className="flex-none">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm normal-case gap-2"
              >
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-sm flex flex-col justify-center items-center">
                      {user.firstName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline font-medium">
                  {user.firstName}
                </span>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-100 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title">
                  <span>{user.firstName}</span>
                </li>
                <li>
                  <button onClick={() => navigate("/profile")}>
                    Profile
                  </button>
                </li>
                {user && user.role?.toLowerCase() === "admin" && (
                  <li>
                    <button onClick={() => navigate("/admin")}>
                      Admin Panel
                    </button>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost btn-sm gap-1 text-base-content/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Problems
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-20 h-20 flex items-center justify-center ring ring-primary ring-offset-base-100 ring-offset-2">
                <span className="text-3xl font-bold">
                  {profileUser.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-base-content">
                {profileUser.firstName}
                {profileUser.lastName ? ` ${profileUser.lastName}` : ""}
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                {profileUser.emailId}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="badge badge-outline badge-sm capitalize">
                  {profileUser.role}
                </span>
                <span className="badge badge-ghost badge-sm">
                  Joined {formatDate(profileUser.createdAt)}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stats stats-vertical sm:stats-horizontal bg-base-200 border border-base-300 shadow-none">
              <div className="stat px-4 py-3">
                <div className="stat-title text-xs">Solved</div>
                <div className="stat-value text-primary text-2xl">{problemsSolved.total}</div>
              </div>
              <div className="stat px-4 py-3">
                <div className="stat-title text-xs">Submissions</div>
                <div className="stat-value text-2xl">{submissions.total}</div>
              </div>
              <div className="stat px-4 py-3">
                <div className="stat-title text-xs">Acceptance</div>
                <div className="stat-value text-2xl">{submissions.acceptanceRate}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Problems Solved Panel */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-base-content mb-5">
              Problems Solved
            </h2>

            {/* Total Solved Circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="radial-progress text-primary" style={{"--value": totalProblemsAvailable > 0 ? Math.round((problemsSolved.total / totalProblemsAvailable) * 100) : 0, "--size": "8rem", "--thickness": "8px"}} role="progressbar">
                <div className="text-center">
                  <div className="text-3xl font-bold text-base-content">{problemsSolved.total}</div>
                  <div className="text-xs text-base-content/50">Solved</div>
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-4">
              {/* Easy */}
              <div className="flex items-center gap-3">
                <span className="text-success font-semibold text-sm w-16">Easy</span>
                <progress
                  className="progress progress-success flex-1"
                  value={problemsSolved.easy}
                  max={Math.max(problemsSolved.easy, 1)}
                ></progress>
                <span className="text-base-content font-bold text-sm w-8 text-right">
                  {problemsSolved.easy}
                </span>
              </div>

              {/* Medium */}
              <div className="flex items-center gap-3">
                <span className="text-warning font-semibold text-sm w-16">Medium</span>
                <progress
                  className="progress progress-warning flex-1"
                  value={problemsSolved.medium}
                  max={Math.max(problemsSolved.medium, 1)}
                ></progress>
                <span className="text-base-content font-bold text-sm w-8 text-right">
                  {problemsSolved.medium}
                </span>
              </div>

              {/* Hard */}
              <div className="flex items-center gap-3">
                <span className="text-error font-semibold text-sm w-16">Hard</span>
                <progress
                  className="progress progress-error flex-1"
                  value={problemsSolved.hard}
                  max={Math.max(problemsSolved.hard, 1)}
                ></progress>
                <span className="text-base-content font-bold text-sm w-8 text-right">
                  {problemsSolved.hard}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Stats Panel */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-base-content mb-5">
              Submission Stats
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-base-content/70 text-sm">Total Submissions</span>
                <span className="font-bold text-base-content">{submissions.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-base-content/70 text-sm">Accepted</span>
                <span className="font-bold text-success">{submissions.accepted}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-base-content/70 text-sm">Acceptance Rate</span>
                <span className="font-bold text-base-content">{submissions.acceptanceRate}%</span>
              </div>

              {/* Acceptance Rate Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-base-content/50 mb-1">
                  <span>Acceptance Rate</span>
                  <span>{submissions.acceptanceRate}%</span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={submissions.acceptanceRate}
                  max={100}
                ></progress>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-lg font-bold text-base-content">
              Recent Submissions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/60 text-base-content">
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Test Cases</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {submissions.recent && submissions.recent.length > 0 ? (
                  submissions.recent.map((sub, idx) => (
                    <tr key={sub._id} className="hover">
                      <td className="text-base-content/50">{idx + 1}</td>
                      <td className="font-medium">
                        <button
                          className="link link-hover link-primary text-sm"
                          onClick={() => navigate(`/problem/${sub.problemId}`)}
                        >
                          {sub.problemId}
                        </button>
                      </td>
                      <td>
                        <span className="badge badge-ghost badge-sm capitalize">
                          {sub.language}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm capitalize ${
                            STATUS_BADGE[sub.status] || "badge-ghost"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="text-sm">
                        <span className="text-success font-medium">{sub.testCasesPassed}</span>
                        <span className="text-base-content/40"> / {sub.totalTestCases}</span>
                      </td>
                      <td className="text-sm text-base-content/70">
                        {sub.runtime ? `${sub.runtime.toFixed(2)}s` : "—"}
                      </td>
                      <td className="text-sm text-base-content/70">
                        {sub.memory ? `${sub.memory} KB` : "—"}
                      </td>
                      <td className="text-sm text-base-content/50">
                        {formatDate(sub.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-base-content/50">
                      No submissions yet. Start solving problems!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

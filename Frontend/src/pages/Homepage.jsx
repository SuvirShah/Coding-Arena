import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "./authSlice";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  console.log("USER IN HOMEPAGE:", user);
  console.log("ROLE IN HOMEPAGE:", user?.role);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/ProblemSolvedByUser");
        setSolvedProblems(data);
      } catch (err) {
        console.error("Error fetching solved problems:", err);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    navigate("/login");
  };

  const filteredProblems = problems.filter((problem) => {
    const isSolved = solvedProblems.some((sp) => sp._id === problem._id);

    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === "all" || problem.tags?.includes(filters.tag);

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && isSolved) ||
      (filters.status === "unsolved" && !isSolved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  const DIFFICULTY_BADGE = {
    easy: "badge-success",
    medium: "badge-warning",
    hard: "badge-error",
  };

  return (
    <>
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

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-base-content">Problem Set</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Practice coding problems and track your solved progress.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
            <select
              className="select select-bordered select-sm"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              className="select select-bordered select-sm"
              value={filters.tag}
              onChange={(e) =>
                setFilters({ ...filters, tag: e.target.value })
              }
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedlist">Linked List</option>
              <option value="dp">DP</option>
              <option value="graph">Graph</option>
            </select>

            <select
              className="select select-bordered select-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200/60 text-base-content">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Difficulty</th>
                    {user && <th>Status</th>}
                  </tr>
                </thead>

                <tbody>
                  {filteredProblems.map((problem, idx) => {
                    const isSolved = solvedProblems.some(
                      (sp) => sp._id === problem._id
                    );

                    return (
                      <tr
                        key={problem._id}
                        className="hover cursor-pointer"
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <td className="text-base-content/50">{idx + 1}</td>
                        <td className="font-medium">{problem.title}</td>

                        <td>
                          <div className="flex flex-wrap gap-1">
                            {problem.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="badge badge-ghost badge-sm capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge badge-sm capitalize ${
                              DIFFICULTY_BADGE[problem.difficulty] ||
                              "badge-ghost"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>

                        {user && (
                          <td>
                            {isSolved ? (
                              <span className="badge badge-success badge-sm">
                                Solved
                              </span>
                            ) : (
                              <span className="badge badge-ghost badge-sm">
                                Unsolved
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProblems.length === 0 && (
              <div className="py-10 text-center text-base-content/50">
                No problems match the selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProblem && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedProblem(null)}
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span
                className={`badge badge-md capitalize ${
                  DIFFICULTY_BADGE[selectedProblem.difficulty] || "badge-ghost"
                }`}
              >
                {selectedProblem.difficulty}
              </span>
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium text-base-content/70 mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProblem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline badge-sm capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedProblem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(`/problem/${selectedProblem._id}`);
                  setSelectedProblem(null);
                }}
              >
                Open Problem
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setSelectedProblem(null)}
          >
            <button>close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
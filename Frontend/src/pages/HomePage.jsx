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
    easy: "text-success bg-success/10 border-success/20",
    medium: "text-warning bg-warning/10 border-warning/20",
    hard: "text-error bg-error/10 border-error/20",
  };

  return (
    <>
      <div className="min-h-screen bg-base-200 font-sans">
        {/* Navbar */}
        <div className="navbar bg-base-100/90 backdrop-blur-md border-b border-base-300 px-4 md:px-8 shadow-sm sticky top-0 z-40">
          <div className="flex-1">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost text-2xl font-extrabold tracking-tight text-primary normal-case hover:bg-transparent"
            >
              CodeArena
            </button>
          </div>

          <div className="flex-none gap-2">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost rounded-full px-2 hover:bg-base-200 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline font-semibold text-sm">
                      {user.firstName}
                    </span>
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-9 h-9 flex items-center justify-center shadow-inner">
                        <span className="text-sm font-bold">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content mt-3 z-[100] p-3 shadow-xl bg-base-100 rounded-2xl w-56 border border-base-300"
                >
                  <li className="menu-title px-4 py-2">
                    <span className="text-base-content/60 text-xs font-semibold uppercase tracking-wider">
                      Account
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="hover:bg-base-200 rounded-xl transition-colors"
                    >
                      Profile
                    </button>
                  </li>
                  {user && user.role?.toLowerCase() === "admin" && (
                    <li>
                      <button
                        onClick={() => navigate("/admin")}
                        className="hover:bg-base-200 rounded-xl transition-colors"
                      >
                        Admin Panel
                      </button>
                    </li>
                  )}
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-error hover:bg-error/10 rounded-xl transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary btn-sm rounded-full px-6 font-medium shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
              Problem Set
            </h1>
            <p className="text-base text-base-content/60 mt-2 max-w-2xl">
              Sharpen your coding skills with our curated collection of technical interview questions. Track your progress and master new algorithms.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-base-100 rounded-2xl border border-base-300 p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-all hover:shadow-md">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select
                className="select select-bordered select-sm rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                className="select select-bordered select-sm rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
              >
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedlist">Linked List</option>
                <option value="dp">Dynamic Programming</option>
                <option value="graph">Graph</option>
              </select>

              <select
                className="select select-bordered select-sm rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            
            <div className="w-full md:w-auto text-sm text-base-content/60 font-medium">
              Showing {filteredProblems.length} problem{filteredProblems.length !== 1 && 's'}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* Table Head */}
                <thead className="bg-base-200/60 border-b border-base-300 text-base-content/70">
                  <tr className="text-sm tracking-wider uppercase font-semibold">
                    <th className="px-6 py-4 w-16 text-center">#</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4 w-1/3">Tags</th>
                    <th className="px-6 py-4 w-32">Difficulty</th>
                    {user && <th className="px-6 py-4 w-32 text-center">Status</th>}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-base">
                  {filteredProblems.map((problem, idx) => {
                    const isSolved = solvedProblems.some(
                      (sp) => sp._id === problem._id
                    );

                    return (
                      <tr
                        key={problem._id}
                        className="hover:bg-base-200/50 transition-colors duration-200 cursor-pointer group border-b border-base-200 last:border-0"
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <td className="px-6 py-5 text-center text-base-content/40 group-hover:text-base-content/70 transition-colors font-medium">
                          {idx + 1}
                        </td>
                        
                        <td className="px-6 py-5 font-semibold text-base-content group-hover:text-primary transition-colors">
                          {problem.title}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {problem.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-md bg-base-200 text-base-content/70 text-xs font-medium capitalize border border-base-300 group-hover:border-base-content/20 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                              DIFFICULTY_BADGE[problem.difficulty] ||
                              "text-base-content bg-base-200 border-base-300"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>

                        {user && (
                          <td className="px-6 py-5 text-center">
                            {isSolved ? (
                              <div className="flex items-center justify-center text-success bg-success/10 rounded-full w-8 h-8 mx-auto" title="Solved">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-base-content/20 w-8 h-8 mx-auto" title="Unsolved">
                                <span className="w-2 h-2 rounded-full bg-base-content/20"></span>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredProblems.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-base-content/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-base-content">No problems found</h3>
                <p className="text-base-content/60 mt-1 max-w-sm">
                  We couldn't find any problems matching your current filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={() => setFilters({ difficulty: "all", tag: "all", status: "all" })}
                  className="btn btn-outline btn-sm mt-4 rounded-full"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div 
            className="bg-base-100 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-base-300 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-base-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-base-content leading-tight">
                    {selectedProblem.title}
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                        DIFFICULTY_BADGE[selectedProblem.difficulty] || "text-base-content bg-base-200 border-base-300"
                      }`}
                    >
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-sm text-base-content/50 font-medium">
                      Problem Preview
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-circle btn-ghost bg-base-200/50 hover:bg-base-300 text-base-content/70 transition-colors"
                  onClick={() => setSelectedProblem(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 bg-base-200/20">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-3">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProblem.tags?.length > 0 ? (
                    selectedProblem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg bg-base-100 border border-base-300 text-base-content/80 text-sm font-medium capitalize shadow-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-base-content/50 italic">No specific topics assigned.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:px-8 sm:py-6 bg-base-100 border-t border-base-200 flex justify-end gap-3">
              <button
                className="btn btn-ghost rounded-xl font-medium hover:bg-base-200"
                onClick={() => setSelectedProblem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary rounded-xl font-semibold px-6 shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  navigate(`/problem/${selectedProblem._id}`);
                  setSelectedProblem(null);
                }}
              >
                Solve Problem
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./authSlice";
import { useGetProblemsQuery, useGetSolvedProblemsQuery } from "./apiSlice";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useSelector((state) => state.auth);

  const { data: problems = [] } = useGetProblemsQuery();
  const { data: solvedProblems = [] } = useGetSolvedProblemsQuery(undefined, { skip: !user });

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  const handleLogout = () => {
    dispatch(logoutUser());
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
    easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <>
      <div className="min-h-screen bg-[#0c0b0a] text-[#f0f0f0] font-sans selection:bg-[#ffd700]/30 selection:text-white">
        {/* Navbar */}
        <div className="navbar bg-[#181614]/90 backdrop-blur-md border-b border-[#382e1e] px-4 md:px-8 shadow-md sticky top-0 z-40">
          <div className="flex-1 flex items-center">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost text-2xl font-extrabold tracking-tight text-[#ffd700] hover:text-[#e6c200] normal-case hover:bg-transparent transition-colors"
            >
              CodeArena
            </button>
            {isHomePage && (
              <button
                onClick={() => navigate("/visualizer")}
                className="btn btn-ghost btn-sm text-sm font-semibold text-[#a09a8e] hover:text-[#ffd700] hover:bg-[#26221d] normal-case ml-2 rounded-lg transition-all duration-200"
              >
                🧠 Visualizer
              </button>
            )}
          </div>

          <div className="flex-none gap-2">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost rounded-full px-2 hover:bg-[#26221d] transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline font-semibold text-sm text-[#f0f0f0]">
                      {user.firstName}
                    </span>
                    <div className="avatar placeholder">
                      <div className="bg-[#ffd700] text-black rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-md">
                        <span className="text-sm">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content mt-3 z-[100] p-3 shadow-2xl bg-[#181614] rounded-xl w-56 border border-[#382e1e]"
                >
                  <li className="menu-title px-4 py-2">
                    <span className="text-[#a09a8e] text-xs font-semibold uppercase tracking-wider">
                      Account
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="hover:bg-[#26221d] text-[#f0f0f0] rounded-lg transition-all duration-200"
                    >
                      Profile
                    </button>
                  </li>
                  {user && user.role?.toLowerCase() === "admin" && (
                    <li>
                      <button
                        onClick={() => navigate("/admin")}
                        className="hover:bg-[#26221d] text-[#f0f0f0] rounded-lg transition-all duration-200"
                      >
                        Admin Panel
                      </button>
                    </li>
                  )}
                  <div className="divider my-1 border-[#382e1e]"></div>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn btn-sm rounded-lg px-6 font-bold bg-[#ffd700] hover:bg-[#e6c200] text-black shadow-md transition-all duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-[#f0f0f0] tracking-tight">
              Problem Set
            </h1>
            <p className="text-base text-[#a09a8e] mt-2 max-w-2xl">
              Sharpen your coding skills with our curated collection of technical interview questions. Track your progress and master new algorithms.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-[#181614] rounded-xl border border-[#382e1e] p-5 mb-8 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-200">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select
                className="select select-sm rounded-lg bg-[#0c0b0a] text-[#f0f0f0] border border-[#382e1e] hover:border-[#ffd700]/50 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
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
                className="select select-sm rounded-lg bg-[#0c0b0a] text-[#f0f0f0] border border-[#382e1e] hover:border-[#ffd700]/50 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
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
                className="select select-sm rounded-lg bg-[#0c0b0a] text-[#f0f0f0] border border-[#382e1e] hover:border-[#ffd700]/50 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
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
            
            <div className="w-full md:w-auto text-sm text-[#a09a8e] font-medium">
              Showing <span className="text-[#ffd700] font-semibold">{filteredProblems.length}</span> problem{filteredProblems.length !== 1 && 's'}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#181614] rounded-xl border border-[#382e1e] overflow-hidden shadow-lg transition-all duration-200">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* Table Head */}
                <thead className="bg-[#110f0d] border-b border-[#382e1e] text-[#a09a8e]">
                  <tr className="text-sm tracking-wider uppercase font-semibold">
                    <th className="px-6 py-4 w-16 text-center">#</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4 w-1/3">Tags</th>
                    <th className="px-6 py-4 w-32">Difficulty</th>
                    {user && <th className="px-6 py-4 w-32 text-center">Status</th>}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-base divide-y divide-[#382e1e]/60">
                  {filteredProblems.map((problem, idx) => {
                    const isSolved = solvedProblems.some(
                      (sp) => sp._id === problem._id
                    );

                    return (
                      <tr
                        key={problem._id}
                        className="hover:bg-[#26221d] transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate(`/problem/${problem._id}`)}
                      >
                        <td className="px-6 py-5 text-center text-[#a09a8e]/60 group-hover:text-[#a09a8e] transition-colors font-medium">
                          {idx + 1}
                        </td>
                        
                        <td className="px-6 py-5 font-semibold text-[#f0f0f0] group-hover:text-[#ffd700] transition-colors">
                          {problem.title}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {problem.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-md bg-[#110f0d] text-[#a09a8e] text-xs font-medium capitalize border border-[#382e1e] group-hover:border-[#ffd700]/30 group-hover:text-[#f0f0f0] transition-all duration-200"
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
                              "text-[#f0f0f0] bg-[#110f0d] border-[#382e1e]"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>

                        {user && (
                          <td className="px-6 py-5 text-center">
                            {isSolved ? (
                              <div className="flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-8 h-8 mx-auto" title="Solved">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-[#a09a8e]/30 w-8 h-8 mx-auto" title="Unsolved">
                                <span className="w-2 h-2 rounded-full bg-[#382e1e]"></span>
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
                <div className="bg-[#110f0d] border border-[#382e1e] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#a09a8e]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#f0f0f0]">No problems found</h3>
                <p className="text-[#a09a8e] mt-1 max-w-sm">
                  We couldn't find any problems matching your current filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={() => setFilters({ difficulty: "all", tag: "all", status: "all" })}
                  className="btn btn-outline btn-sm mt-4 rounded-lg border-[#382e1e] text-[#f0f0f0] hover:bg-[#ffd700] hover:text-black hover:border-[#ffd700] transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
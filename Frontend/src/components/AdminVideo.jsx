import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axiosClient.delete(`/video/delete/${id}`);
      fetchProblems();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4 mx-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Upload and Delete</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <th>{index + 1}</th>
                <td>{problem.title}</td>
                <td>
                  <span
                    className={`badge ${
                      problem.difficulty?.toLowerCase() === "easy"
                        ? "badge-success"
                        : problem.difficulty?.toLowerCase() === "medium"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className="badge badge-outline">
                    {Array.isArray(problem.tags) ? problem.tags.join(", ") : problem.tags}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <NavLink
                      to={`/admin/upload/${problem._id}`}
                      className="btn btn-sm btn-info"
                    >
                      Upload
                    </NavLink>

                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVideo;
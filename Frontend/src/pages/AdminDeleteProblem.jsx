// src/pages/DeleteProblem.jsx
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function AdminDeleteProblem() {
  const [problems, setProblems] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    fetchProblems();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      await axiosClient.delete(`/problem/delete/${selectedId}`);
      setProblems((prev) => prev.filter((p) => p._id !== selectedId));
      setSelectedId("");
      alert("Problem deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.response || err);
      alert(
        `Error: ${
          err.response?.data?.message ? err.response.data.message : err.message
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-base-content mb-4">
          Delete Problem
        </h1>
        <p className="text-sm text-base-content/60 mb-4">
          Select a problem and delete it permanently.
        </p>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Select Problem</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Select problem --</option>
            {problems.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-error"
          onClick={handleDelete}
          disabled={!selectedId}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AdminDeleteProblem;
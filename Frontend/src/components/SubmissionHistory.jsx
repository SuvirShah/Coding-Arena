import { useState } from 'react';
import { useSubmissionForProblemByUserQuery } from '../pages/apiSlice';

const SubmissionHistory = ({ problemId }) => {
  const { data: submissions = [], isLoading: loading, isError, error: queryError } = useSubmissionForProblemByUserQuery(problemId);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'wrong result':
      case 'wrong':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'error':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-[#a09a8e] bg-[#26221d] border-[#382e1e]';
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return "—";
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-md text-[#ffd700]"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 my-2 text-sm">
        {queryError?.data?.message || "Failed to fetch submission history"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <div className="p-6 bg-[#181614] border border-[#382e1e] rounded-xl text-center text-[#a09a8e]">
          <p className="text-sm">No submissions recorded yet for this problem.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#382e1e] bg-[#181614]">
            <table className="table w-full text-xs sm:text-sm">
              <thead className="bg-[#110f0d] text-[#a09a8e] border-b border-[#382e1e]">
                <tr>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Runtime</th>
                  <th className="py-2.5 px-3">Memory</th>
                  <th className="py-2.5 px-3">Passed</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#382e1e]/50 text-[#f0f0f0]">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#26221d] transition-colors duration-200">
                    <td className="py-2.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(sub.status)}`}>
                        {sub.status === 'accepted' ? 'Accepted' : sub.status === 'wrong result' ? 'Wrong Answer' : sub.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-[#a09a8e]">{sub.language}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-[#ffd700]">{sub.runtime ? `${Math.round(sub.runtime * 1000)}ms` : "—"}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-[#f5a623]">{formatMemory(sub.memory)}</td>
                    <td className="py-2.5 px-3 font-mono text-xs">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="py-2.5 px-3 text-xs text-[#a09a8e]">{formatDate(sub.createdAt)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button 
                        className="btn btn-xs rounded-md bg-[#26221d] hover:bg-[#382e1e] text-[#f0f0f0] border border-[#382e1e] transition-all duration-200"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#a09a8e] px-1">
            Total {submissions.length} submission{submissions.length !== 1 && 's'}
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl bg-[#181614] border border-[#382e1e] rounded-xl text-[#f0f0f0] shadow-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              <span>Submission Code ({selectedSubmission.language})</span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedSubmission.status)}`}>
                {selectedSubmission.status}
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-4 text-xs font-mono">
              <div className="bg-[#110f0d] border border-[#382e1e] px-3 py-1.5 rounded-lg text-[#a09a8e]">
                Runtime: <span className="text-[#ffd700] font-bold">{selectedSubmission.runtime ? `${Math.round(selectedSubmission.runtime * 1000)}ms` : "—"}</span>
              </div>
              <div className="bg-[#110f0d] border border-[#382e1e] px-3 py-1.5 rounded-lg text-[#a09a8e]">
                Memory: <span className="text-[#f5a623] font-bold">{formatMemory(selectedSubmission.memory)}</span>
              </div>
              <div className="bg-[#110f0d] border border-[#382e1e] px-3 py-1.5 rounded-lg text-[#a09a8e]">
                Passed: <span className="text-[#f0f0f0] font-bold">{selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</span>
              </div>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="bg-rose-950/20 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs font-mono mb-4 overflow-x-auto select-all">
                {selectedSubmission.errorMessage}
              </div>
            )}
            
            <pre className="p-4 bg-[#110f0d] border border-[#382e1e] text-[#f0f0f0] rounded-xl overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed max-h-96 custom-scrollbar select-all">
              <code>{selectedSubmission.code}</code>
            </pre>
            
            <div className="modal-action mt-6">
              <button 
                className="btn btn-sm rounded-lg bg-[#ffd700] hover:bg-[#e6c200] text-black font-bold border-none transition-all duration-200"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
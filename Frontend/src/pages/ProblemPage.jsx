import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const navigate = useNavigate();

  const { handleSubmit } = useForm();

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/problem/ProblemById/${problemId}`);
      const problemData = response.data;

      setProblem(problemData);

      const matchedCode = problemData?.startCode?.find(
        (sc) => sc.language === selectedLanguage
      );

      setCode(matchedCode?.boilerplate || "");
    } catch (error) {
      console.error("Error fetching problem:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const matchedCode = problem?.startCode?.find(
        (sc) => sc.language === selectedLanguage
      );
      setCode(matchedCode?.boilerplate || "");
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setActiveRightTab("testcase");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setSubmitResult(response.data);
      setActiveRightTab("result");
      
      if (response.data.accepted) {
        await fetchProblem();
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult({
        accepted: false,
        error: "Submission failed",
        passedTestCases: 0,
        totalTestCases: 0,
      });
      setActiveRightTab("result");
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "c++":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-success bg-success/10 border-success/20";
      case "medium":
        return "text-warning bg-warning/10 border-warning/20";
      case "hard":
        return "text-error bg-error/10 border-error/20";
      default:
        return "text-base-content bg-base-200 border-base-300";
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-base-300 font-sans overflow-hidden">
      {/* Top Navbar specifically for IDE mode */}
      <div className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost btn-sm px-2 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Back to Problems"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="font-bold text-lg text-base-content tracking-tight flex items-center gap-2">
            CodeArena
            <span className="badge badge-sm badge-outline border-base-content/20 text-base-content/50">IDE</span>
          </span>
        </div>
        {problem && (
          <div className="hidden md:flex items-center gap-3 bg-base-200/50 px-4 py-1.5 rounded-full border border-base-300">
            <span className="text-sm font-semibold text-base-content/80 truncate max-w-[200px] lg:max-w-[400px]">
              {problem.title}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm ring-1 ring-primary/30">
            U
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
        
        {/* Left Panel - Information */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex px-2 pt-2 bg-base-200/50 border-b border-base-300 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "description", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", label: "Description" },
              { id: "editorial", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", label: "Editorial" },
              { id: "solutions", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5", label: "Solutions" },
              { id: "submissions", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", label: "Submissions" },
              { id: "chatAI", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z", label: "Chat AI" }
            ].map(tab => (
              <button
                key={tab.id}
                className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeLeftTab === tab.id 
                    ? "border-primary text-primary bg-base-100 rounded-t-lg shadow-[0_-2px_0_0_inset_oklch(var(--p))]" 
                    : "border-transparent text-base-content/60 hover:text-base-content hover:bg-base-200/50 rounded-t-lg"
                }`}
                onClick={() => setActiveLeftTab(tab.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-6">
                      <h1 className="text-3xl font-extrabold text-base-content tracking-tight mb-4">{problem.title}</h1>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${getDifficultyBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(problem.tags) ? problem.tags : problem.tags.split(',')).map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-md bg-base-200 text-base-content/70 text-xs font-medium capitalize border border-base-300">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-strong:text-base-content prose-code:text-base-content prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                      <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                        {problem.description}
                      </div>
                    </div>

                    <div className="mt-10">
                      <h3 className="text-lg font-bold text-base-content mb-5 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                        Examples
                      </h3>
                      <div className="space-y-6">
                        {problem.visibleTestCases?.map((example, index) => (
                          <div key={index} className="bg-base-200/50 border border-base-300 rounded-xl overflow-hidden">
                            <div className="bg-base-300/30 px-4 py-2 border-b border-base-300">
                              <h4 className="font-bold text-sm text-base-content/80">Example {index + 1}</h4>
                            </div>
                            <div className="p-4 space-y-3 text-sm font-mono text-base-content/90 leading-relaxed">
                              <div className="flex gap-2">
                                <span className="font-bold text-base-content select-none">Input:</span> 
                                <span className="text-primary/90 break-all">{example.input}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-base-content select-none">Output:</span> 
                                <span className="text-success/90 break-all">{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="flex gap-2 pt-2 border-t border-base-300/50 mt-2 font-sans text-[13px]">
                                  <span className="font-bold text-base-content/70 select-none">Explanation:</span> 
                                  <span className="text-base-content/70">{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === "editorial" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-base-content">Editorial Solution</h2>
                    <div className="bg-base-200/30 rounded-xl p-1">
                      <Editorial
                        secureUrl={problem.secureUrl}
                        thumbnailUrl={problem.thumbnailUrl}
                        duration={problem.duration}
                      />
                    </div>
                  </div>
                )}

                {activeLeftTab === "solutions" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-base-content flex items-center gap-2">
                      Reference Solutions
                    </h2>
                    <div className="space-y-6">
                      {problem.referenceSolution?.length ? (
                        problem.referenceSolution.map((solution, index) => (
                          <div key={index} className="border border-base-300 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-base-200 px-4 py-3 border-b border-base-300 flex justify-between items-center">
                              <h3 className="font-bold text-sm text-base-content/80 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                {solution.language.toUpperCase()} Solution
                              </h3>
                              <button 
                                className="btn btn-xs btn-ghost text-base-content/50 hover:text-base-content"
                                onClick={() => navigator.clipboard.writeText(solution.completeCode)}
                                title="Copy to clipboard"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                              </button>
                            </div>
                            <div className="bg-[#1e1e1e] p-4 overflow-x-auto custom-scrollbar">
                              <pre className="text-[13px] font-mono text-gray-300 leading-relaxed">
                                <code>{solution.completeCode}</code>
                              </pre>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-base-200/50 rounded-xl border border-base-300 border-dashed">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-base-content/30 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          <p className="text-base-content/60 font-medium max-w-xs">
                            Solutions are locked. Try solving the problem first to see official solutions!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLeftTab === "submissions" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-base-content">Submission History</h2>
                    <div className="bg-base-200/20 rounded-xl border border-base-300 p-2">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === "chatAI" && (
                  <div className="animate-in fade-in duration-300 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-base-content">AI Assistant</h2>
                    </div>
                    <div className="flex-1 bg-base-200/30 rounded-xl border border-base-300 overflow-hidden min-h-[400px]">
                      <ChatAi problem={problem} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Code & Output */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
          
          {/* Top Bar - Language Select & Actions */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-base-300 bg-base-200/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider hidden sm:inline">Language:</span>
              <select 
                className="select select-sm select-bordered bg-base-100 font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 rounded-lg min-w-[120px]"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-ghost text-base-content/70 hover:text-base-content px-2"
                title="Reset to default code"
                onClick={() => {
                  const matchedCode = problem?.startCode?.find(sc => sc.language === selectedLanguage);
                  setCode(matchedCode?.boilerplate || "");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-[300px] bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontSize: 14,
                lineHeight: 1.6,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 4,
                renderLineHighlight: "all",
                selectOnLineNumbers: true,
                roundedSelection: true,
                cursorStyle: "line",
                cursorBlinking: "smooth",
                mouseWheelZoom: true,
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                }
              }}
            />
          </div>

          {/* Bottom Panel - Output & Actions */}
          <div className="flex flex-col border-t border-base-300 bg-base-100 max-h-[40%] min-h-[50px] shrink-0 transition-all">
            
            {/* Bottom Tabs & Run Buttons */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-base-200 bg-base-200/30 flex-wrap gap-2">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: "testcase", label: "Testcases", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
                  { id: "result", label: "Test Result", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`btn btn-sm btn-ghost rounded-lg font-medium px-3 flex items-center gap-2 ${
                      activeRightTab === tab.id ? "bg-base-200/80 text-base-content" : "text-base-content/60"
                    }`}
                    onClick={() => setActiveRightTab(tab.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    {tab.label}
                    
                    {/* Show a dot indicator if there's a result available */}
                    {tab.id === "result" && (runResult || submitResult) && (
                      <span className={`w-2 h-2 rounded-full ${submitResult?.accepted || runResult?.success ? "bg-success" : "bg-error"}`}></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-sm btn-outline rounded-lg px-4 sm:px-6 border-base-300 hover:bg-base-200 hover:text-base-content hover:border-base-300 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  {loading && activeRightTab === "testcase" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-base-content/70">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  )}
                  Run Code
                </button>
                <button
                  className={`btn btn-sm btn-primary rounded-lg px-4 sm:px-6 font-semibold shadow-sm transition-all hover:shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  {loading && activeRightTab === "result" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                    </svg>
                  )}
                  Submit
                </button>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-base-100 min-h-[200px]">
              {activeRightTab === "testcase" && (
                <div className="animate-in fade-in duration-200 h-full">
                  {runResult ? (
                    <div className="max-w-4xl mx-auto">
                      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${
                        runResult.success 
                          ? "bg-success/5 border-success/20 text-success" 
                          : "bg-error/5 border-error/20 text-error"
                      } mb-6`}>
                        <div className={`p-2 rounded-full ${runResult.success ? "bg-success/20" : "bg-error/20"}`}>
                          {runResult.success ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold tracking-tight">
                            {runResult.success ? "Accepted" : "Wrong Answer"}
                          </h4>
                          <div className="flex gap-4 mt-1 text-sm font-medium opacity-80">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Runtime: {runResult.runtime}s
                            </span>
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-16.5V3m0 18v1.5m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>
                              Memory: {runResult.memory}KB
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {runResult.testCases?.map((tc, i) => (
                          <div key={i} className="bg-base-200/50 border border-base-300 rounded-xl overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between bg-base-200 px-4 py-2 border-b border-base-300">
                              <h5 className="font-semibold text-sm text-base-content/80 flex items-center gap-2">
                                Case {i + 1}
                                <span className={`w-2 h-2 rounded-full ${tc.status_id === 3 ? "bg-success" : "bg-error"}`}></span>
                              </h5>
                            </div>
                            <div className="p-4 space-y-4 font-mono text-[13px]">
                              <div>
                                <div className="text-base-content/50 font-semibold mb-1 uppercase text-[11px] tracking-wider">Input</div>
                                <div className="bg-base-100 p-3 rounded-lg border border-base-300 text-base-content break-all">
                                  {tc.stdin}
                                </div>
                              </div>
                              <div>
                                <div className="text-base-content/50 font-semibold mb-1 uppercase text-[11px] tracking-wider">Expected Output</div>
                                <div className="bg-base-100 p-3 rounded-lg border border-base-300 text-base-content break-all">
                                  {tc.expected_output}
                                </div>
                              </div>
                              <div>
                                <div className="text-base-content/50 font-semibold mb-1 uppercase text-[11px] tracking-wider">Your Output</div>
                                <div className={`p-3 rounded-lg border break-all ${
                                  tc.status_id === 3 
                                    ? "bg-success/5 border-success/20 text-base-content" 
                                    : "bg-error/5 border-error/20 text-error font-medium"
                                }`}>
                                  {tc.stdout || "No output"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/40 py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                      </svg>
                      <p className="font-medium text-lg text-base-content/60">Run your code to see test results</p>
                      <p className="text-sm mt-1">Results will appear here after execution</p>
                    </div>
                  )}
                </div>
              )}

              {activeRightTab === "result" && (
                <div className="animate-in fade-in duration-200 h-full">
                  {submitResult ? (
                    <div className="max-w-2xl mx-auto py-8">
                      <div className={`p-8 rounded-2xl border text-center shadow-sm ${
                        submitResult.accepted 
                          ? "bg-success/5 border-success/20" 
                          : "bg-error/5 border-error/20"
                      }`}>
                        <div className={`inline-flex p-4 rounded-full mb-4 ${
                          submitResult.accepted ? "bg-success/20 text-success" : "bg-error/20 text-error"
                        }`}>
                          {submitResult.accepted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${
                          submitResult.accepted ? "text-success" : "text-error"
                        }`}>
                          {submitResult.accepted ? "Success!" : submitResult.error}
                        </h2>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                          <div className="text-center">
                            <p className="text-base-content/50 text-xs font-bold uppercase tracking-wider mb-1">Test Cases</p>
                            <p className="text-2xl font-semibold text-base-content">
                              <span className={submitResult.accepted ? "text-success" : "text-error"}>
                                {submitResult.passedTestCases}
                              </span>
                              <span className="text-base-content/30 mx-1">/</span>
                              {submitResult.totalTestCases}
                            </p>
                          </div>
                          
                          <div className="w-px h-10 bg-base-300"></div>
                          
                          <div className="text-center">
                            <p className="text-base-content/50 text-xs font-bold uppercase tracking-wider mb-1">Runtime</p>
                            <p className="text-2xl font-semibold text-base-content">
                              {submitResult.runtime ? `${submitResult.runtime}s` : "—"}
                            </p>
                          </div>
                          
                          <div className="w-px h-10 bg-base-300"></div>
                          
                          <div className="text-center">
                            <p className="text-base-content/50 text-xs font-bold uppercase tracking-wider mb-1">Memory</p>
                            <p className="text-2xl font-semibold text-base-content">
                              {submitResult.memory ? `${submitResult.memory}KB` : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/40 py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                      </svg>
                      <p className="font-medium text-lg text-base-content/60">Submit your code for evaluation</p>
                      <p className="text-sm mt-1">Your solution will be tested against hidden test cases</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
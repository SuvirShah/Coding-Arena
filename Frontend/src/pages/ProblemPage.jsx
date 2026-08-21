import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router";
import { useGetProblemByIdQuery, useRunCodeMutation, useSubmitCodeMutation } from "./apiSlice";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";

const ProblemPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("testcase");
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const navigate = useNavigate();

  const { data: problem, isLoading: isFetchingProblem } = useGetProblemByIdQuery(problemId);
  const [runCode, { isLoading: isRunning }] = useRunCodeMutation();
  const [submitCodeMutation, { isLoading: isSubmitting }] = useSubmitCodeMutation();

  const loading = isRunning || isSubmitting;

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

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom warm dark theme for Monaco to match #110f0d
    monaco.editor.defineTheme("codearena-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a6252", fontStyle: "italic" },
        { token: "keyword", foreground: "ffd700" },
        { token: "number", foreground: "f5a623" },
        { token: "string", foreground: "86efac" },
        { token: "identifier", foreground: "f0f0f0" },
      ],
      colors: {
        "editor.background": "#110f0d",
        "editor.foreground": "#f0f0f0",
        "editorLineNumber.foreground": "#504432",
        "editorLineNumber.activeForeground": "#ffd700",
        "editor.lineHighlightBackground": "#1c1915",
        "editor.selectionBackground": "#382e1e",
        "editorCursor.foreground": "#ffd700",
      },
    });
    monaco.editor.setTheme("codearena-dark");
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setRunResult(null);

    try {
      const result = await runCode({ problemId, code, language: selectedLanguage }).unwrap();
      setRunResult(result);
      setActiveRightTab("testcase");

      // Auto-focus on first failing test case if any, otherwise 0
      if (result.testCases && result.testCases.length > 0) {
        const firstFailIdx = result.testCases.findIndex((tc) => tc.status_id !== 3);
        setSelectedTestCaseIndex(firstFailIdx !== -1 ? firstFailIdx : 0);
      } else {
        setSelectedTestCaseIndex(0);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setSubmitResult(null);

    try {
      const result = await submitCodeMutation({ problemId, code, language: selectedLanguage }).unwrap();
      setSubmitResult(result);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult({
        accepted: false,
        error: "Submission failed",
        passedTestCases: 0,
        totalTestCases: 0,
      });
      setActiveRightTab("result");
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
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-[#f0f0f0] bg-[#110f0d] border-[#382e1e]";
    }
  };

  if (isFetchingProblem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0c0b0a]">
        <span className="loading loading-spinner loading-lg text-[#ffd700]"></span>
      </div>
    );
  }

  // Active test cases data (either from runResult if executed, or from problem.visibleTestCases)
  const currentTestCases = runResult?.testCases || problem?.visibleTestCases || [];
  const activeTC = currentTestCases[selectedTestCaseIndex] || currentTestCases[0];

  return (
    <div className="h-screen flex flex-col bg-[#0c0b0a] text-[#f0f0f0] font-sans overflow-hidden selection:bg-[#ffd700]/30 selection:text-white">
      {/* Top Navbar */}
      <div className="h-14 bg-[#181614] border-b border-[#382e1e] flex items-center justify-between px-4 shrink-0 shadow-md z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost btn-sm text-sm font-semibold text-[#a09a8e] hover:text-[#ffd700] hover:bg-[#26221d] normal-case rounded-lg transition-all duration-200 flex items-center gap-1.5"
            title="Back to Problems"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Problem List
          </button>

          <span className="font-extrabold text-lg text-[#ffd700] tracking-tight flex items-center gap-2 ml-2">
            CodeArena
            <span className="badge badge-sm bg-[#26221d] border border-[#382e1e] text-[#a09a8e] font-mono text-[10px]">
              IDE
            </span>
          </span>
        </div>

        {problem && (
          <div className="hidden md:flex items-center gap-3 bg-[#110f0d] px-4 py-1.5 rounded-full border border-[#382e1e] shadow-inner">
            <span className="text-sm font-semibold text-[#f0f0f0] truncate max-w-[200px] lg:max-w-[400px]">
              {problem.title}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${getDifficultyBadge(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/visualizer")}
            className="btn btn-ghost btn-sm text-xs font-semibold text-[#a09a8e] hover:text-[#ffd700] hover:bg-[#26221d] rounded-lg transition-all duration-200"
          >
            🧠 Visualizer
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden bg-[#0c0b0a]">
        
        {/* Left Panel - Problem Details, Editorial, Submissions, Chat */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-[#181614] rounded-xl border border-[#382e1e] shadow-lg overflow-hidden">
          {/* Left Tabs */}
          <div className="flex px-2 pt-2 bg-[#110f0d] border-b border-[#382e1e] overflow-x-auto no-scrollbar shrink-0 gap-1">
            {[
              { id: "description", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", label: "Description" },
              { id: "editorial", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", label: "Editorial" },
              { id: "solutions", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5", label: "Solutions" },
              { id: "submissions", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", label: "Submissions" },
              { id: "chatAI", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z", label: "Chat AI" }
            ].map(tab => (
              <button
                key={tab.id}
                className={`px-3.5 py-2 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 rounded-t-lg ${
                  activeLeftTab === tab.id 
                    ? "bg-[#181614] text-[#ffd700] border-t-2 border-x border-[#382e1e] border-t-[#ffd700]" 
                    : "text-[#a09a8e] hover:text-[#f0f0f0] hover:bg-[#26221d]/50"
                }`}
                onClick={() => setActiveLeftTab(tab.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar bg-[#181614]">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <div className="animate-in fade-in duration-200">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f0f0f0] tracking-tight mb-3">
                        {problem.title}
                      </h1>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize border ${getDifficultyBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(problem.tags) ? problem.tags : problem.tags.split(',')).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-[#110f0d] text-[#a09a8e] text-xs font-medium capitalize border border-[#382e1e]">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-[#f0f0f0]/90 leading-relaxed text-[14px] sm:text-[15px]">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {problem.description}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-base font-bold text-[#f0f0f0] mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#ffd700]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                        Examples
                      </h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases?.map((example, index) => (
                          <div key={index} className="bg-[#110f0d] border border-[#382e1e] rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-[#26221d]/40 px-4 py-2 border-b border-[#382e1e] flex items-center justify-between">
                              <h4 className="font-bold text-xs text-[#a09a8e] uppercase tracking-wider">Example {index + 1}</h4>
                            </div>
                            <div className="p-4 space-y-2.5 text-xs sm:text-sm font-mono text-[#f0f0f0] leading-relaxed">
                              <div className="flex gap-2">
                                <span className="font-bold text-[#a09a8e] select-none min-w-[65px]">Input:</span> 
                                <span className="text-[#ffd700] break-all">{example.input}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-[#a09a8e] select-none min-w-[65px]">Output:</span> 
                                <span className="text-emerald-400 break-all">{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="flex gap-2 pt-2 border-t border-[#382e1e]/60 mt-2 font-sans text-xs">
                                  <span className="font-bold text-[#a09a8e] select-none min-w-[65px]">Explanation:</span> 
                                  <span className="text-[#a09a8e]">{example.explanation}</span>
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
                  <div className="animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold mb-4 text-[#f0f0f0]">Editorial Video Solution</h2>
                    <div className="bg-[#110f0d] border border-[#382e1e] rounded-xl p-3 shadow-md">
                      <Editorial
                        secureUrl={problem.secureUrl}
                        thumbnailUrl={problem.thumbnailUrl}
                        duration={problem.duration}
                      />
                    </div>
                  </div>
                )}

                {activeLeftTab === "solutions" && (
                  <div className="animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold mb-4 text-[#f0f0f0] flex items-center gap-2">
                      Reference Solutions
                    </h2>
                    <div className="space-y-4">
                      {problem.referenceSolution?.length ? (
                        problem.referenceSolution.map((solution, index) => (
                          <div key={index} className="border border-[#382e1e] rounded-xl overflow-hidden shadow-md">
                            <div className="bg-[#26221d] px-4 py-2.5 border-b border-[#382e1e] flex justify-between items-center">
                              <h3 className="font-bold text-xs text-[#ffd700] flex items-center gap-2 uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[#ffd700]"></span>
                                {solution.language} Solution
                              </h3>
                              <button 
                                className="btn btn-xs btn-ghost text-[#a09a8e] hover:text-[#ffd700] rounded-md transition-colors"
                                onClick={() => navigator.clipboard.writeText(solution.completeCode)}
                                title="Copy code"
                              >
                                Copy
                              </button>
                            </div>
                            <div className="bg-[#110f0d] p-4 overflow-x-auto custom-scrollbar">
                              <pre className="text-xs sm:text-sm font-mono text-[#f0f0f0] leading-relaxed">
                                <code>{solution.completeCode}</code>
                              </pre>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#110f0d] rounded-xl border border-[#382e1e] border-dashed p-6">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#a09a8e]/40 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          <p className="text-[#a09a8e] font-medium text-sm max-w-xs">
                            Solutions are locked. Try solving the problem first to see official solutions!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLeftTab === "submissions" && (
                  <div className="animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold mb-4 text-[#f0f0f0]">Submission History</h2>
                    <div className="bg-[#110f0d] rounded-xl border border-[#382e1e] p-2">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === "chatAI" && (
                  <div className="animate-in fade-in duration-200 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-[#ffd700]/20 p-2 rounded-lg text-[#ffd700]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-[#f0f0f0]">AI Problem Assistant</h2>
                    </div>
                    <div className="flex-1 bg-[#110f0d] rounded-xl border border-[#382e1e] overflow-hidden min-h-[400px]">
                      <ChatAi problem={problem} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor & Execution Results */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col bg-[#181614] rounded-xl border border-[#382e1e] shadow-lg overflow-hidden">
          
          {/* Top Bar - Language Select & Actions */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-[#382e1e] bg-[#110f0d]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#a09a8e] uppercase tracking-wider hidden sm:inline">Language:</span>
              <select 
                className="select select-sm bg-[#181614] text-[#f0f0f0] border border-[#382e1e] font-medium focus:outline-none focus:ring-1 focus:ring-[#ffd700] rounded-lg min-w-[120px] transition-colors"
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
                className="btn btn-sm btn-ghost text-[#a09a8e] hover:text-[#ffd700] hover:bg-[#26221d] rounded-lg px-2.5 transition-all duration-200"
                title="Reset to default code"
                onClick={() => {
                  const matchedCode = problem?.startCode?.find(sc => sc.language === selectedLanguage);
                  setCode(matchedCode?.boilerplate || "");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Reset
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[280px] bg-[#110f0d]">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
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
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
                selectOnLineNumbers: true,
                roundedSelection: true,
                cursorStyle: "line",
                cursorBlinking: "smooth",
                mouseWheelZoom: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                }
              }}
            />
          </div>

          {/* Bottom Panel - LeetCode-Style Execution Results & Controls */}
          <div className="flex flex-col border-t border-[#382e1e] bg-[#181614] h-[45%] min-h-[220px] max-h-[50%] shrink-0 transition-all">
            
            {/* Action Bar with Tabs and Run/Submit Buttons */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#382e1e] bg-[#110f0d] flex-wrap gap-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  className={`btn btn-sm rounded-lg font-semibold px-3.5 flex items-center gap-2 transition-all duration-200 ${
                    activeRightTab === "testcase"
                      ? "bg-[#26221d] text-[#ffd700] border border-[#382e1e]"
                      : "btn-ghost text-[#a09a8e] hover:text-[#f0f0f0] hover:bg-[#26221d]/50"
                  }`}
                  onClick={() => setActiveRightTab("testcase")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  Testcases
                  {runResult && (
                    <span className={`w-2 h-2 rounded-full ${runResult.success ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                  )}
                </button>

                <button
                  className={`btn btn-sm rounded-lg font-semibold px-3.5 flex items-center gap-2 transition-all duration-200 ${
                    activeRightTab === "result"
                      ? "bg-[#26221d] text-[#ffd700] border border-[#382e1e]"
                      : "btn-ghost text-[#a09a8e] hover:text-[#f0f0f0] hover:bg-[#26221d]/50"
                  }`}
                  onClick={() => setActiveRightTab("result")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submission Result
                  {submitResult && (
                    <span className={`w-2 h-2 rounded-full ${submitResult.accepted ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  className={`btn btn-sm rounded-lg px-4 sm:px-5 font-semibold bg-[#26221d] hover:bg-[#382e1e] text-[#f0f0f0] border border-[#382e1e] shadow-sm transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  {loading && activeRightTab === "testcase" ? (
                    <span className="loading loading-spinner loading-xs text-[#ffd700]"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#ffd700]">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  )}
                  Run
                </button>
                <button
                  className={`btn btn-sm rounded-lg px-5 sm:px-6 font-bold bg-[#ffd700] hover:bg-[#e6c200] text-black shadow-md transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  {loading && activeRightTab === "result" ? (
                    <span className="loading loading-spinner loading-xs text-black"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                    </svg>
                  )}
                  Submit
                </button>
              </div>
            </div>

            {/* Testcase & Execution Results Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#181614]">
              {activeRightTab === "testcase" && (
                <div className="animate-in fade-in duration-200 h-full flex flex-col">
                  {/* Status & Metrics Header if code has been run */}
                  {runResult && (
                    <div className="mb-4 pb-3 border-b border-[#382e1e]/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-lg sm:text-xl font-extrabold ${runResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                          {runResult.success ? "Accepted" : "Wrong Answer"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {runResult.runtime !== undefined && (
                          <div className="bg-[#110f0d] border border-[#382e1e] px-3 py-1 rounded-full text-xs font-mono text-[#a09a8e] flex items-center gap-1.5 shadow-inner">
                            <span className="text-[#a09a8e]/60 font-sans">Runtime:</span>
                            <span className="text-[#f0f0f0] font-semibold">
                              {runResult.runtime ? `${Math.round(runResult.runtime * 1000)} ms` : "0 ms"}
                            </span>
                          </div>
                        )}
                        {runResult.memory !== undefined && (
                          <div className="bg-[#110f0d] border border-[#382e1e] px-3 py-1 rounded-full text-xs font-mono text-[#a09a8e] flex items-center gap-1.5 shadow-inner">
                            <span className="text-[#a09a8e]/60 font-sans">Memory:</span>
                            <span className="text-[#f0f0f0] font-semibold">
                              {runResult.memory >= 1024 ? `${(runResult.memory / 1024).toFixed(1)} MB` : `${runResult.memory} KB`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Case Pill Selector */}
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                    {currentTestCases.map((tc, idx) => {
                      const isSelected = selectedTestCaseIndex === idx;
                      const hasStatus = runResult && tc.status_id !== undefined;
                      const isPassed = tc.status_id === 3;

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedTestCaseIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 border ${
                            isSelected
                              ? "bg-[#26221d] text-[#ffd700] border-[#ffd700]/50 shadow-sm"
                              : "bg-[#110f0d] text-[#a09a8e] border-[#382e1e] hover:border-[#ffd700]/30 hover:text-[#f0f0f0]"
                          }`}
                        >
                          {hasStatus && (
                            <span className={`w-2 h-2 rounded-full ${isPassed ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                          )}
                          Case {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Case Details in Monospace Terminal Style */}
                  {activeTC ? (
                    <div className="space-y-3 flex-1">
                      {/* Input Block */}
                      <div>
                        <div className="text-[11px] font-bold text-[#a09a8e] uppercase tracking-wider mb-1">
                          Input
                        </div>
                        <div className="bg-[#110f0d] border border-[#382e1e] rounded-lg p-3 font-mono text-xs sm:text-sm text-[#f0f0f0] whitespace-pre-wrap select-all leading-relaxed shadow-inner">
                          {activeTC.stdin || activeTC.input || "No input"}
                        </div>
                      </div>

                      {/* Output (Your Output) Block if code has been run */}
                      {runResult && (
                        <div>
                          <div className="text-[11px] font-bold text-[#a09a8e] uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Output</span>
                            {activeTC.status_id === 3 ? (
                              <span className="text-emerald-400 text-[11px] font-semibold lowercase">matches expected</span>
                            ) : (
                              <span className="text-rose-400 text-[11px] font-semibold lowercase">mismatch</span>
                            )}
                          </div>
                          <div className={`bg-[#110f0d] border rounded-lg p-3 font-mono text-xs sm:text-sm whitespace-pre-wrap select-all leading-relaxed shadow-inner ${
                            activeTC.status_id === 3
                              ? "border-[#382e1e] text-[#f0f0f0]"
                              : "border-rose-500/40 text-rose-300 bg-rose-950/10"
                          }`}>
                            {activeTC.stdout || "No output returned"}
                          </div>
                        </div>
                      )}

                      {/* Expected Output Block */}
                      <div>
                        <div className="text-[11px] font-bold text-[#a09a8e] uppercase tracking-wider mb-1">
                          Expected
                        </div>
                        <div className="bg-[#110f0d] border border-[#382e1e] rounded-lg p-3 font-mono text-xs sm:text-sm text-[#f0f0f0] whitespace-pre-wrap select-all leading-relaxed shadow-inner">
                          {activeTC.expected_output || activeTC.output || "No expected output"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-[#a09a8e]">
                      <p className="text-sm">No test cases available.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submission Result Tab */}
              {activeRightTab === "result" && (
                <div className="animate-in fade-in duration-200 h-full flex flex-col justify-center">
                  {submitResult ? (
                    <div className="max-w-2xl mx-auto w-full py-4 space-y-6">
                      {/* Status Banner */}
                      <div className={`p-6 rounded-xl border text-center shadow-lg ${
                        submitResult.accepted
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-950/20 border-rose-500/30 text-rose-400"
                      }`}>
                        <div className="inline-flex p-3 rounded-full mb-3 bg-[#110f0d] border border-current shadow-md">
                          {submitResult.accepted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-emerald-400">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-rose-400">
                              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                          {submitResult.accepted ? "Accepted" : submitResult.error || "Wrong Answer"}
                        </h2>
                        <p className="text-xs text-[#a09a8e]">
                          {submitResult.accepted ? "Congratulations! All test cases passed successfully." : "Your code did not pass all hidden test cases."}
                        </p>

                        {/* Metric Badges Grid */}
                        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#382e1e]/60">
                          <div className="bg-[#110f0d] border border-[#382e1e] p-3 rounded-lg text-center shadow-inner">
                            <p className="text-[#a09a8e] text-[10px] font-bold uppercase tracking-wider mb-0.5">Test Cases</p>
                            <p className="text-base sm:text-lg font-bold text-[#f0f0f0]">
                              <span className={submitResult.accepted ? "text-emerald-400" : "text-rose-400"}>
                                {submitResult.passedTestCases}
                              </span>
                              <span className="text-[#a09a8e]/40 mx-1">/</span>
                              {submitResult.totalTestCases}
                            </p>
                          </div>

                          <div className="bg-[#110f0d] border border-[#382e1e] p-3 rounded-lg text-center shadow-inner">
                            <p className="text-[#a09a8e] text-[10px] font-bold uppercase tracking-wider mb-0.5">Runtime</p>
                            <p className="text-base sm:text-lg font-bold text-[#ffd700]">
                              {submitResult.runtime !== undefined ? `${Math.round(submitResult.runtime * 1000)} ms` : "—"}
                            </p>
                          </div>

                          <div className="bg-[#110f0d] border border-[#382e1e] p-3 rounded-lg text-center shadow-inner">
                            <p className="text-[#a09a8e] text-[10px] font-bold uppercase tracking-wider mb-0.5">Memory</p>
                            <p className="text-base sm:text-lg font-bold text-[#f5a623]">
                              {submitResult.memory !== undefined ? (submitResult.memory >= 1024 ? `${(submitResult.memory / 1024).toFixed(1)} MB` : `${submitResult.memory} KB`) : "—"}
                            </p>
                          </div>
                        </div>

                        {/* Error output details if available */}
                        {submitResult.error && !submitResult.accepted && (
                          <div className="mt-4 text-left">
                            <div className="text-[10px] font-bold text-[#a09a8e] uppercase tracking-wider mb-1">Error Details</div>
                            <div className="bg-[#110f0d] border border-rose-500/30 text-rose-300 p-3 rounded-lg font-mono text-xs overflow-x-auto select-all">
                              {submitResult.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#a09a8e]/50 py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-3 opacity-40 text-[#ffd700]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                      </svg>
                      <p className="font-semibold text-base text-[#f0f0f0]">Submit your code for evaluation</p>
                      <p className="text-xs mt-1 text-[#a09a8e]">Your solution will be tested against hidden test cases</p>
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
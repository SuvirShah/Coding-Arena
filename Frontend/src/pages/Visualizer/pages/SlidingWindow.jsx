import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateSlidingWindowFrames } from "../utils/algorithmUtils";

export default function SlidingWindow() {
  const [array, setArray] = useState([2, 1, 5, 1, 3, 2, 8, 4, 3]);
  const [originalArray, setOriginalArray] = useState([2, 1, 5, 1, 3, 2, 8, 4, 3]);
  const [windowSize, setWindowSize] = useState("");
  const [arrayInput, setArrayInput] = useState("2, 1, 5, 1, 3, 2, 8, 4, 3");
  const [algorithm, setAlgorithm] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [complete, setComplete] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const timeoutRef = useRef(null);

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setComplete(false);
    setAlgorithm([]);
    setCurrentFrame(null);
    setArray([...originalArray]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const parseArrayInput = () => {
    const parsed = arrayInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (parsed.length === 0) return;
    setArray([...parsed]);
    setOriginalArray([...parsed]);
    resetVisualization();
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 7;
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 15 + 1));
    setArray(newArr);
    setOriginalArray(newArr);
    setArrayInput(newArr.join(", "));
    resetVisualization();
  };

  const startVisualization = () => {
    if (!windowSize || isNaN(parseInt(windowSize))) return;
    const k = parseInt(windowSize);
    if (algorithm.length === 0) {
      const frames = generateSlidingWindowFrames(originalArray, k);
      setAlgorithm(frames);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const executeStep = (step) => {
    setCurrentFrame(step);
    if (step.type === "completed" || step.type === "error") {
      setComplete(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStep < algorithm.length) {
      timeoutRef.current = setTimeout(() => {
        executeStep(algorithm[currentStep]);
        setCurrentStep((prev) => prev + 1);
      }, speed);
    } else if (currentStep >= algorithm.length) {
      setIsPlaying(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentStep, algorithm, speed]);

  const nextStep = () => {
    if (algorithm.length === 0) {
      if (!windowSize || isNaN(parseInt(windowSize))) return;
      const frames = generateSlidingWindowFrames(originalArray, parseInt(windowSize));
      setAlgorithm(frames);
      executeStep(frames[0]);
      setCurrentStep(1);
      return;
    }
    if (currentStep < algorithm.length) {
      executeStep(algorithm[currentStep]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep <= 1) {
      setCurrentStep(0);
      setCurrentFrame(null);
      setComplete(false);
      return;
    }
    const newStep = currentStep - 2;
    setCurrentStep(currentStep - 1);
    setCurrentFrame(algorithm[newStep]);
    setComplete(false);
  };

  const getBlockStyle = (index) => {
    if (!currentFrame) return "bg-slate-800/50 border-slate-700 text-slate-300";

    const { windowStart, windowEnd, maxStart, addedIndex, removedIndex, type } = currentFrame;
    const k = parseInt(windowSize) || 0;
    const maxEnd = maxStart + k - 1;

    if (type === "completed" && index >= maxStart && index <= maxEnd) {
      return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 ring-2 ring-emerald-400 z-10";
    }
    if (index === addedIndex && addedIndex >= 0) {
      return "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110 ring-2 ring-amber-400 z-10";
    }
    if (index === removedIndex && removedIndex >= 0) {
      return "bg-rose-500/10 border-rose-500/30 text-rose-500/50 scale-95 opacity-50";
    }
    if (index >= windowStart && index <= windowEnd && windowStart >= 0) {
      return "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10";
    }
    if (index >= maxStart && index <= maxEnd && maxStart >= 0) {
      return "bg-emerald-500/10 border-emerald-400/50 text-emerald-300 ring-2 ring-emerald-400/50";
    }
    return "bg-slate-800/50 border-slate-700 text-slate-300";
  };

  const getPointerLabel = (index) => {
    if (!currentFrame) return null;
    const { windowStart, windowEnd, addedIndex, removedIndex } = currentFrame;
    const labels = [];
    if (index === addedIndex && addedIndex >= 0) labels.push({ text: "+", color: "text-amber-400 bg-amber-500/20 border border-amber-500/30" });
    if (index === removedIndex && removedIndex >= 0) labels.push({ text: "−", color: "text-rose-400 bg-rose-500/20 border border-rose-500/30" });
    if (index === windowStart && windowStart >= 0) labels.push({ text: "W₁", color: "text-blue-400 bg-blue-500/20 border border-blue-500/30" });
    if (index === windowEnd && windowEnd >= 0 && windowEnd !== windowStart) labels.push({ text: "W₂", color: "text-blue-400 bg-blue-500/20 border border-blue-500/30" });
    return labels;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-10 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-full flex justify-start mb-4">
            <Link to={"/visualizer"} className="inline-flex items-center text-slate-400 hover:text-blue-400 font-medium transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 hover:border-blue-500/30 backdrop-blur-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
            Sliding Window Visualizer
          </h1>
          <p className="text-lg text-slate-400 font-light max-w-2xl">
            Watch how the Sliding Window technique finds the maximum sum subarray of size K in O(n) time.
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">⚙️ Configuration</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Array (comma-separated)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600"
                  placeholder="e.g. 2, 1, 5, 1, 3, 2"
                />
                <button onClick={parseArrayInput} className="px-5 py-3 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 rounded-xl font-semibold transition-all">
                  Set Array
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Window Size K</label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600"
                placeholder="Enter window size"
                min={1}
                max={array.length}
              />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button onClick={startVisualization} disabled={isPlaying || complete || !windowSize} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold flex items-center justify-center min-w-[120px]">
              {algorithm.length === 0 ? "▶ Start" : "▶ Resume"}
            </button>
            <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 border border-amber-500/30 rounded-xl transition-all font-semibold min-w-[120px]">
              ⏸ Pause
            </button>
            <button onClick={prevStep} disabled={isPlaying || currentStep <= 0} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl transition-all font-semibold">
              ⏪ Prev
            </button>
            <button onClick={nextStep} disabled={isPlaying || (algorithm.length > 0 && currentStep >= algorithm.length)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl transition-all font-semibold">
              Next ⏩
            </button>
            <button onClick={resetVisualization} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-semibold">
              ↺ Reset
            </button>
            <button onClick={generateRandomArray} disabled={isPlaying} className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-400 border border-purple-500/30 rounded-xl transition-all font-semibold">
              🎲 Random Array
            </button>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>Animation Speed</span>
              <span className="font-mono">{speed}ms</span>
            </div>
            <input type="range" min={200} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full sm:w-48 accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8 text-center">
            {currentFrame ? `Step ${currentStep} of ${algorithm.length}` : "Array Visualization"}
          </h3>

          <div className="flex justify-center items-end gap-3 sm:gap-4 flex-wrap z-10 w-full">
            {array.map((value, index) => {
              const labels = getPointerLabel(index);
              return (
                <div key={index} className="flex flex-col items-center group">
                  {/* Pointer labels above */}
                  <div className="h-8 flex gap-1 items-end mb-2">
                    {labels && labels.map((l, li) => (
                      <span key={li} className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${l.color}`}>
                        {l.text}
                      </span>
                    ))}
                  </div>
                  {/* Block */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 ${getBlockStyle(index)} group-hover:scale-105`}>
                    {value}
                  </div>
                  {/* Index */}
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">[{index}]</div>
                </div>
              );
            })}
          </div>

          {/* Window bracket indicator */}
          {currentFrame && currentFrame.windowStart >= 0 && (
            <div className="mt-8 flex justify-center w-full">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl px-6 py-3 text-sm flex items-center gap-3">
                <span className="font-semibold text-blue-400 tracking-wider uppercase text-xs">Current Window:</span>
                <span className="text-blue-300 font-mono text-lg tracking-widest">[{array.slice(currentFrame.windowStart, currentFrame.windowEnd + 1).join(", ")}]</span>
                <span className="text-blue-400 font-bold ml-2 text-xl">= {currentFrame.currentSum}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Live Stats & Status */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Window</div>
                <div className="text-2xl font-bold text-slate-200">
                  {currentFrame ? `[${currentFrame.windowStart}..${currentFrame.windowEnd}]` : "—"}
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider mb-1">Current Sum</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame ? currentFrame.currentSum : "—"}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">Max Sum</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame ? currentFrame.maxSum : "—"}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg flex flex-col justify-center">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Phase</div>
                <div className="text-lg font-bold text-slate-200">
                  {currentFrame?.type === "build_window" ? "Building 🔨" : currentFrame?.type === "window_ready" ? "Ready ✅" : currentFrame?.type === "slide" ? "Sliding ➡️" : currentFrame?.type === "new_max" ? "New Max 🏆" : currentFrame?.type === "completed" ? "Done ✅" : "—"}
                </div>
              </div>
            </div>

            {/* Status Box */}
            <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${currentFrame?.type === "completed" ? "bg-emerald-500/10 border-emerald-500/30"
                : currentFrame?.type === "new_max" ? "bg-amber-500/10 border-amber-500/30"
                  : currentFrame?.type === "error" ? "bg-rose-500/10 border-rose-500/30"
                    : currentFrame?.type === "build_window" ? "bg-violet-500/10 border-violet-500/30"
                      : "bg-slate-900/50 border-slate-800 backdrop-blur-xl"
              }`}>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">💬 Live Algorithm Status</h3>
              {currentFrame ? (
                <p className={`text-lg pt-0.5 leading-relaxed font-medium ${currentFrame.type === "completed" ? "text-emerald-400"
                    : currentFrame.type === "new_max" ? "text-amber-400"
                      : currentFrame.type === "error" ? "text-rose-400"
                        : "text-blue-400"
                  }`}>
                  {currentFrame.description}
                </p>
              ) : (
                <p className="text-slate-500 italic">Press Start to begin the visualization.</p>
              )}
            </div>

          </div>

          {/* Legend & Docs */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Color Legend</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500/20 border-2 border-blue-400 rounded"></div>
                  <span className="text-slate-300 text-sm font-medium">Active Window</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-amber-500/20 border-2 border-amber-400 rounded"></div>
                  <span className="text-slate-300 text-sm font-medium">Element Being Added</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-rose-500/10 border-2 border-rose-500/30 rounded opacity-50"></div>
                  <span className="text-slate-500 text-sm font-medium">Element Being Removed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-emerald-500/20 border-2 border-emerald-400 rounded"></div>
                  <span className="text-slate-300 text-sm font-medium">Best Window (Final)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">📖 Algorithm Details</h3>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <strong className="text-violet-400 block mb-0.5">Slide & Track</strong>
                  Move window one position right: subtract leftmost, add next element.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <strong className="text-amber-400 block mb-0.5">Time Complexity</strong>
                  O(n) — Each slide is O(1) by reusing previous sum.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <strong className="text-purple-400 block mb-0.5">Space Complexity</strong>
                  O(1) — Only keeps track of pointers and sums.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

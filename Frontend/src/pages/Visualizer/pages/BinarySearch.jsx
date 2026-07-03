import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateBinarySearchFrames } from "../utils/algorithmUtils";

export default function BinarySearch() {
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]);
  const [originalArray, setOriginalArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]);
  const [target, setTarget] = useState("");
  const [arrayInput, setArrayInput] = useState("2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91");
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
    const sorted = [...parsed].sort((a, b) => a - b);
    setArray(sorted);
    setOriginalArray(sorted);
    setArrayInput(sorted.join(", "));
    resetVisualization();
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 6;
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 99 + 1));
    const sorted = [...new Set(newArr)].sort((a, b) => a - b);
    setArray(sorted);
    setOriginalArray(sorted);
    setArrayInput(sorted.join(", "));
    resetVisualization();
  };

  const startVisualization = () => {
    if (!target || isNaN(parseInt(target))) return;
    const t = parseInt(target);
    if (algorithm.length === 0) {
      const frames = generateBinarySearchFrames(originalArray, t);
      setAlgorithm(frames);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const executeStep = (step) => {
    setCurrentFrame(step);
    if (step.type === "found" || step.type === "not_found") {
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
      if (!target || isNaN(parseInt(target))) return;
      const frames = generateBinarySearchFrames(originalArray, parseInt(target));
      setAlgorithm(frames);
      setCurrentStep(0);
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

    const { left, right, mid, found, eliminated = [] } = currentFrame;

    if (found && index === mid) {
      return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 ring-2 ring-emerald-400 z-10";
    }
    if (eliminated.includes(index)) {
      return "bg-slate-900/40 border-slate-800 text-slate-600 opacity-40 scale-95";
    }
    if (index === mid) {
      return "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110 ring-2 ring-amber-400 z-10";
    }
    if (index === left) {
      return "bg-blue-500/20 border-blue-400 text-blue-300 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10";
    }
    if (index === right) {
      return "bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] z-10";
    }
    if (index > left && index < right) {
      return "bg-indigo-500/10 border-indigo-400/50 text-indigo-300";
    }
    return "bg-slate-800/50 border-slate-700 text-slate-300";
  };

  const getPointerLabel = (index) => {
    if (!currentFrame) return null;
    const { left, right, mid, found } = currentFrame;
    const labels = [];
    if (index === left) labels.push({ text: "L", color: "text-blue-400 bg-blue-500/20 border border-blue-500/30" });
    if (index === right) labels.push({ text: "R", color: "text-rose-400 bg-rose-500/20 border border-rose-500/30" });
    if (index === mid) labels.push({ text: found ? "✓" : "M", color: found ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30" : "text-amber-400 bg-amber-500/20 border border-amber-500/30" });
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
                Binary Search
            </h1>
            <p className="text-lg text-slate-400 font-light max-w-2xl">
                Watch how Binary Search efficiently finds elements by halving the search space at each step.
            </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">⚙️ Configuration</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Sorted Array (comma-separated)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600"
                  placeholder="e.g. 1, 3, 5, 7, 9"
                />
                <button onClick={parseArrayInput} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  Set Array
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Target Value</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600"
                placeholder="Enter target number"
              />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button onClick={startVisualization} disabled={isPlaying || complete || !target} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold flex items-center justify-center min-w-[120px]">
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
              <input type="range" min={200} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full sm:w-48 accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"/>
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
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Live Stats & Status */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Left Index</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame ? currentFrame.left : "—"}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider mb-1">Right Index</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame ? currentFrame.right : "—"}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Mid Index</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame && currentFrame.mid >= 0 ? currentFrame.mid : "—"}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">Checking Value</div>
                <div className="text-2xl font-bold text-slate-200">{currentFrame && currentFrame.checkingValue !== null ? currentFrame.checkingValue : "—"}</div>
              </div>
            </div>

            {/* Status Box */}
            <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
                currentFrame?.found
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : currentFrame?.type === "not_found"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-slate-900/50 border-slate-800 backdrop-blur-xl"
            }`}>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">💬 Live Algorithm Status</h3>
                {currentFrame ? (
                    <div className="space-y-4">
                        <p className={`text-lg pt-0.5 leading-relaxed font-medium ${
                            currentFrame.found ? "text-emerald-400" : currentFrame.type === "not_found" ? "text-red-400" : "text-slate-200"
                        }`}>
                            {currentFrame.description}
                        </p>
                        {(currentFrame.found || currentFrame.type === "not_found") && (
                            <div className={`mt-6 p-4 border rounded-2xl flex items-center gap-4 ${
                                currentFrame.found ? "bg-emerald-500/20 border-emerald-500/30" : "bg-red-500/20 border-red-500/30"
                            }`}>
                                <div className="text-3xl">{currentFrame.found ? "🎉" : "❌"}</div>
                                <div>
                                    <p className={`font-bold text-lg ${currentFrame.found ? "text-emerald-400" : "text-red-400"}`}>
                                        {currentFrame.found ? "Target Found!" : "Target Not Found"}
                                    </p>
                                    <p className={`text-sm mt-1 ${currentFrame.found ? "text-emerald-500/80" : "text-red-500/80"}`}>
                                        {currentFrame.found ? `The target value ${target} is at index ${currentFrame.mid}.` : `The target value ${target} does not exist in the array.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <span className="text-slate-300 text-sm font-medium">Left Pointer</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-rose-500/20 border-2 border-rose-400 rounded"></div>
                        <span className="text-slate-300 text-sm font-medium">Right Pointer</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-amber-500/20 border-2 border-amber-400 rounded"></div>
                        <span className="text-slate-300 text-sm font-medium">Mid (Checking)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-emerald-500/20 border-2 border-emerald-400 rounded"></div>
                        <span className="text-slate-300 text-sm font-medium">Target Found</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-900/40 border-2 border-slate-800 rounded opacity-50"></div>
                        <span className="text-slate-500 text-sm font-medium">Eliminated Space</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">📖 Algorithm Details</h3>
                <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <strong className="text-blue-400 block mb-0.5">Precondition</strong>
                        Array must be sorted.
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <strong className="text-amber-400 block mb-0.5">Time Complexity</strong>
                        O(log n) — Eliminates half at each step.
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <strong className="text-purple-400 block mb-0.5">Space Complexity</strong>
                        O(1) — Iterative approach uses pointers.
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateKadanesFrames } from "../utils/algorithmUtils";

export default function KadanesAlgorithm() {
  const [array, setArray] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [originalArray, setOriginalArray] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [arrayInput, setArrayInput] = useState("-2, 1, -3, 4, -1, 2, 1, -5, 4");
  const [algorithm, setAlgorithm] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
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
    const size = Math.floor(Math.random() * 5) + 6;
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 21) - 10);
    setArray(newArr);
    setOriginalArray(newArr);
    setArrayInput(newArr.join(", "));
    resetVisualization();
  };

  const startVisualization = () => {
    if (algorithm.length === 0) {
      const frames = generateKadanesFrames(originalArray);
      setAlgorithm(frames);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const executeStep = (step) => {
    setCurrentFrame(step);
    if (step.type === "completed") {
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
      const frames = generateKadanesFrames(originalArray);
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
    if (!currentFrame) return "bg-[#332b21]/50 border-[#3d3326] text-[#EAEAEA]";

    const { currentIndex, subarrayStart, subarrayEnd, maxStart, maxEnd, type } = currentFrame;

    if (type === "completed" && index >= maxStart && index <= maxEnd) {
      return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 ring-2 ring-emerald-400 z-10";
    }
    if (index === currentIndex) {
      return "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110 ring-2 ring-amber-400 z-10";
    }
    if (index >= maxStart && index <= maxEnd) {
      return "bg-emerald-500/10 border-emerald-400/50 text-emerald-300 ring-2 ring-emerald-400/50";
    }
    if (index >= subarrayStart && index <= subarrayEnd) {
      return "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(255,215,0,0.3)] z-10";
    }
    return "bg-[#332b21]/50 border-[#3d3326] text-[#EAEAEA]";
  };

  const getPointerLabel = (index) => {
    if (!currentFrame) return null;
    const { currentIndex, subarrayStart, subarrayEnd } = currentFrame;
    const labels = [];
    if (index === currentIndex) labels.push({ text: "i", color: "text-amber-400 bg-amber-500/20 border border-amber-500/30" });
    if (index === subarrayStart && subarrayStart !== subarrayEnd) labels.push({ text: "S", color: "text-yellow-400 bg-yellow-500/20 border border-yellow-500/30" });
    if (index === subarrayEnd && subarrayStart !== subarrayEnd) labels.push({ text: "E", color: "text-yellow-400 bg-yellow-500/20 border border-yellow-500/30" });
    return labels;
  };

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-[#EAEAEA] p-6 md:p-10 selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="w-full flex justify-start mb-4">
                <Link to={"/visualizer"} className="inline-flex items-center text-[#a09880] hover:text-yellow-400 font-medium transition-colors bg-[#1a1611]/50 px-4 py-2 rounded-xl border border-[#332b21] hover:border-yellow-500/30 backdrop-blur-md">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a09880] tracking-tight mb-4">
                Kadane's Algorithm
            </h1>
            <p className="text-lg text-[#a09880] font-light max-w-2xl">
                Watch how Kadane's Algorithm finds the maximum contiguous subarray sum in O(n) time.
            </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-[#1a1611]/50 backdrop-blur-xl border border-[#332b21] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-sm font-semibold text-[#a09880] uppercase tracking-wider mb-4">⚙️ Configuration</h3>
          <div>
            <label className="block text-sm font-medium text-[#7a7260] mb-2">Array (comma-separated, negatives allowed)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="flex-1 bg-[#0f0d0a] border border-[#332b21] focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 text-[#EAEAEA] p-3 rounded-xl outline-none transition-all placeholder:text-[#5e5645]"
                placeholder="e.g. -2, 1, -3, 4, -1, 2, 1, -5, 4"
              />
              <button onClick={parseArrayInput} className="px-5 py-3 bg-[#FFD700] hover:bg-[#E6C200] text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                Set Array
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-[#1a1611]/50 backdrop-blur-xl border border-[#332b21] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button onClick={startVisualization} disabled={isPlaying || complete} className="px-6 py-3 bg-[#FFD700] hover:bg-[#E6C200] disabled:bg-[#332b21] disabled:text-[#7a7260] disabled:shadow-none text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center justify-center min-w-[120px]">
              {algorithm.length === 0 ? "▶ Start" : "▶ Resume"}
            </button>
            <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 border border-amber-500/30 rounded-xl transition-all font-semibold min-w-[120px]">
              ⏸ Pause
            </button>
            <button onClick={prevStep} disabled={isPlaying || currentStep <= 0} className="px-6 py-3 bg-[#332b21] hover:bg-[#3d3326] disabled:opacity-50 disabled:cursor-not-allowed text-[#EAEAEA] rounded-xl transition-all font-semibold">
              ⏪ Prev
            </button>
            <button onClick={nextStep} disabled={isPlaying || (algorithm.length > 0 && currentStep >= algorithm.length)} className="px-6 py-3 bg-[#332b21] hover:bg-[#3d3326] disabled:opacity-50 disabled:cursor-not-allowed text-[#EAEAEA] rounded-xl transition-all font-semibold">
              Next ⏩
            </button>
            <button onClick={resetVisualization} className="px-6 py-3 bg-[#332b21] hover:bg-[#3d3326] text-[#EAEAEA] rounded-xl transition-all font-semibold">
              ↺ Reset
            </button>
            <button onClick={generateRandomArray} disabled={isPlaying} className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-400 border border-amber-500/30 rounded-xl transition-all font-semibold">
              🎲 Random Array
            </button>
          </div>
          
          <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex justify-between text-xs text-[#a09880] font-medium px-1">
                  <span>Animation Speed</span>
                  <span className="font-mono">{speed}ms</span>
              </div>
              <input type="range" min={200} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full sm:w-48 accent-yellow-500 h-2 bg-[#332b21] rounded-lg appearance-none cursor-pointer"/>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="bg-[#1a1611]/50 backdrop-blur-xl border border-[#332b21] rounded-3xl p-8 shadow-2xl min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-[#a09880] uppercase tracking-wider mb-8 text-center">
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
                  <div className="text-[10px] text-[#7a7260] mt-2 font-mono">[{index}]</div>
                </div>
              );
            })}
          </div>

          {/* Max subarray indicator */}
          {currentFrame && currentFrame.maxStart !== undefined && (
            <div className="mt-8 flex justify-center w-full">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl px-6 py-3 text-sm flex items-center gap-3">
                <span className="font-semibold text-emerald-400 tracking-wider uppercase text-xs">Best subarray:</span>
                <span className="text-emerald-300 font-mono text-lg tracking-widest">[{array.slice(currentFrame.maxStart, currentFrame.maxEnd + 1).join(", ")}]</span>
                <span className="text-emerald-400 font-bold ml-2 text-xl">= {currentFrame.maxSum}</span>
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
              <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Current Index</div>
                <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame ? currentFrame.currentIndex : "—"}</div>
              </div>
              <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-yellow-400 font-semibold uppercase tracking-wider mb-1">Current Sum</div>
                <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame ? currentFrame.currentSum : "—"}</div>
              </div>
              <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-2xl p-4 text-center shadow-lg">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">Max Sum</div>
                <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame ? currentFrame.maxSum : "—"}</div>
              </div>
              <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-2xl p-4 text-center shadow-lg flex flex-col justify-center">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">Decision</div>
                <div className="text-lg font-bold text-[#EAEAEA]">
                  {currentFrame?.type === "extend" ? "Extend ➕" : currentFrame?.type === "restart" ? "Restart 🔄" : currentFrame?.type === "new_max" ? "New Max 🏆" : "—"}
                </div>
              </div>
            </div>

            {/* Status Box */}
            <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
                currentFrame?.type === "completed" ? "bg-emerald-950/20 border-emerald-500/30"
                : currentFrame?.type === "new_max" ? "bg-amber-950/20 border-amber-500/30"
                : currentFrame?.type === "restart" ? "bg-rose-950/20 border-rose-500/30"
                : "bg-[#1a1611]/50 border-[#332b21] backdrop-blur-xl"
            }`}>
                <h3 className="text-sm font-semibold text-[#a09880] uppercase tracking-wider mb-4">💬 Live Algorithm Status</h3>
                {currentFrame ? (
                    <p className={`text-lg pt-0.5 leading-relaxed font-medium ${
                        currentFrame.type === "completed" ? "text-emerald-400"
                        : currentFrame.type === "new_max" ? "text-amber-400"
                        : currentFrame.type === "restart" ? "text-rose-400"
                        : "text-yellow-400"
                    }`}>
                        {currentFrame.description}
                    </p>
                ) : (
                    <p className="text-[#7a7260] italic">Press Start to begin the visualization.</p>
                )}
            </div>

          </div>

          {/* Legend & Docs */}
          <div className="space-y-6">
            <div className="bg-[#1a1611]/50 backdrop-blur-xl border border-[#332b21] rounded-3xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-[#a09880] uppercase tracking-wider mb-4">Color Legend</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-amber-500/20 border-2 border-amber-400 rounded"></div>
                        <span className="text-[#EAEAEA] text-sm font-medium">Current Index</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-yellow-500/20 border-2 border-yellow-400 rounded"></div>
                        <span className="text-[#EAEAEA] text-sm font-medium">Current Subarray</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-emerald-500/10 border-2 border-emerald-400/50 rounded ring-2 ring-emerald-400/50"></div>
                        <span className="text-[#EAEAEA] text-sm font-medium">Best Subarray</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-emerald-500/20 border-2 border-emerald-400 rounded"></div>
                        <span className="text-[#EAEAEA] text-sm font-medium">Final Answer</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#1a1611]/50 backdrop-blur-xl border border-[#332b21] rounded-3xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-[#a09880] uppercase tracking-wider mb-4">📖 Algorithm Details</h3>
                <div className="text-[#EAEAEA] space-y-3 text-sm leading-relaxed">
                    <div className="p-3 rounded-xl bg-[#211c15] border border-[#332b21]">
                        <strong className="text-yellow-400 block mb-0.5">Extend or Restart</strong>
                        For each element, decide whether to extend the current subarray sum or start fresh.
                    </div>
                    <div className="p-3 rounded-xl bg-[#211c15] border border-[#332b21]">
                        <strong className="text-amber-400 block mb-0.5">Time Complexity</strong>
                        O(n) — Single pass through the array.
                    </div>
                    <div className="p-3 rounded-xl bg-[#211c15] border border-[#332b21]">
                        <strong className="text-amber-400 block mb-0.5">Space Complexity</strong>
                        O(1) — Only keeps track of current sum and max sum.
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

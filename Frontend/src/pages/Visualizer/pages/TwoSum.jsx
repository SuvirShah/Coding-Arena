import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateTwoSumFrames } from "../utils/algorithmUtils";

export default function TwoSum() {
  const [arrayInput, setArrayInput] = useState("1, 2, 3, 4, 6, 8, 11");
  const [array, setArray] = useState([1, 2, 3, 4, 6, 8, 11]);
  const [target, setTarget] = useState(10);
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const parseArrayInput = () => {
    resetVisualization();
    const parsed = arrayInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
    if (parsed.length > 0) {
      setArray(parsed);
    }
  };

  const generateRandomArray = () => {
    resetVisualization();
    const length = Math.floor(Math.random() * 5) + 5;
    const randomArr = [];
    let current = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < length; i++) {
      randomArr.push(current);
      current += Math.floor(Math.random() * 4) + 1;
    }
    setArray(randomArr);
    setArrayInput(randomArr.join(", "));
    
    // Pick a realistic target
    const i = Math.floor(Math.random() * length);
    let j = Math.floor(Math.random() * length);
    while (j === i) j = Math.floor(Math.random() * length);
    setTarget(randomArr[i] + randomArr[j]);
  };

  const startVisualization = () => {
    if (algorithm.length === 0) {
      const frames = generateTwoSumFrames(array, Number(target));
      setAlgorithm(frames);
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
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
    } else if (currentStep >= algorithm.length && isPlaying) {
      setIsPlaying(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentStep, algorithm, speed]);

  const nextStep = () => {
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
    const { left, right, found, resultIndices = [], checked = [] } = currentFrame;

    if (found && resultIndices.includes(index)) {
      return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400 scale-110";
    }
    if (checked.includes(index)) {
      return "bg-[#1a1611]/40 border-[#332b21] text-[#5e5645] opacity-40 scale-95";
    }
    if (index === left) {
      return "bg-yellow-500/20 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105";
    }
    if (index === right) {
      return "bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105";
    }
    if (index > left && index < right) {
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-200";
    }
    return "bg-[#332b21]/50 border-[#3d3326] text-[#EAEAEA]";
  };

  const getPointerLabel = (index) => {
    if (!currentFrame) return null;
    const { left, right, found, resultIndices = [] } = currentFrame;
    const labels = [];
    if (found && resultIndices.includes(index)) {
      labels.push({ text: "✓", color: "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30" });
    }
    if (index === left) labels.push({ text: "L", color: "text-yellow-400 bg-yellow-500/20 border border-yellow-500/30" });
    if (index === right) labels.push({ text: "R", color: "text-rose-400 bg-rose-500/20 border border-rose-500/30" });
    return labels;
  };

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-[#EAEAEA] p-8 selection:bg-yellow-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link to="/visualizer" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 font-medium transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">🎯 Two Sum — Two Pointers Visualizer</h1>
        <p className="text-[#a09880] text-lg mb-8">Watch how two pointers converge inward on a sorted array to find a pair that sums to the target</p>

        {/* Input Panel */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#332b21]">
          <h3 className="text-lg font-semibold text-[#a09880] mb-4">📥 Input Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7a7260] mb-1">Sorted Array (comma-separated)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  className="flex-1 bg-[#0f0d0a] border border-[#332b21] focus:border-yellow-500 text-[#EAEAEA] p-2.5 rounded-xl outline-none transition-colors"
                  placeholder="e.g. 1, 2, 3, 4, 6"
                />
                <button onClick={parseArrayInput} className="px-4 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-black font-bold rounded-xl transition-colors shadow-md">
                  Set
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7a7260] mb-1">Target Sum</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[#0f0d0a] border border-[#332b21] focus:border-amber-500 text-[#EAEAEA] p-2.5 rounded-xl outline-none transition-colors"
                placeholder="Enter target sum"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#332b21]">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button onClick={startVisualization} disabled={isPlaying || complete || !target} className="bg-[#FFD700] hover:bg-[#E6C200] disabled:bg-[#332b21] disabled:text-[#7a7260] text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-md">
                {algorithm.length === 0 ? "▶ Start" : "▶ Resume"}
              </button>
              <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏸ Pause
              </button>
              <button onClick={prevStep} disabled={isPlaying || currentStep <= 0} className="bg-[#332b21] hover:bg-[#3d3326] disabled:opacity-50 disabled:cursor-not-allowed text-[#EAEAEA] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏪ Back
              </button>
              <button onClick={nextStep} disabled={isPlaying || (algorithm.length > 0 && currentStep >= algorithm.length)} className="bg-[#332b21] hover:bg-[#3d3326] disabled:opacity-50 disabled:cursor-not-allowed text-[#EAEAEA] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏩ Step
              </button>
              <button onClick={resetVisualization} className="bg-[#332b21] hover:bg-[#3d3326] text-[#EAEAEA] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ↺ Reset
              </button>
              <button onClick={generateRandomArray} disabled={isPlaying} className="bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-400 border border-amber-500/30 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                🎲 Random
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-[#a09880]">Speed</label>
              <input type="range" min={200} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-yellow-500" />
              <span className="text-xs text-[#a09880] font-mono w-14">{speed}ms</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border border-[#332b21]">
          <h3 className="text-lg font-semibold text-[#a09880] mb-6 text-center">
            Array Visualization
            {currentFrame && <span className="text-sm font-normal text-[#7a7260] ml-3">Step {currentStep} of {algorithm.length}</span>}
          </h3>
          <div className="flex justify-center items-end gap-3 flex-wrap min-h-[120px]">
            {array.map((value, index) => {
              const labels = getPointerLabel(index);
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="h-8 flex gap-1 items-end mb-1">
                    {labels && labels.map((l, li) => (
                      <span key={li} className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${l.color}`}>{l.text}</span>
                    ))}
                  </div>
                  <div className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl font-bold text-lg transition-all duration-500 ${getBlockStyle(index)}`}>
                    {value}
                  </div>
                  <div className="text-xs text-[#7a7260] mt-1.5 font-mono">{index}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        {currentFrame && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-xl p-4 text-center">
              <div className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Left (idx)</div>
              <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame.left}</div>
              <div className="text-xs text-[#a09880] mt-1">val: {array[currentFrame.left] ?? "—"}</div>
            </div>
            <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-xl p-4 text-center">
              <div className="text-xs text-rose-400 font-semibold uppercase tracking-wider">Right (idx)</div>
              <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame.right}</div>
              <div className="text-xs text-[#a09880] mt-1">val: {array[currentFrame.right] ?? "—"}</div>
            </div>
            <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-xl p-4 text-center">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Current Sum</div>
              <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame.currentSum !== null ? currentFrame.currentSum : "—"}</div>
            </div>
            <div className="bg-[#1a1611]/50 border border-[#332b21] rounded-xl p-4 text-center">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Target</div>
              <div className="text-2xl font-bold text-[#EAEAEA]">{currentFrame.target}</div>
            </div>
          </div>
        )}

        {/* Live Status Box */}
        {currentFrame && (
          <div className={`rounded-2xl shadow-lg p-5 mb-6 border transition-all duration-300 ${
            currentFrame.found
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
              : currentFrame.type === "not_found"
              ? "bg-rose-950/20 border-rose-500/30 text-rose-400"
              : "bg-[#211c15] border-[#332b21] text-yellow-400"
          }`}>
            <h3 className="text-sm font-bold text-[#a09880] uppercase tracking-wider mb-2">💬 Algorithm Status</h3>
            <p className="text-base font-medium leading-relaxed">
              {currentFrame.description}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#332b21]">
          <h3 className="text-lg font-semibold text-[#a09880] mb-3">Legend</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-yellow-500/20 border-2 border-yellow-400 rounded-md"></div><span className="text-sm text-[#EAEAEA]">Left Pointer</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-rose-500/20 border-2 border-rose-400 rounded-md"></div><span className="text-sm text-[#EAEAEA]">Right Pointer</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-emerald-500/20 border-2 border-emerald-400 rounded-md"></div><span className="text-sm text-[#EAEAEA]">Found Pair!</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#1a1611]/40 border-2 border-[#332b21] rounded-md opacity-40"></div><span className="text-sm text-[#7a7260]">Checked / Skipped</span></div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#332b21]">
          <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">How Two Sum (Two Pointers) Works</h3>
          <div className="text-[#EAEAEA] space-y-2.5">
            <p>• <strong className="text-yellow-400">Precondition:</strong> Array must be sorted in ascending order</p>
            <p>• <strong className="text-yellow-400">Initialize:</strong> Place Left pointer at start, Right pointer at end</p>
            <p>• <strong className="text-yellow-400">Calculate:</strong> sum = arr[left] + arr[right]</p>
            <p>• <strong className="text-emerald-400">If sum == target:</strong> Found the pair!</p>
            <p>• <strong className="text-yellow-400">If sum &lt; target:</strong> Move Left pointer right (need larger values)</p>
            <p>• <strong className="text-rose-400">If sum &gt; target:</strong> Move Right pointer left (need smaller values)</p>
            <p>• <strong className="text-amber-400">Time Complexity:</strong> O(n) — single pass with two pointers</p>
            <p>• <strong className="text-amber-400">Space Complexity:</strong> O(1)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

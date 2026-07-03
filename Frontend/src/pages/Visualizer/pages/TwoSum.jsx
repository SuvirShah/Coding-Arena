import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateTwoSumFrames } from "../utils/algorithmUtils";

export default function TwoSum() {
  const [array, setArray] = useState([1, 2, 3, 4, 6, 8, 11, 15]);
  const [originalArray, setOriginalArray] = useState([1, 2, 3, 4, 6, 8, 11, 15]);
  const [target, setTarget] = useState("");
  const [arrayInput, setArrayInput] = useState("1, 2, 3, 4, 6, 8, 11, 15");
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
    const size = Math.floor(Math.random() * 5) + 6;
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 30 + 1));
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
      const frames = generateTwoSumFrames(originalArray, t);
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
      const frames = generateTwoSumFrames(originalArray, parseInt(target));
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
    if (!currentFrame) return "bg-slate-100 border-slate-300";

    const { left, right, found, resultIndices = [], checked = [] } = currentFrame;

    if (found && resultIndices.includes(index)) {
      return "bg-emerald-400 border-emerald-600 scale-110 shadow-lg shadow-emerald-200 ring-4 ring-emerald-300 animate-pulse";
    }
    if (checked.includes(index)) {
      return "bg-slate-50 border-slate-200 opacity-40 scale-95";
    }
    if (index === left) {
      return "bg-blue-200 border-blue-500 ring-2 ring-blue-400 shadow-md scale-105";
    }
    if (index === right) {
      return "bg-rose-200 border-red-500 ring-2 ring-red-400 shadow-md scale-105";
    }
    if (index > left && index < right) {
      return "bg-indigo-50 border-indigo-300";
    }
    return "bg-slate-100 border-slate-300";
  };

  const getPointerLabel = (index) => {
    if (!currentFrame) return null;
    const { left, right, found, resultIndices = [] } = currentFrame;
    const labels = [];
    if (found && resultIndices.includes(index)) {
      labels.push({ text: "✓", color: "text-emerald-600 bg-emerald-100" });
    }
    if (index === left) labels.push({ text: "L", color: "text-blue-600 bg-blue-100" });
    if (index === right) labels.push({ text: "R", color: "text-red-600 bg-red-100" });
    return labels;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link to="/visualizer" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Two Sum — Two Pointers Visualizer</h1>
        <p className="text-gray-500 text-lg mb-8">Watch how two pointers converge inward on a sorted array to find a pair that sums to the target</p>

        {/* Input Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📥 Input Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Sorted Array (comma-separated)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  className="flex-1 border-2 border-gray-200 focus:border-teal-400 p-2.5 rounded-xl outline-none transition-colors"
                  placeholder="e.g. 1, 2, 3, 4, 6"
                />
                <button onClick={parseArrayInput} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors shadow-md">
                  Set
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Target Sum</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-rose-400 p-2.5 rounded-xl outline-none transition-colors"
                placeholder="Enter target sum"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button onClick={startVisualization} disabled={isPlaying || complete || !target} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                {algorithm.length === 0 ? "▶ Start" : "▶ Resume"}
              </button>
              <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏸ Pause
              </button>
              <button onClick={prevStep} disabled={isPlaying || currentStep <= 0} className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏪ Back
              </button>
              <button onClick={nextStep} disabled={isPlaying || (algorithm.length > 0 && currentStep >= algorithm.length)} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏩ Step
              </button>
              <button onClick={resetVisualization} className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ↺ Reset
              </button>
              <button onClick={generateRandomArray} disabled={isPlaying} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                🎲 Random
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-600">Speed</label>
              <input type="range" min={200} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-teal-500" />
              <span className="text-xs text-gray-500 font-mono w-14">{speed}ms</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">
            Array Visualization
            {currentFrame && <span className="text-sm font-normal text-gray-400 ml-3">Step {currentStep} of {algorithm.length}</span>}
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
                  <div className="text-xs text-gray-400 mt-1.5 font-mono">{index}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        {currentFrame && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Left (idx)</div>
              <div className="text-2xl font-bold text-blue-700">{currentFrame.left}</div>
              <div className="text-xs text-blue-400 mt-1">val: {array[currentFrame.left] ?? "—"}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="text-xs text-red-500 font-semibold uppercase tracking-wider">Right (idx)</div>
              <div className="text-2xl font-bold text-red-700">{currentFrame.right}</div>
              <div className="text-xs text-red-400 mt-1">val: {array[currentFrame.right] ?? "—"}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <div className="text-xs text-purple-500 font-semibold uppercase tracking-wider">Current Sum</div>
              <div className="text-2xl font-bold text-purple-700">{currentFrame.currentSum !== null ? currentFrame.currentSum : "—"}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Target</div>
              <div className="text-2xl font-bold text-amber-700">{currentFrame.target}</div>
            </div>
          </div>
        )}

        {/* Live Status Box */}
        {currentFrame && (
          <div className={`rounded-2xl shadow-lg p-5 mb-6 border transition-all duration-300 ${
            currentFrame.found
              ? "bg-emerald-50 border-emerald-300"
              : currentFrame.type === "not_found"
              ? "bg-red-50 border-red-300"
              : currentFrame.type === "move_left"
              ? "bg-blue-50 border-blue-200"
              : currentFrame.type === "move_right"
              ? "bg-rose-50 border-rose-200"
              : "bg-indigo-50 border-indigo-200"
          }`}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">💬 Algorithm Status</h3>
            <p className={`text-base font-medium leading-relaxed ${
              currentFrame.found ? "text-emerald-700"
                : currentFrame.type === "not_found" ? "text-red-700"
                : "text-indigo-700"
            }`}>
              {currentFrame.description}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-blue-200 border-2 border-blue-500 rounded-md"></div><span className="text-sm text-gray-600">Left Pointer</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-rose-200 border-2 border-red-500 rounded-md"></div><span className="text-sm text-gray-600">Right Pointer</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-emerald-400 border-2 border-emerald-600 rounded-md"></div><span className="text-sm text-gray-600">Found Pair!</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-slate-50 border-2 border-slate-200 rounded-md opacity-40"></div><span className="text-sm text-gray-600">Checked / Skipped</span></div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How Two Sum (Two Pointers) Works</h3>
          <div className="text-gray-700 space-y-2.5">
            <p>• <strong>Precondition:</strong> Array must be sorted in ascending order</p>
            <p>• <strong>Initialize:</strong> Place Left pointer at start, Right pointer at end</p>
            <p>• <strong>Calculate:</strong> sum = arr[left] + arr[right]</p>
            <p>• <strong>If sum == target:</strong> Found the pair!</p>
            <p>• <strong>If sum &lt; target:</strong> Move Left pointer right (need larger values)</p>
            <p>• <strong>If sum &gt; target:</strong> Move Right pointer left (need smaller values)</p>
            <p>• <strong>Time Complexity:</strong> O(n) — single pass with two pointers</p>
            <p>• <strong>Space Complexity:</strong> O(1)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

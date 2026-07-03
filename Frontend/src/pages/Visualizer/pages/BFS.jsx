import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateBFSFrames } from "../utils/graphUtils";

const ROWS = 15;
const COLS = 30;
const START_NODE_ROW = 7;
const START_NODE_COL = 5;
const END_NODE_ROW = 7;
const END_NODE_COL = 24;

const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        isWall: false,
        isVisited: false,
        isPath: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

export default function BFS() {
  const [grid, setGrid] = useState(createInitialGrid());
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [algorithm, setAlgorithm] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // fast by default for grids
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
    
    // Clear visited and path nodes, keep walls
    const newGrid = grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
      }))
    );
    setGrid(newGrid);
  };

  const clearBoard = () => {
    resetVisualization();
    setGrid(createInitialGrid());
  };

  const handleMouseDown = (row, col) => {
    if (isPlaying || complete) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isPlaying || complete) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const startVisualization = () => {
    resetVisualization();
    const startNode = { r: START_NODE_ROW, c: START_NODE_COL };
    const endNode = { r: END_NODE_ROW, c: END_NODE_COL };
    const frames = generateBFSFrames(grid, startNode, endNode);
    setAlgorithm(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const executeStep = (step) => {
    setCurrentFrame(step);
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => [...row]);
      
      if (step.type === "visit") {
        newGrid[step.row][step.col].isVisited = true;
      } else if (step.type === "path") {
        for (const p of step.path) {
          newGrid[p.r][p.c].isPath = true;
        }
      }
      return newGrid;
    });

    if (step.type === "path" || step.type === "not_found") {
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

  const getNodeStyle = (node) => {
    if (node.isStart) return "bg-green-500 scale-110 shadow-lg shadow-green-300 ring-2 ring-green-400 z-10";
    if (node.isEnd) return "bg-red-500 scale-110 shadow-lg shadow-red-300 ring-2 ring-red-400 z-10";
    if (node.isWall) return "bg-slate-700 scale-105 rounded-sm";
    if (node.isPath) return "bg-yellow-400 scale-105 shadow-md ring-1 ring-yellow-500";
    if (node.isVisited) return "bg-blue-300 animate-pulse";
    return "bg-slate-100 border border-slate-200 hover:bg-slate-200";
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 p-8"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link to="/visualizer" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📡 Breadth-First Search (BFS) Visualizer</h1>
        <p className="text-gray-500 text-lg mb-8">
          Draw walls by clicking and dragging on the grid. BFS guarantees the shortest path on an unweighted grid!
        </p>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button onClick={startVisualization} disabled={isPlaying || complete} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ▶ Start BFS
              </button>
              <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏸ Pause
              </button>
              <button onClick={resetVisualization} className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ↺ Reset Search
              </button>
              <button onClick={clearBoard} disabled={isPlaying} className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                🗑️ Clear Board (Remove Walls)
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-600">Speed</label>
              <input type="range" min={10} max={500} step={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-blue-500" dir="rtl" />
              <span className="text-xs text-gray-500 font-mono w-16">{speed}ms</span>
            </div>
          </div>
        </div>

        {/* Live Status Box */}
        {currentFrame && (
          <div className={`rounded-2xl shadow-lg p-5 mb-6 border transition-all duration-300 ${
            currentFrame.type === "path" ? "bg-emerald-50 border-emerald-300"
              : currentFrame.type === "not_found" ? "bg-red-50 border-red-300"
              : "bg-indigo-50 border-indigo-200"
          }`}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">💬 Algorithm Status</h3>
            <p className={`text-base font-medium leading-relaxed ${
              currentFrame.type === "path" ? "text-emerald-700"
                : currentFrame.type === "not_found" ? "text-red-700"
                : "text-indigo-700"
            }`}>
              {currentFrame.description}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-500 rounded-md shadow-md ring-2 ring-green-400"></div><span className="text-sm font-medium text-gray-600">Start Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-500 rounded-md shadow-md ring-2 ring-red-400"></div><span className="text-sm font-medium text-gray-600">End Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-700 rounded-sm"></div><span className="text-sm font-medium text-gray-600">Wall Node (Click/Drag)</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-300 rounded-md"></div><span className="text-sm font-medium text-gray-600">Visited Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-yellow-400 rounded-md shadow-md ring-1 ring-yellow-500"></div><span className="text-sm font-medium text-gray-600">Shortest Path</span></div>
          </div>
        </div>

        {/* Grid Visualization */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div 
            className="grid gap-[1px] bg-slate-300 border-4 border-slate-300 shadow-xl rounded-lg select-none"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rowIndex) => (
              row.map((node, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-colors duration-200 ${getNodeStyle(node)}`}
                />
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

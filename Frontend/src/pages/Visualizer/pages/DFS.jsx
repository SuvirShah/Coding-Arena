import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { generateDFSFrames } from "../utils/graphUtils";

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

export default function DFS() {
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
    const frames = generateDFSFrames(grid, startNode, endNode);
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
    if (node.isStart) return "bg-emerald-500 scale-110 shadow-lg shadow-emerald-900 ring-2 ring-emerald-400 z-10";
    if (node.isEnd) return "bg-rose-500 scale-110 shadow-lg shadow-rose-900 ring-2 ring-rose-400 z-10";
    if (node.isWall) return "bg-[#524433] scale-105 rounded-sm";
    if (node.isPath) return "bg-[#FFD700] scale-105 shadow-md ring-1 ring-yellow-300";
    if (node.isVisited) return "bg-amber-500/40 animate-pulse";
    return "bg-[#1a1611] border border-[#2a2318] hover:bg-[#251e15]";
  };

  return (
    <div 
      className="min-h-screen bg-[#0f0d0a] text-[#EAEAEA] p-8 selection:bg-yellow-500/30"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link to="/visualizer" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 font-medium transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">🕳️ Depth-First Search (DFS) Visualizer</h1>
        <p className="text-[#a09880] text-lg mb-8">
          Draw walls by clicking and dragging on the grid. DFS explores as deeply as possible, but does NOT guarantee the shortest path!
        </p>

        {/* Controls */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#332b21]">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button onClick={startVisualization} disabled={isPlaying || complete} className="bg-[#FFD700] hover:bg-[#E6C200] disabled:bg-[#332b21] disabled:text-[#7a7260] text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-md">
                ▶ Start DFS
              </button>
              <button onClick={() => { setIsPlaying(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); }} disabled={!isPlaying} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ⏸ Pause
              </button>
              <button onClick={resetVisualization} className="bg-[#332b21] hover:bg-[#3d3326] text-[#EAEAEA] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                ↺ Reset Search
              </button>
              <button onClick={clearBoard} disabled={isPlaying} className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 disabled:opacity-50 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md">
                🗑️ Clear Board (Remove Walls)
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-[#a09880]">Speed</label>
              <input type="range" min={10} max={500} step={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-yellow-500" dir="rtl" />
              <span className="text-xs text-[#a09880] font-mono w-16">{speed}ms</span>
            </div>
          </div>
        </div>

        {/* Live Status Box */}
        {currentFrame && (
          <div className={`rounded-2xl shadow-lg p-5 mb-6 border transition-all duration-300 ${
            currentFrame.type === "path" ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
              : currentFrame.type === "not_found" ? "bg-rose-950/30 border-rose-500/30 text-rose-400"
              : "bg-[#211c15] border-[#332b21] text-amber-400"
          }`}>
            <h3 className="text-sm font-bold text-[#a09880] uppercase tracking-wider mb-2">💬 Algorithm Status</h3>
            <p className="text-base font-medium leading-relaxed">
              {currentFrame.description}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-[#1a1611]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-[#332b21]">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-emerald-500 rounded-md shadow-md ring-2 ring-emerald-400"></div><span className="text-sm font-medium text-[#a09880]">Start Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-rose-500 rounded-md shadow-md ring-2 ring-rose-400"></div><span className="text-sm font-medium text-[#a09880]">End Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#524433] rounded-sm"></div><span className="text-sm font-medium text-[#a09880]">Wall Node (Click/Drag)</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-amber-500/40 rounded-md"></div><span className="text-sm font-medium text-[#a09880]">Visited Node</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#FFD700] rounded-md shadow-md ring-1 ring-yellow-300"></div><span className="text-sm font-medium text-[#a09880]">Final Path</span></div>
          </div>
        </div>

        {/* Grid Visualization */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div 
            className="grid gap-[1px] bg-[#332b21] border-4 border-[#332b21] shadow-xl rounded-lg select-none"
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

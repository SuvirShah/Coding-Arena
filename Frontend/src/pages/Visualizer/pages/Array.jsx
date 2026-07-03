import React, { useState, useEffect, useRef } from "react";

export default function ArrayVisualizer() {
  const [arrayType, setArrayType] = useState("1D");
  const [array1D, set1Darray] = useState([10, 8, 16, 3]);
  const [array2D, set2Darray] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const [highlightidx, sethighlightidx] = useState(-1);
  const [highlight2D, sethighlight2D] = useState([-1, -1]);
  const [operation, setoperation] = useState("");
  const [currentstep, setCurrentStep] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [speed, setspeed] = useState(1000);
  const [steps, setsteps] = useState([]);
  const [complete, setComplete] = useState(false);
  const [message, setmessage] = useState("");

  const [inputVal, setinputVal] = useState("");
  const [inputidx, setinputidx] = useState("");
  const [inputrow, setinputrow] = useState("");
  const [inputcol, setinputcol] = useState("");
  const [searchVal, setsearchVal] = useState("");

  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [fillValue, setFillValue] = useState(0);

  const timeoutRef = useRef(null);

  const resetVisualization = () => {
    setCurrentStep(0);
    setisPlaying(false);
    sethighlightidx(-1);
    sethighlight2D([-1, -1]);
    setoperation("");
    setComplete(false);
    setmessage("");
    setsteps([]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const generate1Darray = () => {
    const size = Math.floor(Math.random() * 5) + 5;
    const newArray = globalThis.Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100 + 1)
    );
    set1Darray(newArray);
    resetVisualization();
  };

  const generate2Darray = () => {
    const row = Math.floor(Math.random() * 3) + 3;
    const col = Math.floor(Math.random() * 3) + 3;
    const newArray = globalThis.Array.from({ length: row }, () =>
      globalThis.Array.from({ length: col }, () => Math.floor(Math.random() * 50 + 1))
    );
    set2Darray(newArray);
    resetVisualization();
  };

  const create2Darray = () => {
    if (rows < 1 || cols < 1 || rows > 10 || cols > 10) {
      setmessage("Rows and Cols must be in range 1 to 10");
      return;
    }

    const value = parseInt(fillValue) || 0;
    const newArray = globalThis.Array.from({ length: rows }, () =>
      globalThis.Array.from({ length: cols }, () => value)
    );

    set2Darray(newArray);
    resetVisualization();
    setmessage(`Created ${rows}x${cols} 2D array filled with ${value}`);
  };

  const addElement1D = () => {
    if (inputVal === "") {
      setmessage("Please enter a valid value to add");
      return;
    }

    const value = parseInt(inputVal);
    const idx = inputidx === "" ? array1D.length : parseInt(inputidx);

    if (idx < 0 || idx > array1D.length) {
      setmessage(`Index must be between 0 and ${array1D.length}`);
      return;
    }

    const operationsteps = [];
    const newArray = [...array1D];

    operationsteps.push({
      type: "highlight_1d",
      idx,
      array: [...newArray],
      message: `Adding ${value} at index ${idx}`,
      description: "Highlight insertion position",
    });

    if (idx < array1D.length) {
      for (let i = newArray.length; i > idx; i--) {
        newArray[i] = newArray[i - 1];
        operationsteps.push({
          type: "shift_1d",
          idx: i,
          array: [...newArray],
          message: `Shifting elements to make space`,
          description: `Moving element to position ${i}`,
        });
      }
    }

    newArray[idx] = value;

    operationsteps.push({
      type: "insert_1d",
      idx,
      array: [...newArray],
      message: `Successfully added ${value} at index ${idx}`,
      description: "Element added successfully",
    });

    setsteps(operationsteps);
    setoperation("add_1d");
    setCurrentStep(0);
    setinputVal("");
    setinputidx("");
    setmessage("");
  };

  const addElement2D = () => {
    if (inputVal === "" || inputrow === "" || inputcol === "") {
      setmessage("Please enter valid value, row, and column");
      return;
    }

    const val = parseInt(inputVal);
    const row = parseInt(inputrow);
    const col = parseInt(inputcol);

    if (row < 0 || col < 0 || row >= array2D.length || col >= array2D[0].length) {
      setmessage(
        `Row must be between 0 and ${array2D.length - 1} and column must be between 0 and ${array2D[0].length - 1}`
      );
      return;
    }

    const operationsteps = [];
    const newArray = array2D.map((r) => [...r]);
    const oldValue = newArray[row][col];

    operationsteps.push({
      type: "highlight_2d",
      row,
      col,
      array: newArray.map((r) => [...r]),
      message: `Current value at [${row}][${col}]: ${oldValue}`,
      description: "Highlighting target position",
    });

    newArray[row][col] = val;

    operationsteps.push({
      type: "update_2d",
      row,
      col,
      array: newArray.map((r) => [...r]),
      message: `Updated [${row}][${col}] from ${oldValue} to ${val}`,
      description: "Element updated successfully",
    });

    setsteps(operationsteps);
    setoperation("add_2d");
    setCurrentStep(0);
    setinputVal("");
    setinputcol("");
    setinputrow("");
    setmessage("");
  };

  const deleteElement1D = () => {
    if (inputidx === "") {
      setmessage("Please enter a valid index to delete");
      return;
    }

    const idx = parseInt(inputidx);

    if (idx < 0 || idx >= array1D.length) {
      setmessage(`Index must be between 0 and ${array1D.length - 1}`);
      return;
    }

    const operationsteps = [];
    const newArray = [...array1D];
    const deletedValue = newArray[idx];

    operationsteps.push({
      type: "highlight_1d",
      idx,
      array: [...newArray],
      message: `Deleting element ${deletedValue} at index ${idx}`,
      description: "Highlighting element to delete",
    });

    for (let i = idx; i < newArray.length - 1; i++) {
      newArray[i] = newArray[i + 1];
      operationsteps.push({
        type: "shift_left_1d",
        idx: i,
        array: [...newArray],
        message: `Shifting elements left to fill gap`,
        description: `Moving element from position ${i + 1} to ${i}`,
      });
    }

    newArray.pop();

    operationsteps.push({
      type: "delete_1d",
      idx,
      array: [...newArray],
      message: `Successfully deleted ${deletedValue} from index ${idx}`,
      description: "Element deleted successfully",
    });

    setsteps(operationsteps);
    setoperation("delete_1d");
    setCurrentStep(0);
    setinputidx("");
    setmessage("");
  };

  const searchElement1D = () => {
    if (searchVal === "") {
      setmessage("Please enter a value to search");
      return;
    }

    const value = parseInt(searchVal);
    const operationsteps = [];

    for (let i = 0; i < array1D.length; i++) {
      operationsteps.push({
        type: "search_1d",
        idx: i,
        array: [...array1D],
        message: `Checking index ${i}: ${array1D[i]} ${
          array1D[i] === value ? "✓ Found!" : "✗ Not found"
        }`,
        description: `Searching for ${value} at index ${i}`,
        found: array1D[i] === value,
      });

      if (array1D[i] === value) {
        operationsteps.push({
          type: "found_1d",
          idx: i,
          array: [...array1D],
          message: `Found ${value} at index ${i}!`,
          description: "Search completed successfully",
        });
        break;
      }
    }

    if (!array1D.includes(value)) {
      operationsteps.push({
        type: "not_found_1d",
        idx: -1,
        array: [...array1D],
        message: `${value} not found in the array`,
        description: "Search completed - element not found",
      });
    }

    setsteps(operationsteps);
    setoperation("search_1d");
    setCurrentStep(0);
    setsearchVal("");
    setmessage("");
  };

  const searchElement2D = () => {
    if (searchVal === "") {
      setmessage("Please enter a value to search");
      return;
    }

    const value = parseInt(searchVal);
    const operationsteps = [];
    let found = false;

    for (let i = 0; i < array2D.length && !found; i++) {
      for (let j = 0; j < array2D[i].length && !found; j++) {
        operationsteps.push({
          type: "search_2d",
          row: i,
          col: j,
          array: array2D.map((r) => [...r]),
          message: `Checking [${i}][${j}]: ${array2D[i][j]} ${
            array2D[i][j] === value ? "✓ Found!" : "✗ Not found"
          }`,
          description: `Searching for ${value} at position [${i}][${j}]`,
          found: array2D[i][j] === value,
        });

        if (array2D[i][j] === value) {
          found = true;
          operationsteps.push({
            type: "found_2d",
            row: i,
            col: j,
            array: array2D.map((r) => [...r]),
            message: `Found ${value} at position [${i}][${j}]!`,
            description: "Search completed successfully",
          });
        }
      }
    }

    if (!found) {
      operationsteps.push({
        type: "not_found_2d",
        row: -1,
        col: -1,
        array: array2D.map((r) => [...r]),
        message: `${value} not found in the 2D array`,
        description: "Search completed - element not found",
      });
    }

    setsteps(operationsteps);
    setoperation("search_2d");
    setCurrentStep(0);
    setsearchVal("");
    setmessage("");
  };

  useEffect(() => {
    if (isPlaying && currentstep < steps.length) {
      timeoutRef.current = setTimeout(() => {
        const step = steps[currentstep];
        if (!step) return;

        if (arrayType === "1D" && step.type.includes("1d")) {
          set1Darray([...step.array]);
          sethighlightidx(step.idx);
        } else if (arrayType === "2D" && step.type.includes("2d")) {
          set2Darray(step.array.map((r) => [...r]));
          sethighlight2D([step.row, step.col]);
        }

        setmessage(step.message);

        if (currentstep === steps.length - 1) {
          setisPlaying(false);
          setComplete(true);
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }, speed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentstep, steps, speed, arrayType]);

  const PlayVisualization = () => {
    if (steps.length === 0) {
      setmessage("No operation to visualize");
      return;
    }
    setisPlaying(true);
  };

  const PauseVisualization = () => {
    setisPlaying(false);
  };

  const StepForward = () => {
    if (currentstep < steps.length) {
      const step = steps[currentstep];
      if (!step) return;

      if (arrayType === "1D" && step.type.includes("1d")) {
        set1Darray([...step.array]);
        sethighlightidx(step.idx);
      } else if (arrayType === "2D" && step.type.includes("2d")) {
        set2Darray(step.array.map((r) => [...r]));
        sethighlight2D([step.row, step.col]);
      }

      setmessage(step.message);
      setCurrentStep((prev) => prev + 1);

      if (currentstep === steps.length - 1) setComplete(true);
    }
  };

  const StepBackward = () => {
    if (currentstep <= 1) {
      setCurrentStep(0);
      setComplete(false);
      return;
    }

    const step = steps[currentstep - 2];
    if (!step) return;

    setCurrentStep((prev) => prev - 1);

    if (arrayType === "1D" && step.type.includes("1d")) {
      set1Darray([...step.array]);
      sethighlightidx(step.idx);
    } else if (arrayType === "2D" && step.type.includes("2d")) {
      set2Darray(step.array.map((r) => [...r]));
      sethighlight2D([step.row, step.col]);
    }

    setmessage(step.message);
    setComplete(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-10 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
            Array Visualization
          </h1>
          <p className="text-lg text-slate-400 font-light">
            Interactive 1D & 2D Array Visualizations with step-by-step execution
          </p>
        </div>

        {/* Dimension Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-900/80 backdrop-blur-md rounded-2xl p-1.5 border border-slate-800 shadow-xl">
            <button
              onClick={() => {
                setArrayType("1D");
                resetVisualization();
              }}
              className={`px-8 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                arrayType === "1D"
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              1D Array
            </button>
            <button
              onClick={() => {
                setArrayType("2D");
                resetVisualization();
              }}
              className={`px-8 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                arrayType === "2D"
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              2D Array
            </button>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[300px] flex flex-col items-center justify-center">
          <h3 className="text-xl font-medium text-slate-200 mb-10 tracking-wide uppercase text-sm">
            {arrayType === "1D" ? "1D Layout" : "2D Grid"}
          </h3>

          {arrayType === "1D" ? (
            <div className="flex justify-center items-center gap-3 flex-wrap">
              {array1D.map((value, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div
                    className={`w-16 h-16 flex items-center justify-center border-2 rounded-2xl font-bold text-xl transition-all duration-300 ${
                      highlightidx === index
                        ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.4)] scale-110"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 group-hover:border-slate-600 group-hover:bg-slate-800"
                    }`}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 font-mono">[{index}]</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="inline-block space-y-3">
                {array2D.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3">
                    {row.map((value, colIndex) => (
                      <div key={`${rowIndex}-${colIndex}`} className="flex flex-col items-center group">
                        <div
                          className={`w-16 h-16 flex items-center justify-center border-2 rounded-2xl font-bold text-xl transition-all duration-300 ${
                            highlight2D[0] === rowIndex && highlight2D[1] === colIndex
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110"
                              : "bg-slate-800/50 border-slate-700 text-slate-300 group-hover:border-slate-600 group-hover:bg-slate-800"
                          }`}
                        >
                          {value}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-2 font-mono tracking-tighter">
                          [{rowIndex}][{colIndex}]
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls & Settings */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Action Panel */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Playback & Generation</h3>
            
            <div className="flex flex-wrap gap-3">
              <button onClick={arrayType === "1D" ? generate1Darray : generate2Darray} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all shadow-sm text-sm font-medium">
                🎲 Random {arrayType}
              </button>
              <button onClick={resetVisualization} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all shadow-sm text-sm font-medium">
                ↺ Reset
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={PlayVisualization} disabled={isPlaying || steps.length === 0} className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] font-semibold flex items-center justify-center gap-2">
                ▶ Play
              </button>
              <button onClick={PauseVisualization} disabled={!isPlaying} className="flex-1 px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-semibold flex items-center justify-center gap-2">
                ⏸ Pause
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={StepBackward} disabled={isPlaying || currentstep <= 0} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-xl transition-all text-sm font-medium">
                ⏪ Prev Step
              </button>
              <button onClick={StepForward} disabled={isPlaying || currentstep >= steps.length} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-xl transition-all text-sm font-medium">
                Next Step ⏩
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>Animation Speed</span>
                <span className="font-mono">{speed}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={speed}
                onChange={(e) => setspeed(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Operation Panel */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Operations</h3>
            
            {arrayType === "1D" ? (
              <div className="space-y-5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Value" value={inputVal} onChange={(e) => setinputVal(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                  <input type="number" placeholder="Index" value={inputidx} onChange={(e) => setinputidx(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={addElement1D} className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all font-medium">Add Element</button>
                  <button onClick={deleteElement1D} className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-medium">Delete by Index</button>
                </div>
                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Search Value" value={searchVal} onChange={(e) => setsearchVal(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                  <button onClick={searchElement1D} className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all font-medium">Search 1D</button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 flex-1">
                <div className="grid grid-cols-3 gap-3">
                  <input type="number" placeholder="Val" value={inputVal} onChange={(e) => setinputVal(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                  <input type="number" placeholder="Row" value={inputrow} onChange={(e) => setinputrow(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                  <input type="number" placeholder="Col" value={inputcol} onChange={(e) => setinputcol(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                </div>
                <button onClick={addElement2D} className="w-full px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all font-medium">Update Cell</button>
                
                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Search" value={searchVal} onChange={(e) => setsearchVal(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 p-3 rounded-xl outline-none transition-all placeholder:text-slate-600" />
                  <button onClick={searchElement2D} className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all font-medium">Search 2D</button>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-4 gap-3">
                  <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 p-2.5 rounded-xl outline-none transition-all placeholder:text-slate-600 text-center" placeholder="Rows" />
                  <input type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} className="bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 p-2.5 rounded-xl outline-none transition-all placeholder:text-slate-600 text-center" placeholder="Cols" />
                  <input type="number" value={fillValue} onChange={(e) => setFillValue(e.target.value)} className="bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 p-2.5 rounded-xl outline-none transition-all placeholder:text-slate-600 text-center" placeholder="Fill" />
                  <button onClick={create2Darray} className="px-2 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-xl transition-all font-medium text-xs">Create Grid</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Notifications */}
        <div className="h-16">
          {message && (
            <div className={`p-4 rounded-xl border flex items-center justify-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
              complete 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}>
              {complete ? "🎉 Visualization complete!" : message}
              {operation && !complete && <span className="ml-2 px-2 py-0.5 bg-slate-900 rounded-md text-slate-500 text-xs border border-slate-800 uppercase">{operation}</span>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
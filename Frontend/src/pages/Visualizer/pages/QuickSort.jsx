import React from "react";
import { useState,useEffect,useRef } from "react";
import { Link } from "react-router";

export default function QuickSort(){
    const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
    const [originalArray,setoriginalArray]=useState([64, 34, 25, 12, 22, 11, 90]);
    const [comparing, setComparing] = useState([-1, -1]);
    const [pivot, setPivot] = useState(-1);
    const [partitioned, setPartitioned] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [sorted, setSorted] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [algorithm, setAlgorithm] = useState([]);
    const [complete, setComplete] = useState(false);
    const timeoutRef = useRef(null);

    const generateRandomArray=()=>{
        const newArray=Array.from({length:8},()=>Math.floor(Math.random()*100+1));
        setoriginalArray(newArray);
        setArray(newArray);
        resetVisualization();
    }
    const resetVisualization=()=>{
        setComparing([-1,-1]);
        setIsPlaying(false);
        setPivot(-1);
        setPartitioned([]);
        setSorted([]);
        setCurrentStep(0);
        setAlgorithm([]);
        setComplete(false);
        setArray([...originalArray]);
        if(timeoutRef.current)clearTimeout(timeoutRef.current);

    }

    const generateAlgorithmSteps = (arr) => {
        const steps = [];
        let tempArray = [...arr];
        const sortedIndices = new Set();

        const quickSortSteps = (array, low, high, depth = 0) => {
            if (low < high) {
                const pivotIndex = high;
                steps.push({
                    type: 'select_pivot',
                    pivotIndex: pivotIndex,
                    array: [...array],
                    low,
                    high,
                    description: `Selected pivot: ${array[pivotIndex]} at position ${pivotIndex}`
                });
                const partitionResult = partitionSteps(array, low, high, steps);
                const finalPivotIndex = partitionResult;
                steps.push({
                    type: 'pivot_placed',
                    pivotIndex: finalPivotIndex,
                    array: [...array],
                    description: `Pivot ${array[finalPivotIndex]} is now in its correct position`
                });
                sortedIndices.add(finalPivotIndex);
                if (finalPivotIndex - 1 > low) {
                    steps.push({
                        type: 'recursive_call',
                        low: low,
                        high: finalPivotIndex - 1,
                        array: [...array],
                        description: `Sorting left subarray from ${low} to ${finalPivotIndex - 1}`
                    });
                    quickSortSteps(array, low, finalPivotIndex - 1, depth + 1);
                }

                if (finalPivotIndex + 1 < high) {
                    steps.push({
                        type: 'recursive_call',
                        low: finalPivotIndex + 1,
                        high: high,
                        array: [...array],
                        description: `Sorting right subarray from ${finalPivotIndex + 1} to ${high}`
                    });
                    quickSortSteps(array, finalPivotIndex + 1, high, depth + 1);
                }
            } else if (low === high) {
                sortedIndices.add(low);
                steps.push({
                    type: 'single_element',
                    index: low,
                    array: [...array],
                    description: `Single element ${array[low]} is already in correct position`
                });
            }
        };
        const partitionSteps = (array, low, high, steps) => {
            const pivot = array[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                steps.push({
                    type: 'compare',
                    indices: [j, high],
                    array: [...array],
                    description: `Comparing ${array[j]} with pivot ${pivot}`
                });

                if (array[j] <= pivot) {
                    i++;
                    if (i !== j) {
                        [array[i], array[j]] = [array[j], array[i]];
                        steps.push({
                            type: 'swap',
                            indices: [i, j],
                            array: [...array],
                            description: `Swapping ${array[j]} and ${array[i]} (elements ≤ pivot go left)`
                        });
                    }
                }
            }
            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            steps.push({
                type: 'pivot_swap',
                indices: [i + 1, high],
                array: [...array],
                description: `Moving pivot ${pivot} to its correct position`
            });

            return i + 1;
        };
        quickSortSteps(tempArray, 0, tempArray.length - 1);
        steps.push({
            type: 'completed',
            array: [...tempArray],
            description: 'QuickSort completed! All elements are now sorted.'
        });
        return steps;
    };
    const StartVisualization=()=>{
        if(algorithm.length===0){
            const steps=generateAlgorithmSteps(array);
            setAlgorithm(steps);
        }
        setIsPlaying(true);
    };
    const PauseVisualization=()=>{
        setIsPlaying(false);
        if(timeoutRef.current)clearTimeout(timeoutRef.current);
    };
    const NextStep=()=>{
        if(currentStep<algorithm.length){
            executeStep(algorithm[currentStep]);
            setCurrentStep(currentStep+1);
        }
    };
    const executeStep = (step) => {
        switch (step.type) {
            case 'select_pivot':
                setPivot(step.pivotIndex);
                setArray(step.array);
                setComparing([-1, -1]);
                break;
            case 'compare':
                setComparing(step.indices);
                setArray(step.array);
                break;
            case 'swap':
                setArray(step.array);
                setComparing([-1, -1]);
                break;
            case 'pivot_swap':
                setArray(step.array);
                setComparing([-1, -1]);
                break;
            case 'pivot_placed':
                setSorted(prev => [...prev, step.pivotIndex]);
                setPivot(-1);
                setComparing([-1, -1]);
                break;
            case 'recursive_call':
                setPartitioned(prev => [...prev, { low: step.low, high: step.high }]);
                setPivot(-1);
                setComparing([-1, -1]);
                break;
            case 'single_element':
                setSorted(prev => [...prev, step.index]);
                break;
            case 'completed':
                setSorted( prev => {
                    const allIndices = step.array.map((_, index) => index);
                    return allIndices;
                });
                setComparing([-1, -1]);
                setPivot(-1);
                setPartitioned([]);
                setComplete(true);
                setIsPlaying(false);
                break;
        }
    };
    useEffect(()=>{
        if(isPlaying&&currentStep<algorithm.length){
            timeoutRef.current=setTimeout(()=>{
                executeStep(algorithm[currentStep]);
                setCurrentStep(currentStep+1);
            },speed)
        }
        else if(currentStep>algorithm.length)setIsPlaying(false);
        return ()=>{
            if(timeoutRef.current)clearTimeout(timeoutRef.current);
        };
    },[isPlaying,currentStep,algorithm,speed]);
        
    
    const getBarColor = (idx) => {
        if (sorted.includes(idx)) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
        if (idx === pivot) return 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
        if (comparing.includes(idx)) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
        return 'bg-blue-500/80 border border-blue-400/50';
    };

    const maxVal = Math.max(...array)

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
                        Quick Sort
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-2xl">
                        Watch how Quick Sort divides and conquers by partitioning around a pivot element.
                    </p>
                </div>

                {/* Control Panel */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <button onClick={StartVisualization} disabled={isPlaying||complete} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] font-semibold flex items-center justify-center min-w-[120px]">
                            {algorithm.length===0?"▶ Start":"▶ Resume"}
                        </button>
                        <button onClick={PauseVisualization} disabled={!isPlaying} className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 border border-amber-500/30 rounded-xl transition-all font-semibold min-w-[120px]">
                            ⏸ Pause
                        </button>
                        <button onClick={NextStep} disabled={isPlaying||currentStep>=algorithm.length} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl transition-all font-semibold">
                            Step ⏩
                        </button>
                        <button onClick={resetVisualization} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-semibold">
                            ↺ Reset
                        </button>
                        <button onClick={generateRandomArray} disabled={isPlaying} className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-400 border border-purple-500/30 rounded-xl transition-all font-semibold">
                            🎲 New Array
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Animation Speed</span>
                            <span className="font-mono">{2100-speed}ms</span>
                        </div>
                        <input type="range" min={100} max={2000} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-full sm:w-48 accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"/>
                    </div>
                </div>

                {/* Visualization Canvas */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col justify-end relative overflow-hidden">
                    {/* Decorative Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                    <div className="flex items-end justify-center gap-2 sm:gap-3 h-80 z-10 w-full overflow-x-auto pb-4">
                        {array.map((value,index)=>(
                            <div key={index} className="flex flex-col items-center group">
                                <div className="mb-3 text-sm font-bold text-slate-300 group-hover:-translate-y-1 transition-transform">
                                    {value}
                                </div>
                                <div
                                    className={`w-8 sm:w-12 ${getBarColor(index)} transition-all duration-300 ease-in-out rounded-t-xl opacity-90 group-hover:opacity-100`}
                                    style={{
                                        height: `${(value /maxVal) * 250}px`,
                                        minHeight: '24px'
                                    }}
                                />
                                <div className="mt-3 text-xs font-mono text-slate-500">
                                    [{index}]
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Live Status & Legend */}
                    <div className="lg:col-span-2 space-y-6 flex flex-col">
                        <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
                            complete ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/50 border-slate-800 backdrop-blur-xl"
                        }`}>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">💬 Live Algorithm Status</h3>
                            {algorithm.length > 0 && currentStep > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                                            {currentStep}
                                        </div>
                                        <p className="text-lg text-slate-200 pt-0.5 leading-relaxed">
                                            {algorithm[currentStep - 1]?.description}
                                        </p>
                                    </div>
                                    {complete && (
                                        <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center gap-4">
                                            <div className="text-3xl">🎉</div>
                                            <div>
                                                <p className="text-emerald-400 font-bold text-lg">Sorting Complete!</p>
                                                <p className="text-emerald-500/80 text-sm mt-1">The array has been successfully sorted.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">Press Start to begin the visualization.</p>
                            )}
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Color Legend</h3>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-500/80 border border-blue-400/50 rounded-lg"></div>
                                    <span className="text-slate-300 font-medium">Unsorted</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-purple-500 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                    <span className="text-slate-300 font-medium">Pivot</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-red-500 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                    <span className="text-slate-300 font-medium">Comparing/Swapping</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-slate-300 font-medium">Sorted</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentation */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">📖 Algorithm Details</h3>
                        <div className="text-slate-300 space-y-4 text-sm leading-relaxed">
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <strong className="text-blue-400 block mb-1">Concept</strong>
                                Selects a pivot element and partitions the array around it, recursively sorting the left and right subarrays.
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <strong className="text-amber-400 block mb-1">Time Complexity</strong>
                                O(n log n) — Average Case<br/>
                                O(n²) — Worst Case
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <strong className="text-purple-400 block mb-1">Space Complexity</strong>
                                O(log n) — Call stack depth
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );




}
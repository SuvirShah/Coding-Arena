import React from "react";
import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { 
    setActiveTopic, 
    updateVisualizationData, 
    setCurrentStep, 
    setIsPlaying, 
    setSpeed 
} from "../../../store/visualizerSlice";

const DEFAULT_DATA = {
    array: [64, 34, 25, 12, 22, 11, 90],
    originalArray: [64, 34, 25, 12, 22, 11, 90],
    comparing: [-1, -1],
    sorted: [],
    algorithm: [],
    complete: false,
};

export default function BubbleSort() {
    const dispatch = useDispatch();
    const { 
        visualizationData, 
        currentStep, 
        isPlaying, 
        speed 
    } = useSelector((state) => state.visualizer);

    const timerRef = useRef(null);

    // Live refs to avoid stale closures in the interval callback
    const stepRef = useRef(currentStep);
    const dataRef = useRef(visualizationData);

    // Keep refs in sync with Redux state on every render
    useEffect(() => { stepRef.current = currentStep; }, [currentStep]);
    useEffect(() => { dataRef.current = visualizationData; }, [visualizationData]);

    // Derive display values (never stale — read fresh each render)
    const stateData = visualizationData || DEFAULT_DATA;
    const { array, originalArray, comparing, sorted, algorithm, complete } = stateData;

    // --- Mount: set topic + seed initial data if empty ---
    useEffect(() => {
        dispatch(setActiveTopic('bubble-sort'));
        if (!visualizationData) {
            dispatch(updateVisualizationData(DEFAULT_DATA));
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            dispatch(setIsPlaying(false));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // --- Helper: apply a single algorithm step to Redux ---
    const applyStep = useCallback((stepObj, currentSorted, currentData) => {
        const base = { ...currentData };
        if (stepObj.type === "compare") {
            dispatch(updateVisualizationData({ ...base, comparing: stepObj.indices, array: stepObj.array }));
        } else if (stepObj.type === "swap") {
            dispatch(updateVisualizationData({ ...base, array: stepObj.array }));
        } else if (stepObj.type === "sorted") {
            dispatch(updateVisualizationData({ ...base, sorted: [...currentSorted, ...stepObj.indices], comparing: [-1, -1] }));
        } else if (stepObj.type === "completed") {
            dispatch(updateVisualizationData({ ...base, sorted: [...currentSorted, ...stepObj.indices], comparing: [-1, -1], complete: true }));
            dispatch(setIsPlaying(false));
        }
    }, [dispatch]);

    // --- Core playback loop (setInterval + refs) ---
    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            return;
        }

        timerRef.current = setInterval(() => {
            const data = dataRef.current || DEFAULT_DATA;
            const steps = data.algorithm || [];
            const step = stepRef.current;

            if (step < steps.length) {
                const stepObj = steps[step];
                const currentSorted = data.sorted || [];
                applyStep(stepObj, currentSorted, data);
                const nextStep = step + 1;
                stepRef.current = nextStep;
                dispatch(setCurrentStep(nextStep));
            } else {
                dispatch(setIsPlaying(false));
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }, speed);

        return () => {
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        };
    }, [isPlaying, speed, dispatch, applyStep]);

    // --- Generate algorithm steps (pure function) ---
    const generateAlgorithmSteps = (arr) => {
        const steps = [];
        const arrayLength = arr.length;
        let tempArray = [...arr];
        for (let i = 0; i < arrayLength - 1; i++) {
            for (let j = 0; j < arrayLength - i - 1; j++) {
                steps.push({
                    type: 'compare',
                    indices: [j, j + 1],
                    array: [...tempArray],
                    description: `Comparing ${tempArray[j]} and ${tempArray[j + 1]}`
                });

                if (tempArray[j] > tempArray[j + 1]) {
                    [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
                    steps.push({
                        type: 'swap',
                        indices: [j, j + 1],
                        array: [...tempArray],
                        description: `Swapping ${tempArray[j + 1]} and ${tempArray[j]}`
                    });
                }
            }
            steps.push({
                type: 'sorted',
                indices: [arrayLength - i - 1],
                array: [...tempArray],
                description: `Element ${tempArray[arrayLength - i - 1]} is now in its correct position`
            });
        }
        steps.push({
            type: 'completed',
            indices: [0],
            array: [...tempArray],
            description: 'All elements are now sorted!'
        });
        return steps;
    };

    // --- Button handlers ---
    const StartVisualization = () => {
        let currentAlgorithm = algorithm;
        if (currentAlgorithm.length === 0) {
            const steps = generateAlgorithmSteps(array);
            const newData = { ...stateData, algorithm: steps };
            dispatch(updateVisualizationData(newData));
            dataRef.current = newData; // Immediately update ref so the interval sees it
        }
        dispatch(setIsPlaying(true));
    };

    const PauseVisualization = () => {
        dispatch(setIsPlaying(false));
    };

    const NextStep = () => {
        if (currentStep < algorithm.length) {
            applyStep(algorithm[currentStep], sorted, stateData);
            const next = currentStep + 1;
            stepRef.current = next;
            dispatch(setCurrentStep(next));
        }
    };

    const generateRandomArray = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100 + 1));
        const newData = {
            array: newArray,
            originalArray: newArray,
            comparing: [-1, -1],
            sorted: [],
            algorithm: [],
            complete: false,
        };
        dispatch(updateVisualizationData(newData));
        dataRef.current = newData;
        stepRef.current = 0;
        dispatch(setCurrentStep(0));
        dispatch(setIsPlaying(false));
    };

    const handleResetVisualization = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        const newData = {
            array: [...originalArray],
            originalArray: [...originalArray],
            comparing: [-1, -1],
            sorted: [],
            algorithm: [],
            complete: false,
        };
        dispatch(updateVisualizationData(newData));
        dataRef.current = newData;
        stepRef.current = 0;
        dispatch(setCurrentStep(0));
        dispatch(setIsPlaying(false));
    };

    const SetBarColor = (idx) => {
        if (sorted.includes(idx)) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
        if (comparing.includes(idx)) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
        return 'bg-blue-500/80 border border-blue-400/50';
    };

    const MaxVal = Math.max(...array);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-10 selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center mb-8">
                    <div className="w-full flex justify-start mb-4">
                        <Link to={"/visualizer/learn/algo/bubble-sort"} className="inline-flex items-center text-slate-400 hover:text-blue-400 font-medium transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 hover:border-blue-500/30 backdrop-blur-md">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
                        Bubble Sort
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-2xl">
                        Watch how Bubble Sort iteratively compares adjacent elements and swaps them to bubble the highest values to the top.
                    </p>
                </div>

                {/* Control Panel */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <button onClick={StartVisualization} disabled={isPlaying || complete} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] font-semibold flex items-center justify-center min-w-[120px]">
                            {algorithm.length === 0 ? "▶ Start" : "▶ Resume"}
                        </button>
                        <button onClick={PauseVisualization} disabled={!isPlaying} className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 border border-amber-500/30 rounded-xl transition-all font-semibold min-w-[120px]">
                            ⏸ Pause
                        </button>
                        <button onClick={NextStep} disabled={isPlaying || currentStep >= algorithm.length} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl transition-all font-semibold">
                            Step ⏩
                        </button>
                        <button onClick={handleResetVisualization} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-semibold">
                            ↺ Reset
                        </button>
                        <button onClick={generateRandomArray} disabled={isPlaying} className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-400 border border-purple-500/30 rounded-xl transition-all font-semibold">
                            🎲 New Array
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Animation Speed</span>
                            <span className="font-mono">{2100 - speed}ms</span>
                        </div>
                        <input type="range" min={100} max={2000} value={speed} onChange={(e) => dispatch(setSpeed(Number(e.target.value)))} className="w-full sm:w-48 accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>

                {/* Visualization Canvas */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col justify-end relative overflow-hidden">
                    {/* Decorative Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                    <div className="flex items-end justify-center gap-2 sm:gap-3 h-80 z-10 w-full overflow-x-auto pb-4">
                        {array.map((value, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                <div className="mb-3 text-sm font-bold text-slate-300 group-hover:-translate-y-1 transition-transform">
                                    {value}
                                </div>
                                <div
                                    className={`w-8 sm:w-12 ${SetBarColor(index)} transition-all duration-300 ease-in-out rounded-t-xl opacity-90 group-hover:opacity-100`}
                                    style={{
                                        height: `${(value / MaxVal) * 250}px`,
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
                        <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${complete ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/50 border-slate-800 backdrop-blur-xl"
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
                                    <div className="w-5 h-5 bg-red-500 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                    <span className="text-slate-300 font-medium">Comparing/Swapping</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-slate-300 font-medium">Sorted (Locked)</span>
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
                                Compare adjacent elements and swap them if the left is greater. The largest unsorted element "bubbles" to its correct position.
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <strong className="text-amber-400 block mb-1">Time Complexity</strong>
                                O(n²) — Average & Worst Case<br />
                                O(n) — Best Case (Already Sorted)
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <strong className="text-purple-400 block mb-1">Space Complexity</strong>
                                O(1) — Sorts in-place
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
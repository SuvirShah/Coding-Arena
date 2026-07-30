import { Link } from "react-router"
import React from "react"

export default function Home(){

  const DataStructures = [
    { name: 'Array', path: '/visualizer/learn/ds/array', icon: '📊' },
    { name: 'Linked List', path: '/visualizer/learn/ds/linked-list', icon: '🔗' },
    { name: 'Stack', path: '/visualizer/learn/ds/stack', icon: '📚' },
    { name: 'Queue', path: '/visualizer/learn/ds/queue', icon: '🚶‍♂️' },
    { name: 'Binary Tree', path: '/visualizer/learn/ds/binary-tree', icon: '🌳' },
    { name: 'Graph', path: '/visualizer/learn/ds/graph', icon: '🕸️' },
    { name: 'Heap', path: '/visualizer/learn/ds/heap', icon: '⛰️' },
    { name: 'Hash Map', path: '/visualizer/learn/ds/hash-map', icon: '🗂️' },
    { name: 'Trie', path: '/visualizer/learn/ds/trie', icon: '🌿' }
  ];

  const Algorithms = [
    { name: 'Bubble Sort', path: '/visualizer/bubble-sort', icon: '🫧' },
    { name: 'Quick Sort', path: '/visualizer/quick-sort', icon: '⚡' },
    { name: 'Binary Search', path: '/visualizer/binary-search', icon: '🔍' },
    { name: "Kadane's Algorithm", path: '/visualizer/kadanes-algorithm', icon: '📈' },
    { name: 'Two Sum', path: '/visualizer/two-sum', icon: '🎯' },
    { name: 'Sliding Window', path: '/visualizer/sliding-window', icon: '🪟' },
    { name: 'BFS', path: '/visualizer/bfs', icon: '📡' },
    { name: 'DFS', path: '/visualizer/dfs', icon: '🕳️' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Top Navigation */}
        <div className="w-full flex justify-start mb-8">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-blue-400 font-medium transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 hover:border-blue-500/30 backdrop-blur-md shadow-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to CodeArena
            </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase px-4 py-1">Algorithm Arena</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            DSA Visualizer
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Learn Data Structures through rich educational content. Master Algorithms through interactive visualizations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          
          {/* Data Structures Section — LEARN */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <span className="text-2xl">🏗️</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Data Structures</h2>
            </div>
            <p className="text-sm text-indigo-400/80 font-medium mb-8 ml-16">📖 Study & Learn — Theory, complexity, implementations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DataStructures.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="flex items-center p-4 bg-slate-800/40 border border-slate-700/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 rounded-2xl transition-all duration-300 group hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                > 
                  <div className="text-2xl mr-4 bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                    {item.icon}
                  </div>
                  <div className="font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Algorithms Section — VISUALIZE */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Algorithms</h2>
            </div>
            <p className="text-sm text-emerald-400/80 font-medium mb-8 ml-16">▶ Interactive Visualizers — Simulate, animate, execute</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Algorithms.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="flex items-center p-4 bg-slate-800/40 border border-slate-700/50 hover:bg-emerald-500/10 hover:border-emerald-500/30 rounded-2xl transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                >
                  <div className="text-2xl mr-4 bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                    {item.icon}
                  </div>
                  <div className="font-medium text-slate-300 group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/40 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
              <span className="text-3xl">📖</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Learn</h3>
            <p className="text-slate-400 leading-relaxed">Deep-dive into data structures with rich theory, history, complexity analysis, and implementations in 4 languages.</p>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/40 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
              <span className="text-3xl">▶</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Visualize</h3>
            <p className="text-slate-400 leading-relaxed">Watch algorithms execute step-by-step with animated bars, grids, and real-time status — at your own pace.</p>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/40 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Interview Ready</h3>
            <p className="text-slate-400 leading-relaxed">Every topic includes interview tips, common pitfalls, edge cases, and related LeetCode problems.</p>
          </div>
        </div>

      </div> 
    </div>
  )
}
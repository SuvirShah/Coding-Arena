import React, { useState } from "react";
import TopicNav from "./TopicNav";
import { Link } from "react-router";

export default function LearningLayout({ children }) {
  const [mode, setMode] = useState("ds");

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0A0F1C] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. ONE CLEAN SIDEBAR */}
      <aside className="w-72 flex flex-col bg-[#111827] border-r border-slate-800/60 shadow-xl z-10 flex-shrink-0">
        
        {/* Global Back to App Link */}
        <div className="p-4 border-b border-slate-800/60 bg-[#0A0F1C] flex items-center justify-center">
          <Link to="/" className="w-full flex items-center justify-center py-2 px-3 bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 hover:text-white rounded-lg border border-slate-700/50 transition-colors text-sm font-semibold">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to CodeArena
          </Link>
        </div>

        {/* Top small mode switch (Pills style) */}
        <div className="p-4 border-b border-slate-800/60 bg-[#0d1321]">
          <div className="flex bg-[#1e293b]/50 p-1 rounded-xl shadow-inner border border-slate-700/30">
            <button
              onClick={() => setMode("ds")}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 flex flex-col items-center gap-0.5 ${
                mode === "ds" 
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/40" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span>Structures</span>
              <span className={`text-[9px] tracking-normal font-medium ${mode === "ds" ? "text-blue-200" : "text-slate-600"}`}>📖 Learn</span>
            </button>
            <button
              onClick={() => setMode("algo")}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 flex flex-col items-center gap-0.5 ${
                mode === "algo" 
                  ? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span>Algorithms</span>
              <span className={`text-[9px] tracking-normal font-medium ${mode === "algo" ? "text-purple-200" : "text-slate-600"}`}>▶ Visualize</span>
            </button>
          </div>
        </div>

        {/* Sidebar List Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar">
          <TopicNav mode={mode} />
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#0A0F1C] relative custom-scrollbar scroll-smooth">
        <div className="max-w-5xl mx-auto px-8 py-12 lg:px-16 lg:py-16">
          {children}
        </div>
      </main>

    </div>
  );
}

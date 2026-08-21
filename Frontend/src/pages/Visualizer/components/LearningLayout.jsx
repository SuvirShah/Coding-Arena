import React, { useState } from "react";
import TopicNav from "./TopicNav";
import { Link } from "react-router";

export default function LearningLayout({ children }) {
  const [mode, setMode] = useState("ds");

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0f0d0a] text-[#EAEAEA] overflow-hidden font-sans">
      
      {/* 1. ONE CLEAN SIDEBAR */}
      <aside className="w-72 flex flex-col bg-[#1a1611] border-r border-[#332b21] shadow-xl z-10 flex-shrink-0">
        
        {/* Global Back to App Link */}
        <div className="p-4 border-b border-[#332b21] bg-[#0f0d0a] flex items-center justify-center">
          <Link to="/" className="w-full flex items-center justify-center py-2 px-3 bg-[#332b21]/40 hover:bg-[#332b21]/60 text-[#a09880] hover:text-white rounded-lg border border-[#3d3326] transition-colors text-sm font-semibold">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to CodeArena
          </Link>
        </div>

        {/* Top small mode switch (Pills style) */}
        <div className="p-4 border-b border-[#332b21] bg-[#15120d]">
          <div className="flex bg-[#2a2318]/50 p-1 rounded-xl shadow-inner border border-[#3d3326]/30">
            <button
              onClick={() => setMode("ds")}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 flex flex-col items-center gap-0.5 ${
                mode === "ds" 
                  ? "bg-[#FFD700] text-black shadow-md shadow-yellow-900/40" 
                  : "text-[#a09880] hover:text-[#EAEAEA] hover:bg-[#332b21]/50"
              }`}
            >
              <span>Structures</span>
              <span className={`text-[9px] tracking-normal font-medium ${mode === "ds" ? "text-yellow-900" : "text-[#6b5d45]"}`}>📖 Learn</span>
            </button>
            <button
              onClick={() => setMode("algo")}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 flex flex-col items-center gap-0.5 ${
                mode === "algo" 
                  ? "bg-[#F5A623] text-black shadow-md shadow-amber-900/40" 
                  : "text-[#a09880] hover:text-[#EAEAEA] hover:bg-[#332b21]/50"
              }`}
            >
              <span>Algorithms</span>
              <span className={`text-[9px] tracking-normal font-medium ${mode === "algo" ? "text-amber-900" : "text-[#6b5d45]"}`}>▶ Visualize</span>
            </button>
          </div>
        </div>

        {/* Sidebar List Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar">
          <TopicNav mode={mode} />
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#0f0d0a] relative custom-scrollbar scroll-smooth">
        <div className="max-w-5xl mx-auto px-8 py-12 lg:px-16 lg:py-16">
          {children}
        </div>
      </main>

    </div>
  );
}

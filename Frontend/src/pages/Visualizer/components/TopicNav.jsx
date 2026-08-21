import React, { useState } from "react";
import { NavLink } from "react-router";
import { structuresData } from "../data/structuresData";

const algorithms = [
  {
    category: "Sorting",
    items: [
      { id: "bubble-sort", name: "Bubble Sort" },
      { id: "quick-sort", name: "Quick Sort" },
      { id: "merge-sort", name: "Merge Sort" }
    ]
  },
  {
    category: "Searching",
    items: [
      { id: "binary-search", name: "Binary Search" },
      { id: "linear-search", name: "Linear Search" }
    ]
  },
  {
    category: "Graph",
    items: [
      { id: "bfs", name: "Breadth First Search (BFS)" },
      { id: "dfs", name: "Depth First Search (DFS)" }
    ]
  },
  {
    category: "Dynamic Prog",
    items: [
      { id: "kadanes-algorithm", name: "Kadane's Algorithm" }
    ]
  },
  {
    category: "Patterns",
    items: [
      { id: "two-sum", name: "Two Pointers" },
      { id: "sliding-window", name: "Sliding Window" }
    ]
  }
];

export default function TopicNav({ mode }) {
  const [openCategories, setOpenCategories] = useState({
    "Sorting": true,
    "Searching": true,
    "Graph": true,
    "Dynamic Prog": true,
    "Patterns": true
  });

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getLinkClass = (isActive, type) => {
    const base = "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent";
    if (isActive) {
      return type === 'ds' 
        ? `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(255,215,0,0.05)]`
        : `${base} bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,166,35,0.05)]`;
    }
    return `${base} text-[#a09880] hover:text-[#EAEAEA] hover:bg-[#332b21]/40`;
  };

  // Data Structures Mode
  if (mode === "ds") {
    return (
      <ul className="space-y-1.5">
        {Object.entries(structuresData).map(([id, data]) => (
          <li key={id}>
            <NavLink to={`/visualizer/learn/ds/${id}`} className={({ isActive }) => getLinkClass(isActive, 'ds')}>
              {data.title}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  // Algorithms Mode
  return (
    <div className="space-y-6">
      {algorithms.map((group) => (
        <div key={group.category} className="space-y-2">
          <button 
            onClick={() => toggleCategory(group.category)}
            className="w-full flex items-center justify-between px-2 text-[11px] font-extrabold text-[#a09880] uppercase tracking-widest hover:text-[#EAEAEA] transition-colors"
          >
            {group.category}
            <svg 
              className={`w-3.5 h-3.5 transition-transform duration-300 ${openCategories[group.category] ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${openCategories[group.category] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="space-y-1 mt-1">
              {group.items.map(algo => (
                <li key={algo.id}>
                  <NavLink to={`/visualizer/learn/algo/${algo.id}`} className={({ isActive }) => getLinkClass(isActive, 'algo')}>
                    {algo.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

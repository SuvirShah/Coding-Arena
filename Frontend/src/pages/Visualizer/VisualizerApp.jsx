import React from "react";
import { Routes, Route } from "react-router";
import Home from "./components/Home";
import LearningPage from "./pages/LearningPage";
import ArrayVisualizer from "./pages/Array";
import BFS from "./pages/BFS";
import BinarySearch from "./pages/BinarySearch";
import BubbleSort from "./pages/Bubble_Sort";
import DFS from "./pages/DFS";
import KadanesAlgorithm from "./pages/KadanesAlgorithm";
import QuickSort from "./pages/QuickSort";
import SlidingWindow from "./pages/SlidingWindow";
import TwoSum from "./pages/TwoSum";

export default function VisualizerApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="learn/*" element={<LearningPage />} />
      <Route path="array" element={<ArrayVisualizer />} />
      <Route path="bfs" element={<BFS />} />
      <Route path="binary-search" element={<BinarySearch />} />
      <Route path="bubble-sort" element={<BubbleSort />} />
      <Route path="dfs" element={<DFS />} />
      <Route path="kadanes-algorithm" element={<KadanesAlgorithm />} />
      <Route path="quick-sort" element={<QuickSort />} />
      <Route path="sliding-window" element={<SlidingWindow />} />
      <Route path="two-sum" element={<TwoSum />} />
    </Routes>
  );
}

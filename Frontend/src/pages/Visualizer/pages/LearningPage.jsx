import React from "react";
import { Routes, Route, Navigate } from "react-router";
import LearningLayout from "../components/LearningLayout";
import StructureDetail from "../components/StructureDetail";
import AlgorithmDetail from "../components/AlgorithmDetail";

export default function LearningPage() {
  return (
    <LearningLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/visualizer/learn/ds/array" replace />} />
        <Route path="ds/:id" element={<StructureDetail />} />
        <Route path="algo/:id" element={<AlgorithmDetail />} />
        {/* Fallback */}
        <Route path="*" element={<div>Topic not found.</div>} />
      </Routes>
    </LearningLayout>
  );
}

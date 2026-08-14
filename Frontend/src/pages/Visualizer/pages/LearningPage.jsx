import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import LearningLayout from "../components/LearningLayout";
import StructureDetail from "../components/StructureDetail";
import AlgorithmDetail from "../components/AlgorithmDetail";
import { setActiveTopic, setSelectedCategory } from "../../../store/visualizerSlice";

export default function LearningPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Sync the current learning route into Redux so the visualizer
  // can restore this topic when the user navigates back.
  useEffect(() => {
    // location.pathname is e.g. "/visualizer/learn/ds/array"
    // We need the relative path from /visualizer/, i.e. "learn/ds/array"
    const fullPath = location.pathname;
    const relative = fullPath.replace(/^\/visualizer\//, '');
    if (relative && relative !== '') {
      dispatch(setActiveTopic(relative));
    }

    // Also sync the category based on the route
    if (fullPath.includes('/learn/ds/')) {
      dispatch(setSelectedCategory('structures'));
    } else if (fullPath.includes('/learn/algo/')) {
      dispatch(setSelectedCategory('algorithms'));
    }
  }, [location.pathname, dispatch]);

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

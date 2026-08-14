import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCategory: 'structures',
  activeTopic: 'learn/ds/array',
  visualizationData: null,
  currentStep: 0,
  isPlaying: false,
  speed: 500,
};
const visualizerSlice = createSlice({
  name: 'visualizer',
  initialState,
  reducers: {
    setActiveTopic(state, action) {
      state.activeTopic = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    updateVisualizationData(state, action) {
      state.visualizationData = action.payload;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setSpeed(state, action) {
      state.speed = action.payload;
    },
    resetVisualizer(state) {
      state.visualizationData = null;
      state.currentStep = 0;
      state.isPlaying = false;
    },
  },
});

export const {
  setActiveTopic,
  setSelectedCategory,
  updateVisualizationData,
  setCurrentStep,
  setIsPlaying,
  setSpeed,
  resetVisualizer,
} = visualizerSlice.actions;

export default visualizerSlice.reducer;

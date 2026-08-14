import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../pages/authSlice';
import { apiSlice } from "../pages/apiSlice";
import visualizerReducer from "./visualizerSlice";


export const store=configureStore({
    reducer:{
        auth:authReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
        visualizer: visualizerReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apiSlice.middleware)
});
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { markSessionExpired } from '../pages/authSlice';
import { apiSlice } from "../pages/apiSlice";
import visualizerReducer from "./visualizerSlice";
import { setUnauthorizedHandler } from "../utils/axiosClient";

export const store=configureStore({
    reducer:{
        auth:authReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
        visualizer: visualizerReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

// Any call ending will get  that gets a 401 while logged in ends the session in the UI
setUnauthorizedHandler(() => store.dispatch(markSessionExpired()));
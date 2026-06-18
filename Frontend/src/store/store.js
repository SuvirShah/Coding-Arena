import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../pages/authSlice';


export const store=configureStore({
    reducer:{
        auth:authReducer
    }
});
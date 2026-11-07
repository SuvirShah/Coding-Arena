import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

// Server errors arrive as { message } JSON or as a plain string; always end up with readable text
const errorPayload = (error) =>
    error.response?.data || { message: error.message || "Request failed" };
const messageFrom = (payload, fallback) =>
    (typeof payload === "string" ? payload : payload?.message) || fallback;

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', credentials);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get('/user/check');
            return data.user;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post('/user/logout');
            return null;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        // true only until the very first checkAuth finishes. The app shows a full-screen
        // spinner for this alone, so forms keep their state while a login/signup is in flight.
        initializing: true,
        // true while a login / signup / logout request is in flight (drives button spinners)
        loading: false,
        error: null,
        // the user WAS logged in but the server says the session is gone
        sessionExpired: false,
        // this tab has had a logged-in user at some point (so "not logged in" now means log in, not sign up)
        wasAuthenticated: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Dispatched when any API call comes back 401 while we think we're logged in
        markSessionExpired: (state) => {
            if (state.isAuthenticated) {
                state.isAuthenticated = false;
                state.user = null;
                state.sessionExpired = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.sessionExpired = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.wasAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = messageFrom(action.payload, "Could not create your account. Please try again.");
                state.isAuthenticated = false;
                state.user = null;
            })
            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.sessionExpired = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.wasAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = messageFrom(action.payload, "Something went wrong. Please try again.");
                state.isAuthenticated = false;
                state.user = null;
            })
            // initial "am I logged in?" check. A 401 here is normal for a visitor, not an error to show.
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.initializing = false;
                state.isAuthenticated = !!action.payload;
                state.wasAuthenticated = state.wasAuthenticated || !!action.payload;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.initializing = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            // logout is applied immediately so the UI never flashes a logged-in page after clicking it
            .addCase(logoutUser.pending, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                state.sessionExpired = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const { clearError, markSessionExpired } = authSlice.actions;
export default authSlice.reducer;
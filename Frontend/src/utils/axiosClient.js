import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://codearena-backend-g0bt.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Calls to these are EXPECTED to return 401 (wrong password, not logged in yet), so they must
// never be treated as "your session expired".
const AUTH_PATHS = ["/user/login", "/user/register", "/user/logout", "/user/check"];

let unauthorizedHandler = null;
// Registered once by the store (kept here so this file never imports the store: no import cycle)
export const setUnauthorizedHandler = (fn) => {
    unauthorizedHandler = fn;
};

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || "";
        if (error.response?.status === 401 && !AUTH_PATHS.some((p) => url.startsWith(p))) {
            unauthorizedHandler?.();
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
import axios from "axios";

import {
    AUTH_TOKEN_KEY,
    AUTH_SESSION_EXPIRED_EVENT
} from "../constants/auth";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


api.interceptors.request.use((config) => {

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
        config.headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,

    (error: unknown) => {

        if (axios.isAxiosError(error)) {

            const status = error.response?.status;
            const url = error.config?.url ?? "";

            const isPublicAuth =
                url.includes("/auth/login") ||
                url.includes("/auth/register");

            if (status === 401 && !isPublicAuth) {

                localStorage.removeItem(AUTH_TOKEN_KEY);

                window.dispatchEvent(
                    new Event(AUTH_SESSION_EXPIRED_EVENT)
                );
            }
        }

        return Promise.reject(error);
    }
);


export default api;

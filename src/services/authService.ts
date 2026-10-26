import api from "./api";

import type {
    LoginRequest,
    RegisterRequest
} from "../types/auth.types";


export async function login(
    credentials: LoginRequest
): Promise<unknown> {

    const response = await api.post<unknown>(
        "/auth/login",
        credentials
    );

    return response.data;
}


export async function register(
    data: RegisterRequest
): Promise<unknown> {

    const response = await api.post<unknown>(
        "/auth/register",
        data
    );

    return response.data;
}


export async function getCurrentUser(): Promise<unknown> {

    const response = await api.get<unknown>(
        "/auth/me"
    );

    return response.data;
}

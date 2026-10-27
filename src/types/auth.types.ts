export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    teamName: string;
}

export type AuthStatus =
    | "checking"
    | "authenticated"
    | "unauthenticated";
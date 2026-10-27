import {
    createContext,
    useEffect,
    useCallback,
    useState,
    type ReactNode
} from "react";

import {
    login as loginRequest,
    register as registerRequest,
    getCurrentUser
} from "../services/authService";

import type {
    AuthStatus,
    LoginRequest,
    RegisterRequest
} from "../types/auth.types";

import {
    AUTH_TOKEN_KEY,
    AUTH_SESSION_EXPIRED_EVENT
} from "../constants/auth";


export interface AuthContextValue {
    user: unknown;
    status: AuthStatus;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(undefined);


interface AuthProviderProps {
    children: ReactNode;
}


// Validación de la respuesta sin utilizar any.
// Confirmaremos los nombres exactos con Swagger.
function extractToken(response: unknown): string | null {

    if (typeof response !== "object" || response === null) {
        return null;
    }

    if ("accessToken" in response &&
        typeof response.accessToken === "string") {
        return response.accessToken;
    }

    if ("token" in response &&
        typeof response.token === "string") {
        return response.token;
    }

    return null;
}


export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<unknown>(null);

    const [status, setStatus] =
        useState<AuthStatus>("checking");


    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        setStatus("unauthenticated");
    }, []);

    useEffect(() => {
        window.addEventListener(
            AUTH_SESSION_EXPIRED_EVENT,
            logout
        );

        return () => {
            window.removeEventListener(
                AUTH_SESSION_EXPIRED_EVENT,
                logout
            );
        };
    }, [logout]);


    async function startSession(token: string) {

        localStorage.setItem(AUTH_TOKEN_KEY, token);

        try {
            const currentUser = await getCurrentUser();

            setUser(currentUser);
            setStatus("authenticated");

        } catch (error) {
            logout();
            throw error;
        }
    }


    async function login(data: LoginRequest) {

        const response = await loginRequest(data);
        const token = extractToken(response);

        if (!token) {
            throw new Error("La API no devolvió un token reconocido");
        }

        await startSession(token);
    }


    async function register(data: RegisterRequest) {

        const response = await registerRequest(data);
        const token = extractToken(response);

        if (token) {
            await startSession(token);
        } else {
            await login({
                email: data.email,
                password: data.password
            });
        }
    }


    // Restaurar la sesión al cargar la aplicación.
    useEffect(() => {

        let active = true;

        async function restoreSession() {

            const token = localStorage.getItem(AUTH_TOKEN_KEY);

            if (!token) {
                setStatus("unauthenticated");
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                if (!active) return;

                setUser(currentUser);
                setStatus("authenticated");

            } catch {
                if (!active) return;

                logout();
            }
        }

        void restoreSession();

        return () => {
            active = false;
        };

    }, []);


    const value: AuthContextValue = {
        user,
        status,
        isAuthenticated: status === "authenticated",
        isInitializing: status === "checking",
        login,
        register,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

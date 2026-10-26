import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";


export default function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const state = location.state as {
        from?: {
            pathname?: string;
            search?: string;
            hash?: string;
        };
    } | null;

    const from = state?.from;

    const redirectTo =
        from?.pathname?.startsWith("/") &&
        !from.pathname.startsWith("//")
            ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
            : "/dashboard";


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (loading) return;

        setLoading(true);
        setError("");

        try {

            await login({ email, password });

            navigate(redirectTo, {
                replace: true
            });

        } catch (err: unknown) {

            if (isAxiosError(err)) {

                if (err.response?.status === 401) {
                    setError("Correo o contraseña incorrectos.");
                } else if (!err.response) {
                    setError("No se pudo conectar con el servidor.");
                } else {
                    setError("No se pudo iniciar sesión.");
                }

            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado."
                );
            }

        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-xl border border-slate-700 bg-slate-900 p-8"
            >

                <h1 className="text-2xl font-bold text-center">
                    Iniciar sesión
                </h1>

                <div>
                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-600"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-600"
                    />
                </div>

                {error && (
                    <p role="alert" className="text-red-400 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-amber-500 p-3 font-bold text-black disabled:opacity-50"
                >
                    {loading ? "Iniciando sesión..." : "Ingresar"}
                </button>

                <p className="text-center text-sm text-slate-400">
                    ¿No tienes una tripulación?{" "}
                    <Link
                        to="/register"
                        className="text-amber-400 hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>

            </form>
        </main>
    );
}

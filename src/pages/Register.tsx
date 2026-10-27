import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

type Field = "teamName" | "email" | "password";
type FieldErrors = Partial<Record<Field, string>>;

export default function Register() {

    const navigate = useNavigate();
    const { register } = useAuth();

    const [teamName, setTeamName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>({});

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loading) return;

        setLoading(true);
        setError("");
        setFieldErrors({});

        try {
            await register({ teamName, email, password });

            navigate("/dashboard", { replace: true });

        } catch (err: unknown) {

            if (isAxiosError(err) && err.response) {

                const data: unknown = err.response.data;

                if (typeof data === "object" && data !== null) {

                    const result = data as Record<string, unknown>;
                    const fields: FieldErrors = {};

                    const rawErrors = result.fieldErrors ?? result.errors;

                    if (typeof rawErrors === "object" &&
                        rawErrors !== null &&
                        !Array.isArray(rawErrors)) {

                        const errors = rawErrors as Record<string, unknown>;

                        for (const field of ["teamName", "email", "password"] as const) {
                            const value = errors[field];

                            if (typeof value === "string") {
                                fields[field] = value;
                            } else if (Array.isArray(value)) {
                                fields[field] = value
                                    .filter((item): item is string =>
                                        typeof item === "string")
                                    .join(", ");
                            }
                        }
                    }

                    setFieldErrors(fields);

                    setError(
                        typeof result.message === "string"
                            ? result.message
                            : "No se pudo registrar la tripulación."
                    );

                } else {
                    setError("No se pudo completar el registro.");
                }

            } else {
                setError("Error de conexión. Inténtalo nuevamente.");
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
                    Registrar tripulación
                </h1>

                <div>
                    <label htmlFor="teamName">Nombre de tripulación</label>
                    <input
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-600"
                    />
                    {fieldErrors.teamName && (
                        <p className="text-red-400 text-sm">{fieldErrors.teamName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-600"
                    />
                    {fieldErrors.email && (
                        <p className="text-red-400 text-sm">{fieldErrors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full mt-2 p-3 rounded bg-slate-800 border border-slate-600"
                    />
                    {fieldErrors.password && (
                        <p className="text-red-400 text-sm">{fieldErrors.password}</p>
                    )}
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
                    {loading ? "Registrando..." : "Crear tripulación"}
                </button>
            </form>

        </main>
    );
}

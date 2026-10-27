import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getWanted, getCrewOptions } from "./wantedService";
import type { CrewOption } from "./wantedService";

import WantedCard from "./WantedCard";
import WantedSearch from "./WantedSearch";
import WantedFilters from "./WantedFilters";
import Pagination from "./Pagination";

import type {
    WantedQuery,
    WantedResponse,
    WantedSort,
} from "./wanted";

const STATUS_OPTIONS = [
    { value: "AT_LARGE", label: "En libertad" },
    { value: "CAPTURED", label: "Capturado" },
    { value: "MISSING", label: "Desaparecido" },
];

const FRUIT_OPTIONS = [
    { value: "PARAMECIA", label: "Paramecia" },
    { value: "ZOAN", label: "Zoan" },
    { value: "LOGIA", label: "Logia" },
    { value: "NONE", label: "Sin fruta" },
];

const SORT_OPTIONS: WantedSort[] = [
    "bounty,desc",
    "name,asc",
    "updatedAt,desc",
];

function readFilters(params: URLSearchParams): WantedQuery {
    const pageValue = params.get("page") ?? "0";
    const parsedPage = Number(pageValue);

    const page =
        /^\d+$/.test(pageValue) &&
            Number.isSafeInteger(parsedPage)
            ? parsedPage
            : 0;

    const parsedSize = Number(params.get("size") ?? "10");

    const size: 10 | 20 | 50 =
        parsedSize === 20
            ? 20
            : parsedSize === 50
                ? 50
                : 10;

    const requestedSort = params.get("sort") ?? "";

    const sort: WantedSort = SORT_OPTIONS.includes(
        requestedSort as WantedSort
    )
        ? (requestedSort as WantedSort)
        : "bounty,desc";

    const requestedStatus = params.get("status") ?? "";
    const requestedFruit = params.get("fruit") ?? "";

    const status = STATUS_OPTIONS.some(
        (option) => option.value === requestedStatus
    )
        ? requestedStatus
        : "";

    const fruit = FRUIT_OPTIONS.some(
        (option) => option.value === requestedFruit
    )
        ? requestedFruit
        : "";

    return {
        page,
        size,
        sort,
        q: (params.get("q") ?? "").trim().slice(0, 100),
        status: status || undefined,
        crewId: (params.get("crewId") ?? "").trim().slice(0, 200)
            || undefined,
        fruit: fruit || undefined,
    };
}

function writeFilters(query: WantedQuery): URLSearchParams {
    const params = new URLSearchParams();

    if (query.page > 0) {
        params.set("page", String(query.page));
    }

    if (query.size !== 10) {
        params.set("size", String(query.size));
    }

    if (query.sort && query.sort !== "bounty,desc") {
        params.set("sort", query.sort);
    }

    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    if (query.crewId) params.set("crewId", query.crewId);
    if (query.fruit) params.set("fruit", query.fruit);

    return params;
}

export default function WantedPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const paramsKey = searchParams.toString();

    const filters = useMemo(
        () => readFilters(new URLSearchParams(paramsKey)),
        [paramsKey]
    );

    const {
        page,
        size,
        sort,
        q,
        status,
        crewId,
        fruit,
    } = filters;

    const [search, setSearch] = useState(q ?? "");

    const [data, setData] = useState<WantedResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    const [crewOptions, setCrewOptions] =
        useState<CrewOption[]>([]);

    const [crewError, setCrewError] = useState(false);
    const [crewRetry, setCrewRetry] = useState(0);

    // Mantener la URL válida.
    useEffect(() => {
        const canonical = writeFilters(filters).toString();

        if (paramsKey !== canonical) {
            setSearchParams(canonical, { replace: true });
        }
    }, [paramsKey, filters, setSearchParams]);

    // Sincronizar la búsqueda al navegar atrás o adelante.
    useEffect(() => {
        setSearch(q ?? "");
    }, [q]);

    function updateFilters(
        changes: Partial<WantedQuery>,
        resetPage = true
    ) {
        setSearchParams((previous) => {
            const current = readFilters(previous);

            const next: WantedQuery = {
                ...current,
                ...changes,
                page: resetPage
                    ? 0
                    : changes.page ?? current.page,
            };

            return writeFilters(next);
        });
    }

    // Búsqueda con debounce.
    useEffect(() => {
        const value = search.trim().slice(0, 100);

        if (value === (q ?? "")) return;

        const timer = window.setTimeout(() => {
            setSearchParams(
                (previous) => {
                    const current = readFilters(previous);

                    return writeFilters({
                        ...current,
                        q: value,
                        page: 0,
                    });
                },
                { replace: true }
            );
        }, 400);

        return () => window.clearTimeout(timer);
    }, [search, q, setSearchParams]);

    // Cargar tripulaciones para el selector.
    useEffect(() => {
        const controller = new AbortController();

        setCrewError(false);

        getCrewOptions(controller.signal)
            .then((options) => {
                if (!controller.signal.aborted) {
                    setCrewOptions(options);
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setCrewError(true);
                }
            });

        return () => controller.abort();
    }, [crewRetry]);

    // Consultar carteles con paginación del servidor.
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError("");
        setData(null);

        async function loadWanted() {
            try {
                const result = await getWanted(
                    {
                        page,
                        size,
                        sort,
                        q,
                        status,
                        crewId,
                        fruit,
                    },
                    controller.signal
                );

                if (controller.signal.aborted) return;

                const lastPage = Math.max(0, result.totalPages - 1);

                // Corregir una página fuera de rango.
                if (page > lastPage) {
                    setSearchParams(
                        (previous) => {
                            const current = readFilters(previous);

                            return writeFilters({
                                ...current,
                                page: lastPage,
                            });
                        },
                        { replace: true }
                    );

                    return;
                }

                setData(result);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar los carteles."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadWanted();

        return () => controller.abort();
    }, [
        page,
        size,
        sort,
        q,
        status,
        crewId,
        fruit,
        retry,
        setSearchParams,
    ]);

    function handlePageChange(newPage: number) {
        updateFilters({ page: newPage }, false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const waitingForSearch =
        search.trim().slice(0, 100) !== (q ?? "");

    return (
        <main className="min-h-screen bg-slate-950 p-6 text-white">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mb-2 text-sm uppercase tracking-widest text-amber-400">
                        One Piece
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Carteles de Se Busca
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Explora las recompensas del mundo pirata.
                    </p>
                </header>

                <section className="mb-8 space-y-5 rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <WantedSearch
                        value={search}
                        onChange={setSearch}
                    />

                    <WantedFilters
                        filters={filters}
                        statusOptions={STATUS_OPTIONS}
                        crewOptions={crewOptions}
                        fruitOptions={FRUIT_OPTIONS}
                        onChange={(changes) => updateFilters(changes)}
                    />

                    {crewError && (
                        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-400">
                            <span>
                                No se pudieron cargar las tripulaciones.
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setCrewRetry((previous) => previous + 1)
                                }
                                className="underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                </section>

                <section aria-label="Resultados de búsqueda">
                    {loading || waitingForSearch ? (
                        <div
                            role="status"
                            className="rounded-xl border border-slate-700 p-10 text-center"
                        >
                            Cargando carteles...
                        </div>
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-700 p-10 text-center"
                        >
                            <p className="mb-4 text-red-400">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setRetry((previous) => previous + 1)
                                }
                                className="rounded bg-amber-500 px-4 py-2 font-semibold text-black"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : data ? (
                        <>
                            <p className="mb-6 text-slate-300">
                                Resultados encontrados: {data.totalElements}
                            </p>

                            {data.content.length === 0 ? (
                                <div className="rounded-xl border border-slate-700 p-10 text-center text-slate-400">
                                    No se encontraron carteles con estos filtros.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {data.content.map((wanted) => (
                                        <WantedCard
                                            key={String(wanted.id)}
                                            wanted={wanted}
                                        />
                                    ))}
                                </div>
                            )}

                            <Pagination
                                page={page}
                                totalPages={data.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : null}
                </section>
            </div>
        </main>
    );
}

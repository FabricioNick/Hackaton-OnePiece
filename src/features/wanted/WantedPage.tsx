
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { getWanted } from "./wantedService";
import WantedCard from "./WantedCard";
import WantedSearch from "./WantedSearch";
import WantedFilters from "./WantedFilters";
import Pagination from "./Pagination";

import type {
  WantedQuery,
  WantedResponse,
  WantedSort,
} from "./wanted";

const allowedSorts: WantedSort[] = [
  "bounty,desc",
  "name,asc",
  "updatedAt,desc",
];

export default function WantedPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get("page") ?? "0");
  const page =
    Number.isSafeInteger(rawPage) && rawPage >= 0
      ? rawPage
      : 0;

  const rawSize = Number(searchParams.get("size") ?? "10");
  const size: 10 | 20 | 50 =
    rawSize === 20 || rawSize === 50 ? rawSize : 10;

  const rawSort = searchParams.get("sort") ?? "";
  const sort: WantedSort = allowedSorts.includes(
    rawSort as WantedSort
  )
    ? (rawSort as WantedSort)
    : "bounty,desc";

  const query = searchParams.get("q") ?? "";

  const filters: WantedQuery = {
    page,
    size,
    sort,
    q: query || undefined,
    status: searchParams.get("status") || undefined,
    crewId: searchParams.get("crewId") || undefined,
    fruit: searchParams.get("fruit") || undefined,
  };

  const [search, setSearch] = useState(query);
  const [data, setData] = useState<WantedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    if (search.trim() === query) return;

    const timer = window.setTimeout(() => {
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          const value = search.trim();

          if (value) {
            params.set("q", value);
          } else {
            params.delete("q");
          }

          params.set("page", "0");
          return params;
        },
        { replace: true }
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search, query, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWanted() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const result = await getWanted(
          filters,
          controller.signal
        );

        if (controller.signal.aborted) return;

        const lastPage = Math.max(0, result.totalPages - 1);

        if (page > lastPage) {
          setSearchParams(
            (previous) => {
              const params = new URLSearchParams(previous);
              params.set("page", String(lastPage));
              return params;
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
              : "Error al cargar los carteles"
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
    query,
    filters.status,
    filters.crewId,
    filters.fruit,
    retry,
    setSearchParams,
  ]);

  function updateFilters(changes: Partial<WantedQuery>) {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      const keys = [
        "status",
        "crewId",
        "fruit",
        "sort",
        "size",
      ] as const;

      for (const key of keys) {
        const value = changes[key];

        if (value === undefined) continue;

        if (value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      params.set("page", "0");
      return params;
    });
  }

  function changePage(newPage: number) {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);
      params.set("page", String(Math.max(0, newPage)));
      return params;
    });
  }

  const waitingForSearch = search.trim() !== query;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">
          Carteles de Se Busca
        </h1>

        <p className="mb-6 text-slate-400">
          Explora las recompensas del mundo pirata.
        </p>

        <div className="mb-6">
          <WantedSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="mb-8">
          <WantedFilters
            filters={filters}
            statusOptions={[]}
            crewOptions={[]}
            fruitOptions={[]}
            onChange={updateFilters}
          />
        </div>

        <div className="min-h-80">
          {waitingForSearch || loading ? (
            <p role="status" className="py-8 text-slate-300">
              Cargando personajes...
            </p>
          ) : error ? (
            <div role="alert" className="py-8">
              <p className="mb-4 text-red-400">{error}</p>

              <button
                onClick={() => setRetry((prev) => prev + 1)}
                className="rounded bg-amber-600 px-4 py-2"
              >
                Reintentar
              </button>
            </div>
          ) : data ? (
            <>
              <p className="mb-6 text-slate-300">
                Resultados: {data.totalElements}
              </p>

              {data.content.length === 0 ? (
                <p className="py-8 text-slate-400">
                  No se encontraron personajes.
                </p>
              ) : (
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.content.map((wanted) => (
                    <WantedCard
                      key={String(wanted.id)}
                      wanted={wanted}
                    />
                  ))}
                </section>
              )}

              <Pagination
                page={page}
                totalPages={data.totalPages}
                onPageChange={changePage}
              />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}

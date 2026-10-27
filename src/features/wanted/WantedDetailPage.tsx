
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";

import { getWantedById } from "./wantedService";
import type { WantedItem } from "./wanted";

function display(value: unknown): string {
  if (typeof value === "number") {
    return value.toLocaleString("en-US");
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "No disponible";
}

export default function WantedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [wanted, setWanted] = useState<WantedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const returnTo = searchParams.get("returnTo");

  const backUrl =
    returnTo === "/wanted" || returnTo?.startsWith("/wanted?")
      ? returnTo
      : "/wanted";

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetail() {
      setLoading(true);
      setError("");
      setWanted(null);

      try {
        if (!id) {
          throw new Error("Identificador inválido.");
        }

        const result = await getWantedById(
          id,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setWanted(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el cartel."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => controller.abort();
  }, [id, retry]);

  const imageUrl =
    typeof wanted?.imageUrl === "string"
      ? wanted.imageUrl
      : null;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          to={backUrl}
          className="mb-8 inline-block text-amber-400 hover:underline"
        >
          ← Volver a los carteles
        </Link>

        {loading ? (
          <p role="status">Cargando cartel...</p>
        ) : error ? (
          <div role="alert" className="space-y-4">
            <p className="text-red-400">{error}</p>

            <button
              onClick={() => setRetry((prev) => prev + 1)}
              className="rounded-lg bg-amber-500 px-4 py-2 text-black"
            >
              Reintentar
            </button>
          </div>
        ) : wanted ? (
          <article className="overflow-hidden rounded-xl border border-amber-700 bg-slate-900">
            <div className="bg-amber-100 p-8 text-center text-amber-950">
              <p className="text-4xl font-bold">WANTED</p>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={display(wanted.name)}
                  className="mx-auto my-6 max-h-80 object-contain"
                />
              )}

              <h1 className="mt-4 text-3xl font-bold">
                {display(wanted.name)}
              </h1>

              {typeof wanted.epithet === "string" && (
                <p className="mt-2 italic">
                  {wanted.epithet}
                </p>
              )}

              <p className="mt-5 text-2xl font-bold">
                ฿ {display(wanted.bounty)}
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-sm text-slate-400">
                  Estado
                </h2>
                <p>{display(wanted.status)}</p>
              </div>

              <div>
                <h2 className="text-sm text-slate-400">
                  Tripulación
                </h2>
                <p>{display(wanted.crewName)}</p>
              </div>

              <div>
                <h2 className="text-sm text-slate-400">
                  Fruta del diablo
                </h2>
                <p>{display(wanted.fruit)}</p>
              </div>
            </div>
          </article>
        ) : (
          <p>No se encontró el cartel.</p>
        )}
      </div>
    </main>
  );
}

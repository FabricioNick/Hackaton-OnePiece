
import { Link, useLocation } from "react-router-dom";
import type { WantedItem } from "./wanted";

interface WantedCardProps {
  wanted: WantedItem;
}

function getText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function WantedCard({ wanted }: WantedCardProps) {
  const location = useLocation();

  const name = getText(wanted.name) || "Sin nombre";
  const epithet = getText(wanted.epithet);
  const status = getText(wanted.status);

  const bounty =
    typeof wanted.bounty === "number"
      ? wanted.bounty.toLocaleString("en-US")
      : getText(wanted.bounty);

  const returnTo = location.pathname + location.search;

  const detailUrl =
    `/wanted/${encodeURIComponent(String(wanted.id))}` +
    `?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <article className="rounded-xl border border-amber-700 bg-amber-50 p-5 shadow-md">
      <div className="mb-4 text-center">
        <p className="text-3xl font-bold text-amber-950">
          WANTED
        </p>

        <h2 className="mt-3 text-2xl font-bold text-amber-950">
          {name}
        </h2>

        {epithet && (
          <p className="mt-2 italic text-amber-800">
            {epithet}
          </p>
        )}
      </div>

      <p className="text-center font-semibold text-amber-950">
        Recompensa: {bounty || "No disponible"}
      </p>

      {status && (
        <p className="mt-3 text-center text-sm text-gray-700">
          Estado: {status}
        </p>
      )}

      <Link
        to={detailUrl}
        className="mt-5 block rounded-lg bg-amber-800 px-4 py-2 text-center font-semibold text-white hover:bg-amber-900"
      >
        Ver cartel
      </Link>
    </article>
  );
}

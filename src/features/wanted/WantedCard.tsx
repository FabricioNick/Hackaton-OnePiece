
import type { WantedItem } from "./wanted";

interface WantedCardProps {
  wanted: WantedItem;
}

function getText(value: unknown): string | null {
  return typeof value === "string" && value.trim()
    ? value
    : null;
}

export default function WantedCard({
  wanted,
}: WantedCardProps) {
  const name = getText(wanted.name) ?? "Sin nombre";
  const epithet = getText(wanted.epithet);
  const status = getText(wanted.status);

  const bounty =
    typeof wanted.bounty === "number"
      ? wanted.bounty.toLocaleString("en-US")
      : getText(wanted.bounty);

  return (
    <article className="rounded-xl border border-amber-700 bg-amber-50 p-5 shadow-md">
      <div className="mb-4 text-center">
        <span className="text-4xl">☠</span>

        <h2 className="mt-2 text-2xl font-bold text-amber-950">
          {name}
        </h2>

        {epithet && (
          <p className="italic text-amber-800">
            {epithet}
          </p>
        )}
      </div>

      {bounty && (
        <p className="text-center font-semibold text-amber-950">
          Recompensa: {bounty}
        </p>
      )}

      {status && (
        <p className="mt-3 text-center text-sm text-gray-700">
          Estado: {status}
        </p>
      )}
    </article>
  );
}


import type { WantedQuery, WantedSort } from "./wanted";

export interface FilterOption {
  value: string;
  label: string;
}

interface WantedFiltersProps {
  filters: WantedQuery;
  statusOptions: FilterOption[];
  crewOptions: FilterOption[];
  fruitOptions: FilterOption[];
  onChange: (changes: Partial<WantedQuery>) => void;
}

export default function WantedFilters({
  filters,
  statusOptions,
  crewOptions,
  fruitOptions,
  onChange,
}: WantedFiltersProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div>
        <label htmlFor="status-filter" className="mb-2 block text-sm">
          Estado
        </label>
        <select
          id="status-filter"
          value={filters.status ?? ""}
          onChange={(e) =>
            onChange({ status: e.target.value || undefined })
          }
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        >
          <option value="">Todos</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="crew-filter" className="mb-2 block text-sm">
          Tripulación
        </label>
        <select
          id="crew-filter"
          value={filters.crewId ?? ""}
          onChange={(e) =>
            onChange({ crewId: e.target.value || undefined })
          }
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        >
          <option value="">Todas</option>
          {crewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fruit-filter" className="mb-2 block text-sm">
          Fruta del diablo
        </label>
        <select
          id="fruit-filter"
          value={filters.fruit ?? ""}
          onChange={(e) =>
            onChange({ fruit: e.target.value || undefined })
          }
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        >
          <option value="">Todas</option>
          {fruitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sort-filter" className="mb-2 block text-sm">
          Ordenar por
        </label>
        <select
          id="sort-filter"
          value={filters.sort ?? "bounty,desc"}
          onChange={(e) =>
            onChange({ sort: e.target.value as WantedSort })
          }
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        >
          <option value="bounty,desc">Mayor recompensa</option>
          <option value="name,asc">Nombre A-Z</option>
          <option value="updatedAt,desc">Más recientes</option>
        </select>
      </div>

      <div>
        <label htmlFor="size-filter" className="mb-2 block text-sm">
          Resultados por página
        </label>
        <select
          id="size-filter"
          value={filters.size}
          onChange={(e) =>
            onChange({
              size: Number(e.target.value) as 10 | 20 | 50,
            })
          }
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </section>
  );
}

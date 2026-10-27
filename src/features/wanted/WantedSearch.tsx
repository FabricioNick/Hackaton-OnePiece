
interface WantedSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function WantedSearch({
  value,
  onChange,
}: WantedSearchProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="wanted-search"
        className="mb-2 block text-sm font-medium text-white"
      >
        Buscar personaje
      </label>

      <input
        id="wanted-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre o epíteto..."
        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none focus:border-amber-400"
      />
    </div>
  );
}

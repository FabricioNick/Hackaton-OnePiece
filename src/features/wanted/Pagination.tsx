
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.max(0, totalPages - 1);

  if (totalPages <= 0) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación de carteles"
      className="mt-8 flex flex-wrap items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onPageChange(0)}
        className="rounded bg-slate-800 px-4 py-2 text-white disabled:opacity-40"
      >
        Primera
      </button>

      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
        className="rounded bg-slate-800 px-4 py-2 text-white disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-sm text-white">
        Página {page + 1} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onPageChange(page + 1)}
        className="rounded bg-slate-800 px-4 py-2 text-white disabled:opacity-40"
      >
        Siguiente
      </button>

      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onPageChange(lastPage)}
        className="rounded bg-slate-800 px-4 py-2 text-white disabled:opacity-40"
      >
        Última
      </button>
    </nav>
  );
}

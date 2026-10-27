import api from "../../services/api";
import type { WantedItem, WantedQuery, WantedResponse } from "./wanted";

export interface CrewOption {
  value: string;
  label: string;
}

export async function getWanted(
  query: WantedQuery,
  signal?: AbortSignal
): Promise<WantedResponse> {
  const response = await api.get<WantedResponse>("/wanted", {
    params: {
      page: query.page,
      size: query.size,
      sort: query.sort,
      q: query.q || undefined,
      status: query.status || undefined,
      crewId: query.crewId || undefined,
      fruit: query.fruit || undefined,
    },
    signal,
  });

  return response.data;
}

export async function getWantedById(
  id: string | number,
  signal?: AbortSignal
): Promise<WantedItem> {
  const response = await api.get<WantedItem>(
    `/wanted/${encodeURIComponent(String(id))}`,
    { signal }
  );

  return response.data;
}

export async function getCrewOptions(
  signal?: AbortSignal
): Promise<CrewOption[]> {
  const response = await api.get<unknown>("/crews", { signal });
  const body = response.data;

  let crews: unknown[] = [];

  if (Array.isArray(body)) {
    crews = body;
  } else if (body !== null && typeof body === "object") {
    const data = body as Record<string, unknown>;

    if (Array.isArray(data.content)) {
      crews = data.content;
    } else if (Array.isArray(data.crews)) {
      crews = data.crews;
    } else if (Array.isArray(data.items)) {
      crews = data.items;
    } else if (Array.isArray(data.data)) {
      crews = data.data;
    }
  }

  return crews.flatMap((item): CrewOption[] => {
    if (item === null || typeof item !== "object") {
      return [];
    }

    const crew = item as Record<string, unknown>;
    const id = crew.id ?? crew.crewId;
    const name = crew.name ?? crew.crewName;

    if (
      (typeof id !== "string" && typeof id !== "number") ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return [];
    }

    return [{ value: String(id), label: name }];
  });
}


import api from "../../services/api";

import type {
  WantedQuery,
  WantedResponse,
  WantedItem,
} from "./wanted";

export async function getWanted(
  query: WantedQuery,
  signal?: AbortSignal
): Promise<WantedResponse> {
  const response = await api.get<WantedResponse>(
    "/wanted",
    {
      params: query,
      signal,
    }
  );

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

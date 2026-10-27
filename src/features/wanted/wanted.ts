
export type WantedSort =
  | "bounty,desc"
  | "name,asc"
  | "updatedAt,desc";

export interface WantedQuery {
  page: number;
  size: 10 | 20 | 50;
  status?: string;
  crewId?: string;
  fruit?: string;
  q?: string;
  sort?: WantedSort;
}

export interface WantedItem {
  id: string | number;
  [key: string]: unknown;
}

export interface WantedResponse {
  content: WantedItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface QuotaResponse {
  allowed: boolean;
  limit: number;
  remaining: number;
  used: number;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

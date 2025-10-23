export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export const DEFAULT_PAGE_SIZE = 20;

export function paginateArray<T>(
  array: T[],
  { page, limit }: PaginationParams
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(array.length / limit);

  return {
    data: array.slice(startIndex, endIndex),
    totalPages,
    currentPage: page,
    hasMore: endIndex < array.length,
  };
}
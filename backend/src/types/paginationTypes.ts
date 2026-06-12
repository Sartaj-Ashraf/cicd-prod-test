export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationInfo {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

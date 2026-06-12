export interface ServiceResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  token?: string;
  refreshToken?: string;
  clearCookie?: boolean;
  pagination?: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}
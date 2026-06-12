// utils/pagination.ts

import type { ParsedQs } from "qs";
import type { PaginationInfo,PaginationParams } from "../types/paginationTypes.js";


export const getPaginationParams = (
  query: ParsedQs
): PaginationParams => {
  const page = Math.max(
    1,
    parseInt(query.page as string) || 1
  );

  const limit = Math.min(
    100,
    Math.max(
      1,
      parseInt(query.limit as string) || 10
    )
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
};


export const getPaginationInfo = (
  totalDocs: number,
  page: number,
  limit: number
): PaginationInfo => {
  const totalPages = Math.ceil(totalDocs / limit);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalDocs,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};
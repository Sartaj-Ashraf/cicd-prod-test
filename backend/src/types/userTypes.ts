// modules/user/user.types.ts

import type { ParsedQs } from "qs";
import type { UserType } from "../models/user.model.ts";
import type { UserSubscriptionType } from "../models/userSubscription.model.js";
import type { HydratedDocument } from "mongoose"; 
export type UserRole =
  | "user"
  | "manager"
  | "admin"
  | "super_admin";

export type GetAllUsersQuery = ParsedQs & {
  page?: string;
  limit?: string;
  search?: string;
  role?: UserRole;
  isDeleted?: string;
};

export type UpdateProfilePayload = Pick<
  UserType,
  "name" | "phoneNumber"
>;

export type UpdateProfileInput = Partial<
  UpdateProfilePayload
>;

export type UserFilter = {
  role?: UserRole | { $ne: UserRole };
  isDeleted?: boolean; // ✅ add this
  $or?: Array<
    | { name: { $regex: string; $options: string } }
    | { email: { $regex: string; $options: string } }
    | { phoneNumber: { $regex: string; $options: string } }
  >;
};

export type GetAllUsersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: any[];
  pagination: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
};

export type PopulatedUser = HydratedDocument<UserType> & {
  activeSubscription: HydratedDocument<UserSubscriptionType>
}
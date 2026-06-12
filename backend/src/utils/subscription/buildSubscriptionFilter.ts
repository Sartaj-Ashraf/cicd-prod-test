// utils/subscriptionFilter.ts
type GetSubscriptionQuery = {
  status?: "active" | "expired" | "cancelled" | "pending" | "failed";
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
};
import mongoose from "mongoose";
export const buildSubscriptionFilter = (
  userId: string,
  query: GetSubscriptionQuery
) => {
  const { status, startDate, endDate } = query;

  const filter: any = {
    user: new mongoose.Types.ObjectId(userId)
  };

  if (status) {
    filter.status = status;
  }

  if (startDate || endDate) {
    filter.startDate = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) throw new Error("Invalid startDate");
      filter.startDate.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) throw new Error("Invalid endDate");
      filter.startDate.$lte = end;
    }
  }

  return filter;
};
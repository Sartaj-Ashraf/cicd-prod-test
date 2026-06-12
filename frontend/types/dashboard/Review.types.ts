export type Review = {
  _id: string;
  authorName: string;
  authorUrl: string;
  createdAt: string;
  lastSeenAt: string;
  locationId: string;
  rating: number;
  reviewId: string;
  reviewTime: string;
  text: string;
  updatedAt: string;

  replied?: boolean;
  replyComment?: string | null;
  replyUpdatedAt?: string | null;
};

export type ReviewListProps = {
  reviews: Review[];
  length: number;
};

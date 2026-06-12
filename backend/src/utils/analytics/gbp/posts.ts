// utils/analytics/gbp/posts.ts
import axios from "axios";

export interface PostInsights {
  totalPosts:        number;
  lastPostDate:      string | null;
  lastPostType:      string | null;
  lastPostSummary:   string | null;
  daysSinceLastPost: number | null;
}

const extractNumericId = (id: string): string => {
  const match = id.match(/(\d+)$/);
  return match?.[1] ?? id;
};

export const fetchPostInsights = async (
  accessToken: string,
  accountId:   string,
  locationId:  string
): Promise<PostInsights | null> => {
  try {
    const numericAccountId  = extractNumericId(accountId);
    const numericLocationId = extractNumericId(locationId);

    const res = await axios.get(
      `https://mybusiness.googleapis.com/v4/accounts/${numericAccountId}/locations/${numericLocationId}/localPosts`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params:  { pageSize: 20 },
      }
    );

    const posts: any[] = res.data.localPosts ?? [];

    if (!posts.length) {
      return {
        totalPosts:        0,
        lastPostDate:      null,
        lastPostType:      null,
        lastPostSummary:   null,
        daysSinceLastPost: null,
      };
    }

    // posts are already sorted newest first
    const latest       = posts[0];
    const lastPostDate = latest.createTime
      ? new Date(latest.createTime).toISOString().split("T")[0]!
      : null;

    const daysSinceLastPost = lastPostDate
      ? Math.floor(
          (Date.now() - new Date(lastPostDate).getTime()) / 86400000
        )
      : null;

    return {
      totalPosts:        posts.length,
      lastPostDate,
      lastPostType:      latest.topicType   ?? null,
      lastPostSummary:   latest.summary
        ? (latest.summary as string).slice(0, 100)
        : null,
      daysSinceLastPost,
    };

  } catch (err: any) {
    console.error(
      "fetchPostInsights error →",
      err?.response?.data ?? err?.message
    );
    return null;
  }
};
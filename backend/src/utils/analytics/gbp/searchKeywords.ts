// utils/analytics/gbp/searchKeywords.ts
import axios from "axios";

export interface SearchKeyword {
  keyword:     string;
  impressions: number;
  type:        "direct" | "high_intent" | "generic" | "competitor";
}

const extractNumericId = (id: string): string => {
  const match = id.match(/(\d+)$/);
  return match?.[1] ?? id;
};

export const fetchSearchKeywords = async (
  accessToken: string,
  locationId:  string
): Promise<SearchKeyword[] | null> => {
  try {
    const numericId    = extractNumericId(locationId);
    const locationName = `locations/${numericId}`;

    const now        = new Date();
    const endMonth   = { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
    const startDate  = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const startMonth = {
      year:  startDate.getUTCFullYear(),
      month: startDate.getUTCMonth() + 1,
    };

    const res = await axios.get(
      `https://businessprofileperformance.googleapis.com/v1/${locationName}/searchkeywords/impressions/monthly`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          "monthly_range.start_month.year":  startMonth.year,
          "monthly_range.start_month.month": startMonth.month,
          "monthly_range.end_month.year":    endMonth.year,
          "monthly_range.end_month.month":   endMonth.month,
        },
        paramsSerializer: (params) => {
          const parts: string[] = [];
          for (const [key, value] of Object.entries(params)) {
            parts.push(`${key}=${encodeURIComponent(String(value))}`);
          }
          return parts.join("&");
        },
      }
    );

    const keywords: any[] = res.data.searchKeywordsCounts ?? [];

    // ── return raw keywords without classification ─────────────────────────
    // type will be classified by Gemini in analyzeService
    return keywords
      .map((k) => ({
        keyword:     k.searchKeyword as string,
        impressions: Number(k.insightsValue?.value ?? k.insightsValue?.threshold ?? 0),
        type:        "generic" as const, // ← placeholder, Gemini will overwrite
      }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10);

  } catch (err: any) {
    console.error(
      "fetchSearchKeywords error →",
      err?.response?.data ?? err?.message
    );
    return null;
  }
};
// utils/analytics/performance.ts
import axios from "axios";

export interface DailyPerformance {
  date:              string;
  impressionsMaps:   number;
  impressionsSearch: number;
  directionRequests: number;
  callClicks:        number;
  websiteClicks:     number;
}

export interface PerformanceData {
  dateRange: { start: string; end: string };
  daily:     DailyPerformance[];
  totals: {
    impressionsMaps:   number;
    impressionsSearch: number;
    directionRequests: number;
    callClicks:        number;
    websiteClicks:     number;
  };
}

const METRICS = [
  "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  "BUSINESS_DIRECTION_REQUESTS",
  "CALL_CLICKS",
  "WEBSITE_CLICKS",
];

const toDateObj = (d: Date) => ({
  year:  d.getUTCFullYear(),
  month: d.getUTCMonth() + 1,
  day:   d.getUTCDate(),
});

const toISODate = (d: { year: number; month: number; day: number }) =>
  `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

// extract just the numeric locationId from any format
const extractLocationId = (locationId: string): string => {
  // "accounts/123/locations/456" → "456"
  // "locations/456"              → "456"
  // "456"                        → "456"
  const match = locationId.match(/locations\/(\d+)/);
  return match?.[1] ?? locationId;
};

export const fetchPerformanceData = async (
  accessToken: string,
  _accountId:  string,
  locationId:  string
): Promise<PerformanceData | null> => {
  try {
    const endDate   = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    const startObj = toDateObj(startDate);
    const endObj   = toDateObj(endDate);

    const numericId    = extractLocationId(locationId);
    const locationName = `locations/${numericId}`;

    const url = `https://businessprofileperformance.googleapis.com/v1/${locationName}:fetchMultiDailyMetricsTimeSeries`;

    // ── GET with correct query param format ───────────────────────────────
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params:  {
        // each metric as separate param — axios serializes array correctly
        "dailyMetrics":                METRICS,
        "dailyRange.start_date.year":  startObj.year,
        "dailyRange.start_date.month": startObj.month,
        "dailyRange.start_date.day":   startObj.day,
        "dailyRange.end_date.year":    endObj.year,
        "dailyRange.end_date.month":   endObj.month,
        "dailyRange.end_date.day":     endObj.day,
      },
      // axios needs to serialize array params as repeated keys not array[]
      paramsSerializer: (params) => {
        const parts: string[] = [];
        for (const [key, value] of Object.entries(params)) {
          if (Array.isArray(value)) {
            for (const v of value) {
              parts.push(`${key}=${encodeURIComponent(v)}`);
            }
          } else {
            parts.push(`${key}=${encodeURIComponent(String(value))}`);
          }
        }
        return parts.join("&");
      },
    });

    // ── correct response key: multiDailyMetricTimeSeries ─────────────────
    const multiDailyMetricTimeSeries: any[] =
      res.data.multiDailyMetricTimeSeries ?? [];

    // ── build date → metric → value map ──────────────────────────────────
    const dateMap: Record<string, Record<string, number>> = {};

    for (const item of multiDailyMetricTimeSeries) {
      // each item has dailyMetricTimeSeries array
      const timeSeries: any[] = item.dailyMetricTimeSeries ?? [];

      for (const metricSeries of timeSeries) {
        const metricName: string = metricSeries.dailyMetric;
        const dataPoints: any[]  = metricSeries.timeSeries?.datedValues ?? [];

        for (const point of dataPoints) {
          const d       = point.date;
          const dateStr = toISODate(d);
          if (!dateMap[dateStr]) dateMap[dateStr] = {};
          dateMap[dateStr][metricName] = Number(point.value ?? 0);
        }
      }
    }

    // ── build daily array ─────────────────────────────────────────────────
    const daily: DailyPerformance[] = Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, metrics]) => ({
        date,
        impressionsMaps:
          (metrics["BUSINESS_IMPRESSIONS_MOBILE_MAPS"]    ?? 0) +
          (metrics["BUSINESS_IMPRESSIONS_DESKTOP_MAPS"]   ?? 0),
        impressionsSearch:
          (metrics["BUSINESS_IMPRESSIONS_MOBILE_SEARCH"]  ?? 0) +
          (metrics["BUSINESS_IMPRESSIONS_DESKTOP_SEARCH"] ?? 0),
        directionRequests: metrics["BUSINESS_DIRECTION_REQUESTS"] ?? 0,
        callClicks:        metrics["CALL_CLICKS"]                 ?? 0,
        websiteClicks:     metrics["WEBSITE_CLICKS"]              ?? 0,
      }));

    // ── compute totals ────────────────────────────────────────────────────
    const totals = daily.reduce(
      (acc, d) => ({
        impressionsMaps:   acc.impressionsMaps   + d.impressionsMaps,
        impressionsSearch: acc.impressionsSearch + d.impressionsSearch,
        directionRequests: acc.directionRequests + d.directionRequests,
        callClicks:        acc.callClicks        + d.callClicks,
        websiteClicks:     acc.websiteClicks     + d.websiteClicks,
      }),
      {
        impressionsMaps:   0,
        impressionsSearch: 0,
        directionRequests: 0,
        callClicks:        0,
        websiteClicks:     0,
      }
    );

    return {
      dateRange: {
        start: toISODate(startObj),
        end:   toISODate(endObj),
      },
      daily,
      totals,
    };

  } catch (err: any) {
    console.error(
      "fetchPerformanceData error →",
      err?.response?.data ?? err?.message
    );
    return null;
  }
};
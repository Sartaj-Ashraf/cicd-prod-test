// utils/analytics/gbp/photos.ts
import axios from "axios";

export interface PhotoInsights {
  total:         number;
  owner:         number;
  customer:      number;
  lastPhotoDate: string | null;
}

const extractNumericId = (id: string): string => {
  const match = id.match(/(\d+)$/);
  return match?.[1] ?? id;
};

export const fetchPhotoInsights = async (
  accessToken: string,
  accountId:   string,
  locationId:  string
): Promise<PhotoInsights | null> => {
  try {
    const numericAccountId  = extractNumericId(accountId);
    const numericLocationId = extractNumericId(locationId);
    const base = `https://mybusiness.googleapis.com/v4/accounts/${numericAccountId}/locations/${numericLocationId}`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // ── fetch owner + customer photos in parallel ─────────────────────────
    const [ownerRes, customerRes] = await Promise.all([
      axios.get(`${base}/media`,           { headers, params: { pageSize: 100 } }),
      axios.get(`${base}/media/customers`, { headers, params: { pageSize: 100 } }),
    ]);

    const ownerItems:    any[] = ownerRes.data.mediaItems            ?? [];
    const customerItems: any[] = customerRes.data.mediaItems         ?? [];
    const ownerTotal:  number  = ownerRes.data.totalMediaItemCount   ?? ownerItems.length;
    const customerTotal: number = customerRes.data.totalMediaItemCount ?? customerItems.length;

    // ── find most recent photo date across both ───────────────────────────
    const allItems = [...ownerItems, ...customerItems];
    const dates    = allItems
      .map((m) => m.createTime ?? m.insertTime)
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .filter((t) => !isNaN(t));

    const lastPhotoDate = dates.length
      ? new Date(Math.max(...dates)).toISOString().split("T")[0]!
      : null;

    return {
      total:    ownerTotal + customerTotal,
      owner:    ownerTotal,
      customer: customerTotal,
      lastPhotoDate,
    };

  } catch (err: any) {
    console.error(
      "fetchPhotoInsights error →",
      err?.response?.data ?? err?.message
    );
    return null;
  }
};
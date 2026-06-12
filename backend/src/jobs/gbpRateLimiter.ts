// utils/cron/gbpRateLimiter.ts

import { CRON_CONSTANTS } from "../utils/constant/cronConstants.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const withGBPRateLimit = async <T>(
  fn:         () => Promise<T>,
  reviewInfo: string = "unknown"
): Promise<T | null> => {

  for (let attempt = 1; attempt <= CRON_CONSTANTS.MAX_GBP_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status ?? 0;

      if (status === 429) {
        if (attempt === CRON_CONSTANTS.MAX_GBP_RETRIES) {
          console.error(`[GBP] 429 max retries reached for: ${reviewInfo}`);
          return null;
        }

        const now         = new Date();
        const secondsLeft = 60 - now.getSeconds();
        const waitMs      = (secondsLeft * 1000) + CRON_CONSTANTS.GBP_RETRY_BUFFER_MS;

        console.warn(
          `[GBP] 429 rate limit hit for: ${reviewInfo} — ` +
          `waiting ${Math.round(waitMs / 1000)}s for quota reset ` +
          `(attempt ${attempt}/${CRON_CONSTANTS.MAX_GBP_RETRIES})`
        );

        await sleep(waitMs);
        continue;
      }

      throw err;
    }
  }

  return null;
};
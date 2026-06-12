export const CRON_CONSTANTS = {
  BATCH_SIZE:           5,
  REVIEW_DELAY_MS:      500,
  BATCH_PAUSE_MS:       2000,
  REVIEW_LOOKBACK_MS:   2 * 24 * 60 * 60 * 1000,
  MAX_GBP_RETRIES:      4,
  REVIEW_PAGE_SIZE:     50,
  GBP_RETRY_BUFFER_MS:  500,
  RANDOM_DELAY_MAX_MS:  120 * 60 * 1000,       // 120 minutes
  CRON_SCHEDULE:        "30 20 * * *",          // 2 AM IST (8:30 PM UTC)
  CRON_TIMEZONE:        "UTC",
} as const;


// export const CRON_CONSTANTS = {
//   BATCH_SIZE:           5,
//   REVIEW_DELAY_MS:      0,            // ← was 500
//   BATCH_PAUSE_MS:       0,            // ← was 2000
// REVIEW_LOOKBACK_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
//   REVIEW_PAGE_SIZE:     50,
//   MAX_GBP_RETRIES:      4,
//   GBP_RETRY_BUFFER_MS:  500,
//   RANDOM_DELAY_MAX_MS:  0,            // ← was 120 * 60 * 1000 (no random delay)
//   CRON_SCHEDULE:        "30 20 * * *",
//   CRON_TIMEZONE:        "UTC",
// } as const;
// utils/cron/autoReply.cron.ts
import cron                     from "node-cron";
import User                     from "../models/user.model.js";
import UserSubscription         from "../models/userSubscription.model.js";
import { processUserAutoReply } from "./autoReplyWorker.js";
import { CRON_CONSTANTS } from "../utils/constant/cronConstants.js";


const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const getEligibleUsers = async (): Promise<string[]> => {
  const users = await User.find({
    role:      "admin",
    autoReply: { $ne: false },
    isDeleted: false,
  }).select("_id activeSubscription").lean();

  const usersWithSub = users.filter(
    (u) => (u as any).activeSubscription !== null
  );

  const userIds = usersWithSub.map((u) => String(u._id));

  const now = new Date();
  const activeSubUserIds = await UserSubscription.distinct("user", {
    user:   { $in: userIds },
    status: "active",
    cycles: {
      $elemMatch: {
        startDate: { $lte: now },
        endDate:   { $gt:  now },
      },
    },
  });

  return activeSubUserIds.map(String);
};

export const runAutoReplyCron = async (): Promise<void> => {
  console.log("[AUTO-REPLY CRON] starting run...");
  const startTime = Date.now();

  try {
    const eligibleUserIds = await getEligibleUsers();
    console.log(`[AUTO-REPLY CRON] ${eligibleUserIds.length} eligible users found`);

    if (!eligibleUserIds.length) {
      console.log("[AUTO-REPLY CRON] no eligible users — exiting");
      return;
    }

    const batches: string[][] = chunk(eligibleUserIds, CRON_CONSTANTS.BATCH_SIZE)
      .filter((b): b is string[] => Array.isArray(b) && b.length > 0);

    console.log(
      `[AUTO-REPLY CRON] ${batches.length} batches of ${CRON_CONSTANTS.BATCH_SIZE}`
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (!batch?.length) continue;

      console.log(`[AUTO-REPLY CRON] batch ${i + 1}/${batches.length}`);

      await Promise.all(
        batch.map(async (userId: string) => {
          const randomDelay = Math.floor(
            Math.random() * CRON_CONSTANTS.RANDOM_DELAY_MAX_MS
          );
          console.log(
            `[AUTO-REPLY CRON] user ${userId} — ` +
            `delayed ${Math.round(randomDelay / 60000)} min`
          );
          await sleep(randomDelay);
          await processUserAutoReply(userId);
        })
      );

      if (i < batches.length - 1) {
        await sleep(CRON_CONSTANTS.BATCH_PAUSE_MS);
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    console.log(`[AUTO-REPLY CRON] ✅ completed in ${duration} minutes`);

  } catch (err: any) {
    console.error("[AUTO-REPLY CRON] fatal error:", err?.message ?? err);
  }
};

export const registerAutoReplyCron = (): void => {
  cron.schedule(CRON_CONSTANTS.CRON_SCHEDULE, () => {
    console.log("[AUTO-REPLY CRON] triggered at 2 AM IST");
    runAutoReplyCron();
  }, {
    timezone: CRON_CONSTANTS.CRON_TIMEZONE,
  });

  console.log("[AUTO-REPLY CRON] registered — runs daily at 2 AM IST");
};
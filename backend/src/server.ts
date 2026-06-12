import "dotenv/config"; 
import express            from "express";
import helmet             from "helmet";
import cors               from "cors";
import cookieParser       from "cookie-parser";
import morgan             from "morgan";
import mongoose           from "mongoose";
import rateLimit          from "express-rate-limit";
import errorHandlerMiddleware from "./middleware/errorHandlingMiddleware.js";
import authRouter         from "./modules/auth/auth.routes.js";
import passport           from "./config/passport.js";
import pricingRouter      from "./modules/pricing/pricing.routes.js";
import webhookRoutes      from "./modules/webhook/webhook.routes.js";
import subscriptionRouter from "./modules/subscription/subscription.routes.js";
import queryRouter        from "./modules/query/query.routes.js";
import userRouter         from "./modules/users/user.routes.js";
import managerRouter      from "./modules/manager/manager.routes.js";
import locationRouter     from "./modules/location/location.routes.js";
import questionRouter     from "./modules/questions/question.routes.js";
import feedbackRouter     from "./modules/feedback/feedback.routes.js";
import analyticsRouter    from "./modules/analytics/analytics.routes.js";
import googleRouter       from "./modules/GBP/gbp.routes.js";
import { registerAutoReplyCron, runAutoReplyCron } from "./jobs/autoReply.cron.js";

const app = express();

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use("/api/v1/webhook", webhookRoutes);
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

const allowedOrigins = (
  process.env.NODE_ENV === "production"
    ? [
        process.env.PRODUCTION_URL1,
        process.env.PRODUCTION_URL2,
      ]
    : [
        process.env.DEV_URL,
        process.env.DEV_URL_2,
        process.env.DEV_URL_3,
      ]
).filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(passport.initialize());

const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  message:         { success: false, message: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const aiLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             10,
  message:         { success: false, message: "Too many AI requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const generalLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             100,
  message:         { success: false, message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use("/api/v1/auth",          authLimiter,    authRouter);
app.use("/api/v1/pricing",       generalLimiter, pricingRouter);
app.use("/api/v1/subscriptions", generalLimiter, subscriptionRouter);
app.use("/api/v1/query",         generalLimiter, queryRouter);
app.use("/api/v1/users",         generalLimiter, userRouter);
app.use("/api/v1/manager",       generalLimiter, managerRouter);
app.use("/api/v1/location",      generalLimiter, locationRouter);
app.use("/api/v1/questions",     generalLimiter, questionRouter);
app.use("/api/v1/feedback",      aiLimiter,      feedbackRouter);
app.use("/api/v1/google",        aiLimiter,      googleRouter);
app.use("/api/v1/analytics",     aiLimiter,      analyticsRouter);

app.get("/test-cron", async (req, res) => {
  await runAutoReplyCron();
  res.json({ message: "cron triggered — watch logs" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
// in startup — after mongoose.connect
try {
  await mongoose.connect(process.env.MONGO_URL!);
  console.log("DB is up and running");
  app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
  });
} catch (error) {
  console.error("Server startup error:", error);
  process.exit(1);
}
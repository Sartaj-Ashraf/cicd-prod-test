// models/analytics.model.ts
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    locationId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Location",
      required: true,
      unique:   true,
      index:    true,
    },
    analysis:        { type: mongoose.Schema.Types.Mixed, required: true  },
    reputationScore: { type: Number,                      default: null   },
    totalAnalysed:   { type: Number,                      default: 0      },
    performance:     { type: mongoose.Schema.Types.Mixed, default: null   },
    gbpInsights:     { type: mongoose.Schema.Types.Mixed, default: null   }, // ← new
    reviewSources: {
      google:  { type: Number, default: 0 },
      gbp:     { type: Number, default: 0 },
      private: { type: Number, default: 0 },
    },
    reviewAge: {
      last30d: { type: Number, default: 0 },
      last60d: { type: Number, default: 0 },
      last90d: { type: Number, default: 0 },
      older:   { type: Number, default: 0 },
    },
    unrepliedCount: { type: Number, default: null },
    stale:          { type: Date,   required: true },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
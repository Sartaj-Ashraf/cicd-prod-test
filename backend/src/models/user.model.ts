// models/user.model.ts
import mongoose, { type InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  [true, "Name is required"],
    trim:      true,
    minlength: [2, "Name must be at least 2 characters"],
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type:     String,
    required: [true, "Email is required"],
    trim:     true,
    lowercase: true,
  },
  role: {
    type:     String,
    enum:     ["user", "manager", "admin", "super_admin"],
    required: true,
    default:  "user",
  },
  password: {
    type:   String,
    select: false,
  },
  provider: {
    type:    String,
    enum:    ["local", "google"],
    default: "local",
  },
  verificationToken: {
    type:    String,
    default: undefined,
  },
  verificationTokenExpiry: {
    type:    Date,
    index:   true,
    default: undefined,
  },
  isVerified: {
    type:    Boolean,
    default: false,
  },
  activeSubscription: {
    type:    mongoose.Schema.Types.ObjectId,
    ref:     "UserSubscription",
    default: null,
  },
  badReviewRedirectEnabled: {
    type:    Boolean,
    default: true,
  },
  hasEverSubscribed: {
    type:    Boolean,
    default: false,
  },
  autoReply: {
    type:    Boolean,
    default: true, // ← enabled by default, cron checks credits + GBP connection
  },
  isDeleted: {
    type:    Boolean,
    default: false,
  },
}, { timestamps: true });

export type UserType = InferSchemaType<typeof userSchema>;

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
import mongoose, { type InferSchemaType } from "mongoose";

const managerInviteSchema = new mongoose.Schema(
  {
    invitedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    invitedEmail: {
      type:     String,
      required: true,
      lowercase: true,
      trim:     true,
    },
    locationId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Location",
      required: true,
    },
    // if invited user already exists
    invitedUserId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },
    token:       { type: String, required: true },
    tokenExpiry: { type: Date,   required: true },
    status: {
      type:    String,
      enum:    ["pending", "accepted", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

managerInviteSchema.index({ token: 1 });
managerInviteSchema.index({ invitedEmail: 1, locationId: 1 });

export type ManagerInviteType = InferSchemaType<typeof managerInviteSchema>;

const ManagerInvite = mongoose.model("ManagerInvite", managerInviteSchema);

export default ManagerInvite;
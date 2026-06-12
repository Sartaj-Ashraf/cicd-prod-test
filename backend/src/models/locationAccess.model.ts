import mongoose, { type InferSchemaType } from "mongoose";

const locationAccessSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "User is required"],
    },
    locationId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Location",
      required: [true, "Location is required"],
    },
    role: {
      type:    String,
      enum:    ["manager", "admin"],
      default: "admin",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
    isDeleted:  { type: Boolean, default: false },
    deletedAt:  { type: Date,    default: null   },
  },
  { timestamps: true }
);

locationAccessSchema.index({ userId: 1, locationId: 1 }, { unique: true });
locationAccessSchema.index({ locationId: 1, isDeleted: 1 });

export type LocationAccessType = InferSchemaType<typeof locationAccessSchema>;

const LocationAccess = mongoose.model("LocationAccess", locationAccessSchema);

export default LocationAccess;
  import mongoose, { type InferSchemaType } from "mongoose";

  const locationSchema = new mongoose.Schema(
    {
      createdBy: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      "User",
        required: [true, "Created by is required"],
      },

      placeId: {
        type:     String,
        required: [true, "Place ID is required"],
      },

      gbpAccountId: {
        type:    String,
        default: undefined,
      },

      gbpLocationId: {
        type:    String,
        default: undefined,
      },

      name: {
        type:     String,
        required: [true, "Business name is required"],
        trim:     true,
      },

      address: {
        type: String,
        trim: true,
      },

      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },

      rating: {
        type: Number,
        min:  0,
        max:  5,
      },

      totalReviews: {
        type: Number,
        min:  0,
      },

      nickname: {
        type: String,
        trim: true,
      },

      isActive: {
        type:    Boolean,
        default: true,
      },

      isDeleted: {
        type:    Boolean,
        default: false,
      },

      source: {
        type:    String,
        enum:    ["places", "gbp"],
        default: "places",
      },

      reviewLink: {
        type: String,
      },

      lastSyncedAt: {
        type:    Date,
        default: undefined,
      },
      opening_hours:{
        open_now:Boolean,
        schedule:[
            {
                day:{
                    type:String
                },
                opening:{
                    type:String
                },
                closing:{
                    type:String
                }
            }
        ]
     },
     image:String,
     types:[String],
      
      website:{
        type:String
      },
      badReviewRedirect: {
        enabled:        { type: Boolean, default: true },
        badReviewCount: { type: Number,  default: 0     },
      },
    },
    { timestamps: true }
  );

  locationSchema.index(
    { placeId: 1, createdBy: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
  );

  export type LocationType = InferSchemaType<typeof locationSchema>;

  const Location = mongoose.model("Location", locationSchema);

  export default Location;
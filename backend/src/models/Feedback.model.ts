  import mongoose, { type InferSchemaType, Schema } from "mongoose";

const FeedbackSchema = new Schema(
  {
    fullName:{
      type:     String,
      required: true,
      trim:     true,
    },
    phoneNumber:{
      type:     String,
      trim:     true,
    },
    locationId: {
      type:     Schema.Types.ObjectId,
      ref:      "Location",
      required: true,
    },
    rating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
      index:    true,
    },
    answers: [
      {
        questionText: {
          type:     String,
          required: true,
          trim:     true,
        },
        questionType: {
          type:     String,
          enum:     ["stars", "text", "yes_no"],
          required: true,
        },
        value: {
          type:     Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    source: {
      type:    String,
      enum:    ["qr"],
      default: "qr",
    },
    status: {
      type:    String,
      enum:    ["new", "seen"],
      default: "new",
      index:   true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

  

export type FeedbackType = InferSchemaType<typeof FeedbackSchema>;

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
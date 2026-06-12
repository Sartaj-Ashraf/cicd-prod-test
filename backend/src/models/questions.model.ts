import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const { Schema, models, model } = mongoose;

/* -------------------------------------------------------------------------- */
/* QUESTION */
/* -------------------------------------------------------------------------- */

const QuestionSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    type: {
      type: String,
      enum: ["stars", "text", "yes_no"],
      default: "stars",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export type QuestionType = InferSchemaType<typeof QuestionSchema>;

export const Question =
  (models.Question as mongoose.Model<QuestionType>) ||
  model<QuestionType>("Question", QuestionSchema);
import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      trim: true
    },

    message: {
      type: String,
      maxlength: 1000,
      trim: true
    },

    businessName: {
      type: String,
      trim: true
    },

    note: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
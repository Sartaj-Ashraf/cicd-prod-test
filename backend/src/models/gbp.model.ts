import mongoose from "mongoose";

const gbpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  googleAccountId: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  accessToken: String,

  refreshToken: String,

  connected: {
    type: Boolean,
    default: true,
  },
});

gbpSchema.index(
  {
    userId: 1,
    googleAccountId: 1,
  },
  {
    unique: true,
  }
);
const Gbp=mongoose.model("Gbp", gbpSchema);
export default Gbp;
import mongoose from "mongoose";

const oauthStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  state: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  redirectTo:{
    type:String
  },
  locationId:{
    type:String
  }
});

const oAuthGbpState=mongoose.model("OAuthState", oauthStateSchema);

export default oAuthGbpState;
 
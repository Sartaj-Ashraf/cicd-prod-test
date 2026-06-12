import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    refreshToken:{
        type:String,
        required:true,

    },
    device:{
        type:String,
        required:true
    },
    ip:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    },
    expiresAt:{
        type:Date
    }
  },
  { timestamps: true }
);
const Session=mongoose.model("Session",sessionSchema)
export default Session;
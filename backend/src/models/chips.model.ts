import mongoose from "mongoose";

const chipsSchema= new mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    text:{
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
},
{
    timestamps:true
});

const Chips=mongoose.model("Chips",chipsSchema);
export default Chips;
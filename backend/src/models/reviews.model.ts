import mongoose from "mongoose";

const reviewsSchema=new mongoose.Schema({
    locationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Location",
        required:true
    },
    reviewId:{
        type:String,
        required:true
    },
    authorName:String,
    text:String,
    authorUrl:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    reviewTime:{
        type:Date,
    },
     lastSeenAt: {
      type: Date,
      default: Date.now,
    },
},{timestamps:true})

reviewsSchema.index({reviewId:1});

const Reviews=mongoose.model("Reviews",reviewsSchema);

export default Reviews;
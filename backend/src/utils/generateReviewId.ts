import crypto from "crypto";

export default function generateReviewId(authorName:string,reviewTime:number){
   return crypto.createHash("sha256").update(authorName + reviewTime).digest("hex")
}
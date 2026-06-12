import * as crypto from "crypto"

export default function hashToken(token:string){
  return crypto.createHash("sha256").update(token).digest("hex");
}
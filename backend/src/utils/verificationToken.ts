import * as crypto from "crypto"
import hashToken from "./hashToken.js";

export default function generateVerificatonToken(){
   const rawToken=crypto.randomBytes(32).toString("hex");

   const hashedToken=hashToken(rawToken);

   
   return {rawToken,hashedToken}
}
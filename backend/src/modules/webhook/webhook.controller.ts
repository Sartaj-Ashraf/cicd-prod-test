import type { Request, Response }        from "express";
import { handleRazorpayWebhookService }  from "./webhook.service.js";

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!signature) {
    return res.status(400).json({ success: false, message: "Missing razorpay signature header" });
  }

  const result = await handleRazorpayWebhookService(req.body, signature);
  return res.status(result.statusCode).json({ success: result.success, message: result.message });
};
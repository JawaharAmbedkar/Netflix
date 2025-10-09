import crypto from "crypto";
import { prisma } from '@repo/db';
import { getServerSession } from "next-auth";

import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../app/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Razorpay key secret not configured" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No valid session found" });
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }


  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    const [membershipUpdate] = await prisma.$transaction([
      prisma.membership.updateMany({
        where: { userId, amount: { gte: 149 } },
        data: {
          amount: { decrement: 149 },
          status: true,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          membership: true,
          amount: { decrement: 149 },
        },
      }),
    ]);

    if (membershipUpdate.count === 0) {
      return res.status(400).json({ error: "Membership not updated. Check amount or record." });
    }

    return res.status(200).json({ success: true, message: "Membership updated" });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Could not update membership and user" });
  }
}

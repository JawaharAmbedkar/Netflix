// apps/web/pages/api/update-name.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@repo/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../app/lib/auth";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid name" });
    }

    // Ensure user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only the name
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return res.status(200).json({ message: "Name updated", name: updatedUser.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@repo/db';
import { hash } from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  let { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing required fields" });

  try {
    // 🔹 Normalize email
    email = email.toLowerCase();

    // 🔹 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        membership: false,
        amount: 1000,
        membershipRecord: {
          create: {
            amount: 1000,
            status: false,
          },
        },
      },
      include: { membershipRecord: true },
    });

    return res.status(201).json({ message: "User created successfully", user: createdUser });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

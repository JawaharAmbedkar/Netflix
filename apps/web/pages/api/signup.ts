import prisma from '@repo/db/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name?.trim() || null,
        membershipRecord: {
          create: {
            amount: 1000,
            status: false,
          },
        },
      },
    });

    console.log('User created:', user);

    return res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error: any) {
    console.error('Signup error:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

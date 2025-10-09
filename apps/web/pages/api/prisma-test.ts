// apps/web/pages/api/prisma-test.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@repo/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: 'hashedpassword', // For test only
        name: 'Test User',
        membershipRecord: {
          create: {
            amount: 1000,
            status: false,
          },
        },
      },
    });

    console.log('Created user with membership:', user);
    res.status(200).json({ message: 'User created', user });
  } catch (error) {
    console.error('Error creating user with membership:', error);
    res.status(500).json({ error: 'Failed to create user' });
  } finally {
    await prisma.$disconnect();
  }
}

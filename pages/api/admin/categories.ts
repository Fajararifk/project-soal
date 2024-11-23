// pages/api/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Adjust according to your prisma setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.question.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const categoryOptions = categories.map((item) => item.category);
    res.status(200).json(categoryOptions); // Return the categories to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

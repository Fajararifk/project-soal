import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, answers, correctAnswer , image } = req.body;


  try {
    // Verify the token
    

    // Create a new question

    
    const newQuestion = await prisma.question.create({
      data: {
        question,
        answers,
        correctAnswer,
        image,
      },
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
};

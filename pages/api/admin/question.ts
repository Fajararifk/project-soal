import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { Console } from 'console';


export default async function handler(req: any, res:any) {
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


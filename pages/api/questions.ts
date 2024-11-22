import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const questionsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const questions = await prisma.question.findMany(); // Fetch all questions
    return res.status(200).json({ questions });
  }

  if (req.method === 'POST') {
    const { userId, question, answers, correctAnswer, category } = req.body;

    const newQuestion = await prisma.question.create({
      data: {
        userId,
        question,
        answers,
        correctAnswer,
        category
      },
    });

    return res.status(201).json({ newQuestion });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
};

export default questionsHandler;

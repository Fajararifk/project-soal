import { prisma } from '@/lib/prisma';

export default async function handler(req: any, res: any) {
  const { id, question, answers, correctAnswer } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure `answers` is an array
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: '`answers` must be an array.' });
    }

    // Update the question
    const updateQuestion = await prisma.question.update({
      where: { id }, // Specify which question to update using `id`
      data: {
        question,
        answers,
        correctAnswer,
      },
    });

    return res.status(200).json(updateQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Error updating question' });
  }
}

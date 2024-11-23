import { prisma } from '@/lib/prisma';


export default async function handler(req: any, res:any) {
  const { userId, correctAnswers , wrongAnswers, quizScore, counterInsert, category } = req.body;

  try {
    // Verify the token
    
    // Create a new question
    const userQuizResult = await prisma.quizResult.findFirst({
        where: {
          userId: userId,  // Filter by the provided userId
        },
        orderBy: {
            createdAt: 'desc',  // Order by createdAt in descending order
          },
    })
    if(userQuizResult){
        if(userQuizResult?.counterInsert <= 1){
            const newQuestion = await prisma.quizResult.create({
                data: {
                    userId,
                    correctAnswers,
                    wrongAnswers,
                    quizScore,
                    counterInsert : userQuizResult.counterInsert + counterInsert, // Set counterInsert to your desired value or logic
                    category
                    },
            });
            return res.status(201).json(newQuestion);
        }
        else{
            return res.status(201).json("Tidak bisa mengulang lebih dari 1x")
        }
    } else {
        const newQuestion = await prisma.quizResult.create({
            data: {
                userId,
                correctAnswers,
                wrongAnswers,
                quizScore,
                counterInsert, // Set counterInsert to your desired value or logic
                category
                },
        });
        return res.status(201).json(newQuestion);
    }
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
};


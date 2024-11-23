import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from "@/lib/prisma";

// The default export handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;  // Get the token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);  // Decode the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },  // Assuming the token contains the user's ID
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });  // Return the user data as JSON
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

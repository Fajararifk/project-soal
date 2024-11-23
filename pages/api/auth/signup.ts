// pages/api/auth/signup.ts

import { prisma } from "../../../lib/prisma"; // Pastikan prisma terhubung dengan benar
import bcrypt from 'bcrypt';

// Fungsi API standar tanpa Edge
export default async function handler(req: any, res:any) {
  try {
    // Ambil data dari body request
    const { email, password, name, role } = req.body;

    // Validasi input
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    return res.status(201).json(newUser);

  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error: error });
  }
}

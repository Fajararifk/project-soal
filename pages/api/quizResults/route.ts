import { prisma } from "../../../lib/prisma"; // Pastikan prisma terhubung dengan benar
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

// Ekspor fungsi POST untuk menangani POST request sebagai default
export default async function handler(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // Validasi input
    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
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

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Error creating user", error: error }, { status: 500 });
  }
}

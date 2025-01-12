import bcrypt from "bcryptjs";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import _ from "lodash";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Error", message: "All fields are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Error", message: "Invalid email" },
        { status: 400 }
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Error", message: "Invalid password" },
        { status: 400 }
      );
    }
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.roles },
      process.env.JWT_SECRET as string
    );
    const userWithoutPassword = _.omit(user, ["password"]);
    return NextResponse.json(
      {
        message: "Login process is successful",
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

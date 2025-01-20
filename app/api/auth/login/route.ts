import bcrypt from "bcryptjs";
import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import _ from "lodash";
export async function POST(request: Request) {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { email, password } = body;
    if (!email) {
      return NextResponse.json(
        { error: "Validation Error", message: "Email is required" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Password is required" },
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
        { status: 401 }
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Error", message: "Invalid password" },
        { status: 401 }
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
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

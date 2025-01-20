import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, roles } = body;
    if (!fullName) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          phone,
        },
      });
      if (!user) {
        return NextResponse.json(
          { message: "User is missing" },
          { status: 400 }
        );
      }
      if (!process.env.JWT_SECRET) {
        return NextResponse.json(
          { message: "JWT_SECRET is not defined" },
          { status: 500 }
        );
      }

      const token = jwt.sign(
        { userId: user.userId, email: user.email, role: "User" },
        process.env.JWT_SECRET as string
      );
      if (!token)
        return NextResponse.json(
          { error: "Error", message: "Error in sign user" },
          { status: 400 }
        );
      return NextResponse.json(
        {
          message: "User created successfully",
          data: user,
          token: token,
        },
        { status: 201 }
      );
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      const userRole = authenticateToken(authHeader);
      if (userRole == "Admin") {
        if (!roles) {
          return NextResponse.json(
            { message: "Roles is required" },
            { status: 400 }
          );
        }
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
          );
        }
        const user = await prisma.user.create({
          data: {
            fullName,
            email,
            password: hashedPassword,
            roles,
            phone,
          },
        });
        const userWithoutPassword = _.omit(user, ["password"]);
        return NextResponse.json(
          { message: "User created successfully", data: userWithoutPassword },
          { status: 201 }
        );
      } else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error during register:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const body = await request.json();
  const { fullName, email, password, phone, roles } = body;
  if (!fullName || !email || !password || !phone) {
    return NextResponse.json(
      { message: "All fields are required" },
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
  const hashedPassword = await bcrypt.hash(password, 12);
  if (authHeader) {
    const userRole = authenticateToken(authHeader);
    if (userRole == "Admin") {
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
    }
    else{
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
    }
  } else {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
      },
    });
    const userWithoutPassword = _.omit(user, ["password"]);
    return NextResponse.json(
      { message: "User created successfully", data: userWithoutPassword },
      { status: 201 }
    );
  }
}

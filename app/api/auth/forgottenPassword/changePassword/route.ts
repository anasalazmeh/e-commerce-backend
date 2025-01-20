import { hash } from "bcryptjs";
import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/_components/authenticateToken";

export async function PUT(request: Request) {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Error", message: "Invalid authorization header." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword) {
      return NextResponse.json(
        { error: "Error", message: "The new password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "Error",
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    const userId = getUserId(authHeader);
    if (!userId) {
      return NextResponse.json(
        { error: "Error", message: "Invalid token." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    const existingUser = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Error", message: "User not found." },
        { status: 404 }
      );
    }

    try {
      await prisma.user.update({
        where: {
          userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        { message: "The password has been updated successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Failed to update password:", error);
      return NextResponse.json(
        { error: "Error", message: "Failed to update password." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in PUT /api/change-password:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

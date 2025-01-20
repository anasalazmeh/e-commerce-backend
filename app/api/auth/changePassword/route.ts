import bcrypt from "bcryptjs";
import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import {
  authenticateToken,
  getUserId,
} from "../../_components/authenticateToken";

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

    // Check authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Error", message: "Invalid authorization header." },
        { status: 403 }
      );
    }
    const token = authHeader.split(" ")[1];

    // Parse request body
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // Validate old password
    if (!oldPassword) {
      return NextResponse.json(
        { error: "Error", message: "Old password is required." },
        { status: 400 }
      );
    }

    // Validate new password
    if (!newPassword) {
      return NextResponse.json(
        { error: "Error", message: "New password is required." },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "Error",
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // Prevent using old password as new password
    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "Error", message: "New password cannot be the same as the old password." },
        { status: 400 }
      );
    }

    // Authenticate user role
    const userRole = authenticateToken(token);
    if (userRole === "User" || userRole === "Admin" || userRole === "Employee") {
      const userId = getUserId(token);

      // Find user in database
      const user = await prisma.user.findUnique({
        where: {
          userId,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            error: "Error",
            message: "Password cannot be changed, please login again.",
          },
          { status: 400 }
        );
      }

      // Verify old password
      const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: "Error", message: "The old password is wrong." },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password
      await prisma.user.update({
        where: {
          userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        { success: true, message: "Change password is successful." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority." },
        { status: 403 }
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
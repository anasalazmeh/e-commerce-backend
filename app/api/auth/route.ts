import { NextResponse } from "next/server";
import prisma, { checkDatabaseConnection } from "../../../prisma/client";
import { authenticateToken } from "../_components/authenticateToken";

export async function GET(request: Request) {
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
        { error: "Error", message: "You must be logged in." },
        { status: 403 }
      );
    }
    const userRole = authenticateToken(authHeader);
    if (userRole !== "Admin") {
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority." },
        { status: 403 }
      );
    }
    const users = await prisma.user.findMany({
      where: {
        roles: {
          in: ["Admin", "Employee"],
        },
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        roles: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Get users successfully", data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("User_GET", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

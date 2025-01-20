import prisma, { checkDatabaseConnection } from "@/prisma/client";
import {
  authenticateToken,
  getUserId,
} from "../../_components/authenticateToken";
import { NextResponse } from "next/server";

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
    if (!authHeader)
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 403 }
      );
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 400 }
        );
      const countCart = await prisma.cart.count({
        where: {
          userId,
        },
      });
      if (!countCart)
        return NextResponse.json({
          error: "error",
          message: "don't have any products in cart",
        });
      return NextResponse.json({
        message: "Get count products in cart successfully",
        data: countCart,
      });
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("GET_CART count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

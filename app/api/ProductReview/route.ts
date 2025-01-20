import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken, getUserId } from "../_components/authenticateToken";

export async function POST(request: Request) {
  try {
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
    const body = await request.json();
    const { productId, rating, comment } = body;
    if (!productId || !rating)
      return NextResponse.json(
        { error: "Error", message: "All fields are required" },
        { status: 400 }
      );
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const existingProductReview = await prisma.productReview.findFirst({
        where: {
          userId,
          productId,
        },
      });
      if (existingProductReview)
        return NextResponse.json(
          {
            message:
              "You have rated the product. You cannot rate the same product more than once. You can edit your rating",
          },
          { status: 400 }
        );
      else {
        const product = await prisma.products.update({
          where: { productId },
          data: {
            productReview: {
              create: {
                userId,
                rating,
                comment,
              },
            },
          },
        });
        return NextResponse.json(
          { message: "Add rating for product successfully", data: product },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log("POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

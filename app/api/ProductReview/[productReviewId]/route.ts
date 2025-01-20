import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import {
  authenticateToken,
  getUserId,
} from "../../_components/authenticateToken";

export async function PUT(
  request: Request,
  { params }: { params: { productReviewId: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 403 }
      );
    }
    const userRole = authenticateToken(authHeader);
    const body = await request.json();
    const { rating, comment } = body;
    if (!rating || !comment)
      return NextResponse.json(
        { error: "Error", message: "All fields are required" },
        { status: 400 }
      );
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const existingProductReview = await prisma.productReview.findUnique({
        where: {
          ReviewId: parseInt(params.productReviewId),
        },
      });
      if (!existingProductReview)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 404 }
        );
      if (existingProductReview.userId === userId) {
        await prisma.productReview.update({
          where: {
            ReviewId: parseInt(params.productReviewId),
            userId,
          },
          data: {
            comment,
            rating,
          },
        });
        return NextResponse.json(
          { message: "Product review updated successfully." },
          { status: 200 }
        );
      } else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("PUT:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { productReviewId: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 403 }
      );
    }
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const existingProductReview = await prisma.productReview.findUnique({
        where: {
          ReviewId: parseInt(params.productReviewId),
        },
      });
      if (!existingProductReview)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 404 }
        );
      if (existingProductReview.userId === userId) {
        await prisma.productReview.delete({
          where: {
            ReviewId: parseInt(params.productReviewId),
          },
        });
        return NextResponse.json(
          { message: "Product review delete successfully." },
          { status: 200 }
        );
      } else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("DELETE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

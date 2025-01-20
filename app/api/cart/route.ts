import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken, getUserId } from "../_components/authenticateToken";

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
      const carts = await prisma.cart.findMany({
        where: {
          userId,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
      if (!carts) {
        return NextResponse.json({
          error: "error",
          message: "don't have any products in cart",
        });
      }
      return NextResponse.json(
        { message: "Get products in cart successfully", data: carts },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("GET_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
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
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 403 }
      );
    const body = await request.json();
    const { productId, quantity } = body;
    if (!productId || !quantity)
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
      const existingcart = await prisma.cart.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (existingcart) {
        await prisma.cart.update({
          where: {
            cartId: existingcart.cartId,
          },
          data: {
            quantity: existingcart.quantity + quantity,
          },
        });
        return NextResponse.json(
          { message: "Add Product in cart successfully" },
          { status: 200 }
        );
      } else {
        await prisma.cart.create({
          data: {
            userId,
            productId,
            quantity,
          },
        });
      }
      return NextResponse.json(
        { message: "Add Product in cart successfully" },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("POST_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

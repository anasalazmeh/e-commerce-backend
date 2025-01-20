import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import {
  authenticateToken,
  getUserId,
} from "../../_components/authenticateToken";

export async function GET(
  request: Request,
  { params }: { params: { cartId: string } }
) {
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
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const cart = await prisma.cart.findUnique({
        where: {
          cartId: parseInt(params.cartId),
        },
      });
      if (!cart)
        return NextResponse.json(
          {
            error: "Error",
            message: "The product does already exists in cart",
          },
          { status: 404 }
        );
      if (cart.userId === userId)
        return NextResponse.json(
          { message: "Cart get successfully", data: cart },
          { status: 200 }
        );
      else
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
    console.log("GET_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { cartId: string } }
) {
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
    if (!authHeader || !authHeader.startsWith("Bearer ")){
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 403 }
      );
    }
    const userRole = authenticateToken(authHeader);
    const body = await request.json();
    const { quantity } = body;
    if (!quantity)
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
      const existingCart = await prisma.cart.findUnique({
        where: {
          cartId: parseInt(params.cartId),
        },
      });
      if (!existingCart)
        return NextResponse.json(
          {
            error: "Error",
            message: "The product does already exists in cart",
          },
          { status: 404 }
        );
      if (existingCart.userId === userId) {
        await prisma.cart.update({
          where: {
            cartId: parseInt(params.cartId),
            userId,
          },
          data: {
            quantity,
          },
        });
        return NextResponse.json(
          { message: "Product in cart update successfully" },
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
    console.log("PUT_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { cartId: string } }
) {
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
      const existingcart = await prisma.cart.findUnique({
        where: {
          cartId: parseInt(params.cartId),
        },
      });
      if (!existingcart)
        return NextResponse.json(
          {
            error: "Error",
            message: "The product in cart does already exists",
          },
          { status: 404 }
        );
      if (existingcart.userId === userId) {
        await prisma.cart.delete({
          where: {
            cartId: parseInt(params.cartId),
          },
        });
        return NextResponse.json(
          { message: "Delete product in cart successfully" },
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
    console.log("DELETE_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

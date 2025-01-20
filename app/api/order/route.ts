import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken, getUserId } from "../_components/authenticateToken";

export async function GET(request: Request) {
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
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const orders = await prisma.orders.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!orders) {
        return NextResponse.json(
          {
            error: "error",
            message: "don't have any products in cart",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Get orders successfully", data: orders },
        { status: 200 }
      );
    } else if (userRole === "Admin" || userRole === "Employee") {
      const orders = await prisma.orders.findMany({
        where: {
          status: "Paid",
        },
        include: {
          orderDetails: {
            include: {
              product: true,
            },
          },
        },
      });
      console.log(orders);
      if (!orders)
        return NextResponse.json(
          { message: "dont have any orders" },
          { status: 404 }
        );
      return NextResponse.json(
        { message: "Get orders successfully", data: orders },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
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
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const productsInCart = await prisma.cart.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
      });
      if (!productsInCart)
        return NextResponse.json(
          {
            error: "Error",
            message:
              "There was an error fetching the following products in the shopping cart.",
          },
          { status: 404 }
        );
      if (productsInCart.length == 0)
        return NextResponse.json(
          { error: "Error", message: "don' have any products in cart" },
          { status: 404 }
        );
      const totalAmount = productsInCart.reduce((total, item) => {
        return total + item.quantity * Number(item.product.price);
      }, 0);
      const orderDetails = productsInCart.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        };
      });
      const order = await prisma.orders.create({
        data: {
          totalAmount,
          status: "PendingPayment",
          userId,
          orderDetails: {
            createMany: {
              data: orderDetails,
            },
          },
        },
      });
      if (!order)
        return NextResponse.json(
          { message: "There was an error creating a request." },
          { status: 400 }
        );
      await prisma.cart.deleteMany({
        where: {
          userId,
        },
      });
      return NextResponse.json(
        { message: "Order created successfully" },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 403 }
      );
  } catch (error) {
    console.log("POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

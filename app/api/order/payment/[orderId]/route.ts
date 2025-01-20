import {
  authenticateToken,
  getUserId,
} from "@/app/api/_components/authenticateToken";
import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
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
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const order = await prisma.orders.findUnique({
        where: {
          orderId: parseInt(params.orderId),
          status: "PendingPayment",
        },
        include: {
          orderDetails: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
      if (!order)
        return NextResponse.json(
          { error: "Error", message: "The order does not already exists" },
          { status: 404 }
        );
      if (order.userId === userId)
        return NextResponse.json(
          {
            message:
              "The order you want to pay for has been successfully received.",
            data: order,
          },
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
    console.log("GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


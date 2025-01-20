import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import {
  authenticateToken,
  getUserId,
} from "../../_components/authenticateToken";
import { returnProduct } from "../../_components/returnProduct";

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
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const order = await prisma.orders.findUnique({
        where: {
          orderId: parseInt(params.orderId),
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
          { error: "Error", message: "The product does already exists" },
          { status: 400 }
        );
      if (order.userId === userId)
        return NextResponse.json(
          { message: "order get successfully", data: order },
          { status: 200 }
        );
      else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
    } else if (userRole === "Admin" || userRole === "Employee") {
      const order = await prisma.orders.findUnique({
        where: {
          orderId: parseInt(params.orderId),
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
          { error: "Error", message: "The product does already exists" },
          { status: 400 }
        );
      return NextResponse.json(
        { message: "order get successfully", data: order },
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
export async function PUT(
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
    if (!params.orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // تحويل orderId إلى رقم
    const orderId = parseInt(params.orderId);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid Order ID" },
        { status: 401 }
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
    const { status } = body;
    if (!status)
      return NextResponse.json(
        { error: "Error", message: "All fields are required" },
        { status: 403 }
      );
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
      const existingOrder = await prisma.orders.findUnique({
        where: {
          orderId: parseInt(params.orderId),
        },
      });
      if (!existingOrder)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 400 }
        );
      if (existingOrder.userId === userId) {
        await prisma.orders.update({
          where: {
            orderId: parseInt(params.orderId),
            userId,
          },
          data: {
            status,
          },
        });
        return NextResponse.json(
          { message: "Product update successfully" },
          { status: 200 }
        );
      } else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 403 }
        );
    } else if (userRole == "Admin" || userRole === "Employee") {
      console.log("startttt");
      const existingOrderAdmin = await prisma.orders.findUnique({
        where: {
          orderId,
        },
        include: {
          payments: true,
        },
      });
      if (!existingOrderAdmin)
        return NextResponse.json(
          { error: "Error", message: "The order does already exists" },
          { status: 404 }
        );

      if (status === "Cancelled") {
        const returnProducts = await returnProduct(existingOrderAdmin.orderId);
        if (returnProducts) {
          console.log("2");
          const existingpayments = await prisma.payments.findUnique({
            where: {
              paymentsId: existingOrderAdmin.payments?.paymentsId,
            },
          });
          if (!existingpayments)
            return NextResponse.json(
              { error: "Error", message: "The payments does already exists" },
              { status: 404 }
            );
          await prisma.payments.delete({
            where: {
              paymentsId: existingpayments.paymentsId,
            },
          });
          await prisma.orders.update({
            where: {
              orderId: existingOrderAdmin.orderId,
            },
            data: {
              status: "Cancelled",
            },
          });
          return NextResponse.json({ message: "Cancelled order successfully" });
        } else {
          return NextResponse.json(
            { error: "Error", message: "Failed to return products" },
            { status: 401 }
          );
        }
      } else if (status === "Completed") {
        await prisma.orders.update({
          where: {
            orderId: existingOrderAdmin.orderId,
          },
          data: {
            status: "Completed",
          },
        });
        return NextResponse.json({ message: "Completed order successfully" });
      }
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
  }catch (error) {
    console.log("PUT_CART:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    if (!authHeader) {
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );
    }
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 400 }
        );
      const existingOrder = await prisma.orders.findUnique({
        where: {
          orderId: parseInt(params.orderId),
        },
      });
      if (!existingOrder)
        return NextResponse.json(
          { error: "Error", message: "The order does already exists" },
          { status: 400 }
        );
      if (existingOrder.userId === userId) {
        if (
          existingOrder.status === "PendingPayment" ||
          existingOrder.status == "Cancelled"
        )
          await prisma.orders.delete({
            where: {
              orderId: parseInt(params.orderId),
            },
          });
        return NextResponse.json(
          { message: "order delete successfully" },
          { status: 200 }
        );
      } else
        return NextResponse.json(
          { error: "Error", message: "You do not have the authority" },
          { status: 400 }
        );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
  } catch (error) {
    console.log("DELETE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

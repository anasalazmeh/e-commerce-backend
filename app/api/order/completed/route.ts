import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";

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
    if (userRole === "Admin" || userRole === "Employee") {
      const orders = await prisma.orders.findMany({
        where: {
          status: "Completed",
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

import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken, getUserId } from "../_components/authenticateToken";
import { checkOrder } from "../_components/checkProduct";
import { buyProduct } from "../_components/buyProduct";

// export async function GET(request: Request) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { error: "Error", message: "You must be login." },
//         { status: 400 }
//       );
//     }
//     const userRole = authenticateToken(authHeader);
//     if (userRole === "User") {
//       const userId = getUserId(authHeader);
//       if (!userId)
//         return NextResponse.json(
//           { error: "Error", message: "All fields are required" },
//           { status: 400 }
//         );
//       const carts = await prisma.cart.findMany({
//         where: {
//           userId,
//         },
//       });
//       if (!carts) {
//         return NextResponse.json({
//           error: "error",
//           message: "don't have any products in cart",
//         });
//       }
//       return NextResponse.json(
//         { message: "Get products in cart successfully", data: carts },
//         { status: 200 }
//       );
//     } else
//       return NextResponse.json(
//         { error: "Error", message: "You do not have the authority" },
//         { status: 400 }
//       );
//   } catch (error) {
//     console.log("Error:", error);
//     return NextResponse.json({ error: "Interal error" }, { status: 500 });
//   }
// }
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );
    const body = await request.json();
    const { orderId, paymentMethod, amount } = body;
    if (!orderId || !paymentMethod || !amount)
      return NextResponse.json(
        { error: "Error", message: "All fields are required" },
        { status: 400 }
      );
    const userRole = authenticateToken(authHeader);
    if (userRole === "User") {
      const userId = getUserId(authHeader);
      if (!userId)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const existingPayments = await prisma.payments.findFirst({
        where: {
          orderId,
        },
      });
      if (existingPayments)
        return NextResponse.json(
          { message: "It cannot be paid because it has already been paid." },
          { status: 200 }
        );
      else {
        const order = await prisma.orders.findUnique({ where: { orderId } });
        if (order?.status === "PendingPayment") {
          const isOrderValid = await checkOrder(orderId);
          if (isOrderValid) {
            const isBuyValid = await buyProduct(orderId);
            if (isBuyValid) {
              await prisma.payments.create({
                data: {
                  orderId,
                  paymentMethod,
                  amount,
                },
              });
              return NextResponse.json(
                { message: "Add Product in cart successfully" },
                { status: 200 }
              );
            } else
              return NextResponse.json(
                {
                  error: "Error",
                  message:
                    "This order cannot be purchased because the products are not available.",
                },
                { status: 400 }
              );
          } else
            return NextResponse.json(
              {
                error: "Error",
                message:
                  "This order cannot be purchased because the products are not available.",
              },
              { status: 400 }
            );
        }
        else
        NextResponse.json({error:"Error",message:"No order found that we can pay for."})
      }
    }
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

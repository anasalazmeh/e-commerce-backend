import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import {
  authenticateToken,
  getUserId,
} from "../_components/authenticateToken";

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
          { status: 400 }
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
        await prisma.productReview.create({
          data: {
            userId,
            productId,
            rating,
            comment
          },
        });
        return NextResponse.json(
          { message: "Add rating for product successfully" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

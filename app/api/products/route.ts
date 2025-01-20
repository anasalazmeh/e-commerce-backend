import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../_components/authenticateToken";
export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const products = await prisma.products.findMany({
      include: {
        category: true,
        images: true,
        productReview: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!products) {
      return NextResponse.json({
        error: "error",
        message: "don't have any products",
      });
    }
    return NextResponse.json(
      { message: "Get products successfully", data: products },
      { status: 200 }
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
    if (userRole === "Admin" || userRole === "Employee") {
      const body = await request.json();
      const { categoryId, name, description, price, stock, images } = body;
      if (!categoryId || !name || !description || !price || !stock)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const product = await prisma.products.create({
        data: {
          categoryId: parseInt(categoryId),
          name,
          description,
          price,
          stock,
          images: {
            createMany: {
              data: images.map((image: { url: string }) => ({
                url: image.url,
              })),
            },
          },
        },
      });
      if (!product) {
        return NextResponse.json({
          error: "error",
          message: "not have categories",
        });
      }
      return NextResponse.json(
        { message: "Product create successfully", data: product },
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

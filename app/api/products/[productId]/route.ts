import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    if (!isNaN(parseInt(params.productId)) && params.productId) {
      const product = await prisma.products.findUnique({
        where: {
          productId: parseInt(params.productId),
        },
        include: {
          images: true,
          category: true,
          productReview: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!product)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 404 }
        );
      return NextResponse.json(
        { message: "Product get successfully", data: product },
        { status: 200 }
      );
    } else
      return NextResponse.json({ message: "Wrong number id" }, { status: 400 });
  } catch (error) {
    console.log("GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
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
    if (userRole === "Admin" || userRole === "Employee") {
      const body = await request.json();
      const { categoryId, name, description, price, stock, images } = body;
      if (!categoryId || !name || !description || !price || !stock || !images)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const existingProduct = await prisma.products.findMany({
        where: {
          categoryId: parseInt(params.productId),
        },
      });
      if (!existingProduct)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 404 }
        );
      await prisma.products.update({
        where: {
          productId: parseInt(params.productId),
        },
        data: {
          categoryId: parseInt(categoryId),
          name,
          description,
          price,
          stock,
          images: {
            deleteMany: {},
          },
        },
      });
      await prisma.products.update({
        where: {
          productId: parseInt(params.productId),
        },
        data: {
          images: {
            createMany: {
              data: images,
            },
          },
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
  { params }: { params: { productId: string } }
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
    if (userRole === "Admin" || userRole === "Employee") {
      const existingProduct = await prisma.products.findUnique({
        where: {
          productId: parseInt(params.productId),
        },
      });
      if (!existingProduct)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 404 }
        );
      await prisma.products.delete({
        where: {
          productId: parseInt(params.productId),
        },
      });
      return NextResponse.json(
        { message: "Product delete successfully" },
        { status: 200 }
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

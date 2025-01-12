import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );

    const userRole = authenticateToken(authHeader);
    if (userRole === "Admin" || userRole === "Employee") {
      const product = await prisma.products.findMany({
        where: {
          productId: parseInt(params.productId),
        },
      });
      if (!product)
        return NextResponse.json(
          { error: "Error", message: "The product does already exists" },
          { status: 400 }
        );

      return NextResponse.json(
        { message: "Product get successfully", data: product },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );
    }
    const userRole = authenticateToken(authHeader);
    if (userRole === "Admin" || userRole === "Employee") {
      const body = await request.json();
      const { categoryId, name, description, price, stock,images } = body;
      if (!categoryId || !name || !description || !price || !stock ||!images)
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
          { status: 400 }
        );
      await prisma.products.update({
        where: {
          productId: parseInt(params.productId),
        },
        data:{
          categoryId,
          name,
          description,
          price,
          stock,
          images: {
            createMany: {
              data: [...images.map((image: { url: string }) => image)],
            },
          },
        }
      });
      return NextResponse.json(
        { message: "Product update successfully" },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
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
          { status: 400 }
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
        { status: 400 }
      );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

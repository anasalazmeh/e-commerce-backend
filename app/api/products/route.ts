import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../_components/authenticateToken";

export async function GET(request: Request) {
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
      const products = await prisma.products.findMany();
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
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );

    const userRole = authenticateToken(authHeader);
    if (userRole === "Admin" || userRole === "Employee") {
      const body = await request.json();
      const { categoryId, name, description, price, stock,images } = body;
      if (!categoryId || !name || !description || !price || !stock ||!images)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );

      // const existingCategory = await prisma.products.findUnique({
      //   where: {
      //     name,
      //   },
      // });

      // if (existingCategory) {
      //   return NextResponse.json(
      //     { error: "Error", message: "category already exists" },
      //     { status: 400 }
      //   );
      // }
      const product = await prisma.products.create({
        data: {
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
        { status: 400 }
      );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

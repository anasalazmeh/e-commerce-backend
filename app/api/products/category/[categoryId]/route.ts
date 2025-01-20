import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }
    const products = await prisma.products.findMany({
      where: {
        categoryId: parseInt(params.categoryId),
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!products)
      return NextResponse.json({
        error: "Error",
        message: "Error get product",
      },{status:404});
    return NextResponse.json({
      message: "Products get successfully",
      data: products,
    },{status:200});
  } catch (error) {
    console.log("GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

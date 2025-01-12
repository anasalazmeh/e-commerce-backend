import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { authenticateToken } from "../../_components/authenticateToken";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
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
      const category = await prisma.categories.findMany({
        where: {
          categoryId: parseInt(params.categoryId),
        },
      });
      if (!category)
        return NextResponse.json(
          { error: "Error", message: "The category does already exists" },
          { status: 400 }
        );

      return NextResponse.json(
        { message: "Category get successfully", data: category },
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
  { params }: { params: { categoryId: string } }
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
      const { name, description } = body;
      if (!name || !description)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );
      const existingCategory = await prisma.categories.findUnique({
        where: {
          categoryId: parseInt(params.categoryId),
        },
      });
      if (!existingCategory)
        return NextResponse.json(
          { error: "Error", message: "The category does already exists" },
          { status: 400 }
        );
      await prisma.categories.update({
        where: {
          categoryId: parseInt(params.categoryId),
        },
        data:{
          name,
          description
        }
      });
      return NextResponse.json(
        { message: "Category update successfully" },
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
  { params }: { params: { categoryId: string } }
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
      const existingCategory = await prisma.categories.findMany({
        where: {
          categoryId: parseInt(params.categoryId),
        },
      });
      if (!existingCategory)
        return NextResponse.json(
          { error: "Error", message: "The category does already exists" },
          { status: 400 }
        );
      await prisma.categories.delete({
        where: {
          categoryId: parseInt(params.categoryId),
        },
      });
      return NextResponse.json(
        { message: "Category delete successfully" },
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

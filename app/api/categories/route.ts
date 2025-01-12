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
      const categories = await prisma.categories.findMany();
      if (!categories) {
        return NextResponse.json({
          error: "error",
          message: "don't have any categories",
        });
      }
      return NextResponse.json(
        { message: "get categories successfully", data: categories },
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
      const { name, description } = body;
      if (!name || !description)
        return NextResponse.json(
          { error: "Error", message: "All fields are required" },
          { status: 400 }
        );

      const existingCategory = await prisma.categories.findUnique({
        where: {
          name,
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Error", message: "category already exists" },
          { status: 400 }
        );
      }
      const category = await prisma.categories.create({
        data: {
          name,
          description,
        },
      });
      if (!category) {
        return NextResponse.json({
          error: "error",
          message: "not have categories",
        });
      }
      return NextResponse.json(
        { message: "Category create successfully", data: category },
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

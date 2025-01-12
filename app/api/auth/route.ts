import { NextResponse } from "next/server";
import prisma from "../../../prisma/client";
import _ from "lodash";
import { authenticateToken } from "../_components/authenticateToken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Error", message: "You must be login." },
        { status: 400 }
      );
    const userRole = authenticateToken(authHeader);
    if (userRole === "Admin") {
      const users = await prisma.user.findMany({
        where: {
          roles: {
            in: ["Admin", "Employee"],
          },
        },
      });
      const userWithoutPassword = users.map((item) =>
        _.omit(item, ["password"])
      );
      return NextResponse.json(
        { message: "Get users successfully", user: userWithoutPassword },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { error: "Error", message: "You do not have the authority" },
        { status: 400 }
      );
  } catch (error) {
    console.error("User_GET", error);
    return NextResponse.json({ error: "Interal error" }, { status: 500 });
  }
}

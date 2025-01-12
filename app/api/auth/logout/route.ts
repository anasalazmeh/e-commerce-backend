
import { NextResponse } from "next/server";
export async function POST(requset:Request) {
  try {
    const token = requset.headers.get('authorization')?.split(' ')[1];
    if(!token){
      return NextResponse.json({error:"Error", message:"Token not provided"},{status:401})
    }
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Something went wrong during logout" }, { status: 500 });
  }
}

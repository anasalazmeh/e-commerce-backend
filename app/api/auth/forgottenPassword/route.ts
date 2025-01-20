import prisma, { checkDatabaseConnection } from "@/prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator";

export async function POST(request: Request) {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { message: "Internal Server Error. Please try again later." },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email." },
        { status: 404 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.roles },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" }
    );

    // Create password reset URL
    const URL = `${process.env.BASE_URL}/changePassword/${token}`;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const fullName = user.fullName || "User";

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Shopping",
      text: `Hi ${fullName},\n\nWe received a request to reset the password for your account at Shopping. If you initiated this request, please click the link below to reset your password:\n\n${URL}\n\nIf you did not request a password reset, you can safely ignore this email.\n\nBest regards,\nThe Shopping Team`,
      html: `
        <p>Hi ${fullName},</p>
        <p>We received a request to reset the password for your account at <strong>Shopping</strong>. If you initiated this request, please click the button below to reset your password:</p>
        <p>
          <a href="${URL}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The <strong>Shopping</strong> Team</p>
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: "The email was sent successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        {
          error: "EmailError",
          message: "Failed to send email. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "InternalError", message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=missing_token", req.url)
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=invalid_token", req.url)
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(
        new URL("/auth/signin?error=expired_token", req.url)
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=user_not_found", req.url)
      );
    }

    // Update user's email_verified field
    await prisma.user.update({
      where: { id: user.id },
      data: { email_verified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to signin with success message
    return NextResponse.redirect(
      new URL("/auth/signin?verified=true", req.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL("/auth/signin?error=verification_failed", req.url)
    );
  }
}

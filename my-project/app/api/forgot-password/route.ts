import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Find user — don't reveal if email exists or not (security)
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (user) {
    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to DB
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      const resend = getResend();
      if (!resend) {
        console.error("Password reset email failed: RESEND_API_KEY is not configured");
        return NextResponse.json(
          { error: "Unable to send the reset email right now" },
          { status: 502 },
        );
      }

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Reset your password",
        html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });

      if (error) {
        console.error("Password reset email was rejected by Resend", error);
        return NextResponse.json(
          { error: "Unable to send the reset email right now" },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("Password reset email failed", error);
      return NextResponse.json(
        { error: "Unable to send the reset email right now" },
        { status: 502 },
      );
    }
  }

  // Always return success (don't reveal if email exists)
  return NextResponse.json({ success: true });
}

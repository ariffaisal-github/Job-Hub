import { prisma } from "../config/prisma";
import { redis } from "../config/redis";
import { generateOtp } from "../utils/otp";
import bcrypt from "bcryptjs";
import { env } from "../utils/env";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export async function signupService(
  email: string,
  password: string,
  role: Role = Role.EMPLOYEE
) {
  // 1️⃣ Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.isVerified) throw new Error("User already exists");
    // Resend new OTP if not verified
    const code = generateOtp(4);
    await redis.setex(`otp:${email}`, 180, code);
    console.log(`Resent OTP for ${email}: ${code}`);
    return {
      message: `OTP resent. Please verify your account. (Since you can't watch logs, I am providing the actual OTP: ${code})`,
    };
  }

  // 2️⃣ Hash password
  const hashed = await bcrypt.hash(password, 10);

  // 3️⃣ Create user (isVerified = false)
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  // 4️⃣ Generate OTP
  const code = generateOtp(4);
  await redis.setex(`otp:${email}`, 180, code); // 3 minutes expiry

  // 5️⃣ (Later) send email or SMS here
  console.log(`OTP for ${email}: ${code}`);

  // 6️⃣ Persist record for audit
  await prisma.otpCode.create({
    data: {
      userId: user.id,
      code,
      purpose: "SIGNUP",
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    },
  });

  return {
    message: `User created. Verify OTP sent. (Since you can't watch logs, I am providing the actual OTP: ${code})`,
  };
}

export async function verifyOtpService(email: string, code: string) {
  // 1️⃣ Get OTP from Redis
  const stored = await redis.get(`otp:${email}`);
  if (!stored) throw new Error("OTP expired or not found");

  if (stored !== code) throw new Error("Invalid OTP");

  // 2️⃣ Mark user as verified
  const user = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  // 3️⃣ Delete Redis key
  await redis.del(`otp:${email}`);

  // 4️⃣ Optionally, delete old OtpCode records
  await prisma.otpCode.updateMany({
    where: { userId: user.id, code },
    data: { consumed: true },
  });

  // 5️⃣ Issue JWT tokens
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, type: "refresh" },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // 6️⃣ Save refresh token in DB
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      rid: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    message: "OTP verified successfully",
    accessToken,
    refreshToken,
  };
}

export async function loginService(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  if (!user.isVerified)
    throw new Error("User not verified. Please verify OTP first.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, type: "refresh" },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      rid: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { message: "Login successful", accessToken, refreshToken };
}

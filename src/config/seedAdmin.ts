import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
  try {
    const adminEmail = "admin@example.com";

    // ✅ Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log(
        "Default admin user → email: admin@example.com | pass: admin"
      );
      return;
    }

    // ✅ Create admin if not found
    const hashed = await bcrypt.hash("admin", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        role: "ADMIN",
        isVerified: true,
      },
    });

    console.log(
      "🧑 Default admin user created → email: admin@example.com | pass: admin"
    );
  } catch (err) {
    console.error("❌ Failed to seed admin:", err);
  }
}

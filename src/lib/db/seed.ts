import "dotenv/config";
import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if admin user already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, process.env.SUPER_ADMIN_EMAIL!));

    if (existingAdmin) {
      console.log("✅ Admin user already exists, skipping seed.");
      return;
    }

    // Create admin user
    const hashedPassword = bcrypt.hashSync(
      process.env.SUPER_ADMIN_PASSWORD!,
      10
    );

    await db.insert(users).values({
      email: process.env.SUPER_ADMIN_EMAIL!,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${process.env.SUPER_ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${process.env.SUPER_ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("🎉 Database seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Database seeding failed:", error);
      process.exit(1);
    });
}

export { seed };

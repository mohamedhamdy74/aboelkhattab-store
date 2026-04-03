import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // We use the direct database connection (DIRECT_URL) for migrations and db push.
    url: env("DIRECT_URL"),
  },
});

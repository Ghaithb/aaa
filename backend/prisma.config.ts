import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: {
    // Adapter – the Prisma engine
    adapter: {
      kind: "adapter",
      id: "prisma-adapter",
      targetId: "postgres-target",
      create: () => ({}),
      familyId: "postgres-family",
    },
    // Family – PostgreSQL family
    family: {
      kind: "family",
      id: "postgres-family",
      version: "17",
      type: "postgresql",
      create: () => ({}),
      emission: {},
    },
    // Target – the actual datasource (reads DATABASE_URL env var)
    target: {
      kind: "target",
      id: "postgres-target",
      version: "17",
      familyId: "postgres-family",
      datasource: {
        url: process.env.DATABASE_URL,
      },
      create: () => ({}),
    },
  },
  // Keep existing skill configuration (optional for CI)
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});

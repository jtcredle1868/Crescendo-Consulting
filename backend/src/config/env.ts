import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL", "postgresql://localhost:5432/crescendo"),
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  verificationProvider: (process.env.VERIFICATION_PROVIDER ?? "MANUAL") as "MANUAL" | "IDME",
  idmeClientId: process.env.IDME_CLIENT_ID,
  idmeClientSecret: process.env.IDME_CLIENT_SECRET,
  idmeRedirectUri: process.env.IDME_REDIRECT_URI,
};

export const isProduction = env.nodeEnv === "production";

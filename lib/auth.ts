import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
      },
      bio: {
        type: "string",
      },
      avatar: {
        type: "string",
      },
    },
  },

  plugins: [nextCookies()],
});

export type session = typeof auth.$Infer.Session;
export type sessionUser = typeof auth.$Infer.Session.user;

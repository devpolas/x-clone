import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";

type CreateUserData = {
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  image?: string;
};

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
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
      },
      avatar: {
        type: "string",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (ctx) => {
          const data = ctx?.data ?? {};

          const user = data as {
            name?: string;
            username?: string;
            bio?: string;
            avatar?: string;
            image?: string;
          };

          const base = (user.name ?? "user")
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 20);

          const username =
            typeof user.username === "string" && user.username.length > 0
              ? user.username
              : `${base}${Math.floor(Math.random() * 9000 + 1000)}`;

          return {
            data: {
              ...user,
              username,
              bio: user.bio ?? "",
              avatar: user.avatar ?? user.image ?? "",
            },
          };
        },
      },
    },
  },

  plugins: [nextCookies()],
});

export type session = typeof auth.$Infer.Session;
export type sessionUser = typeof auth.$Infer.Session.user;

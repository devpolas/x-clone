"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type AuthResult = { success: boolean; message: string };

// Helper to get headers once
async function getHeaders() {
  return await headers();
}

export async function signinWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const result = await auth.api.signInEmail({
    body: { email, password },
    headers: await getHeaders(),
  });

  if (result.user) {
    return { success: true, message: "Successfully signed in" };
  }

  // Explicit failure if no user returned
  return { success: false, message: "Failed to sign in" };
}

export async function signupWithEmail(
  email: string,
  password: string,
  name: string,
  username: string,
): Promise<AuthResult> {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      username,
      bio: "",
      avatar: "",
    },
    headers: await getHeaders(),
  });

  if (result.user) {
    return { success: true, message: "Successfully signed up" };
  }

  return { success: false, message: "Failed to sign up" };
}

export async function signinWithGoogle(): Promise<AuthResult> {
  const result = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
    headers: await getHeaders(),
  });

  if (result.url) {
    redirect(result.url);
  } else {
    console.error("Google signin error: no redirect URL returned");
    return { success: false, message: "Google auth failed" };
  }
}

export async function signOut(): Promise<void> {
  const result = await auth.api.signOut({ headers: await getHeaders() });
  if (result.success) {
    redirect("/");
  } else {
    console.error("signOut failed");
  }
}

export async function getSession() {
  return await auth.api.getSession({ headers: await getHeaders() });
}

"use server";

import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { headers } from "next/headers";

export async function signinWithEmail(email: string, password: string) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    if (result.user) {
      redirect("/");
    }
  } catch (error) {
    if (error) {
      throw error;
    }
  }
}

export async function signupWithEmail(
  email: string,
  password: string,
  name: string,
  username: string,
) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        username,
        bio: "",
        avatar: "",
      },
      headers: await headers(),
    });

    if (result.user) {
      redirect("/");
    }
  } catch (error) {
    if (error) {
      throw error;
    }
  }
}

export async function signinWithGoogle() {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/",
      },
      headers: await headers(),
    });

    if (result.url) {
      redirect(result.url);
    }
  } catch (error) {
    if (error) {
      throw error;
    }
  }
}

export async function signOut() {
  const result = await auth.api.signOut({ headers: await headers() });

  if (result.success) {
    redirect("/signin");
  }
}

export async function getSession() {
  try {
    const result = await auth.api.getSession({ headers: await headers() });
    return result;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
}

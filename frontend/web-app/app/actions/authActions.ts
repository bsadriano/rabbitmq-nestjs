"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session) return null;

    return session.user;
  } catch (error) {
    return null;
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  try {
    const res = await signIn("credentials", {
      redirectTo: "/",
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

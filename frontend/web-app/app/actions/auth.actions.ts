"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import agent from "../lib/agent";

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

export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const password = formData.get("password")?.toString();

  try {
    const registerUserSchema = z.object({
      email: z.string().email(),
      username: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string().min(6),
    });
    const { success, data } = registerUserSchema.safeParse({
      username,
      email,
      firstName,
      lastName,
      password,
    });
    if (!success) {
      throw new Error("Invalid data");
    }

    const res = await agent.Auth.register(data);

    if ("error" in res) {
      throw new Error(res.error.message);
    }

    await signIn("credentials", {
      redirectTo: "/",
      email,
      password,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong";
      }
    }
    return error.message;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

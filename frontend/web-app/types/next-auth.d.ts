import { AppUser } from "@/app/lib/definitions";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: AppUser & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    error: string;
  }

  interface Profile {
    username: string;
  }

  interface User {
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    accessToken: string;
  }
}

export declare module "next-auth" {}

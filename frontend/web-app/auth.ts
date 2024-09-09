import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import agent from "./app/lib/agent";

async function getUser(email: string, password: string) {
  try {
    const response = await agent.Auth.login({ email, password });
    return response;
  } catch (err) {
    console.log(err);
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { success, data } = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (success) {
          const { email, password } = data;
          const user = await getUser(email, password);
          return user ?? null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      session.user = {
        ...session.user,
        ...token,
      } as typeof session.user;
      return session;
    },
  },
});

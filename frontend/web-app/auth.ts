import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import agent from "./app/lib/agent";
import { authConfig } from "./auth.config";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserSchema = z.infer<typeof userSchema>;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { success, data } = userSchema.safeParse(credentials);

        if (success) {
          const user = await agent.Auth.login(data);
          if (!(user && "error" in user)) {
            return user;
          }
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
      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      if (token.accessToken) {
        const decodedToken = jwtDecode(token.accessToken as string);
        token.accessTokenExpires = (decodedToken?.exp! * 1000) as number;
      }

      console.log(
        "**** Access token expires on *****",
        token.accessTokenExpires,
        new Date(token.accessTokenExpires as number).toLocaleString()
      );
      if (Date.now() < (token.accessTokenExpires as number)) {
        console.log("**** returning previous token ******");
        return token;
      }
      if (!token.refreshToken) throw new TypeError("Missing refreshToken");

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/refresh-token",
          {
            method: "POST",
            body: new URLSearchParams({
              token: token.refreshToken as string,
            }),
          }
        );

        const tokensOrError = await response.json();
        if (!response.ok) throw tokensOrError;

        const newTokens = tokensOrError as {
          accessToken: string;
          refreshToken: string;
        };
        const decodedToken = jwtDecode(newTokens.accessToken as string);

        token.refreshToken = newTokens.refreshToken;
        token.accessToken = newTokens.accessToken;
        token.accessTokenExpires = (decodedToken?.exp! * 1000) as number;

        return token;
      } catch (error) {
        console.error("Error refreshing accessToken", error);
        token.error = "RefreshTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      if (typeof token.refreshToken === "string") {
        session.refreshToken = token.refreshToken;
      }
      session.user = {
        ...session.user,
        ...token,
      } as typeof session.user;
      return session;
    },
  },
});

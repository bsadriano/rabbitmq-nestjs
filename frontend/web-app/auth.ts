import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import agent from "./app/lib/agent";
import { authConfig } from "./auth.config";
const baseUrl = process.env.APP_API_URL || "http://localhost:8080/api";

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
          console.log({
            user,
          });
          if (!(user && "status" in user && user.status === "error")) {
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
        token.accessTokenExpires = Number(decodedToken?.exp!);
      }

      if (token.refreshToken) {
        const decodedToken = jwtDecode(token.refreshToken as string);
        token.refreshTokenExpires = Number(decodedToken?.exp!);
      }

      if (
        token.accessTokenExpires &&
        Date.now() < Number(token.accessTokenExpires) * 1000
      ) {
        // console.log("**** returning previous token ******");
        return token;
      }

      if (!token.refreshToken) throw new TypeError("Missing refreshToken");

      // refresh token also expired, logout user
      if (Date.now() >= Number(token.refreshTokenExpires) * 1000) {
        return {
          ...token,
          error: "AccessTokenError",
        };
      }

      try {
        console.log({
          huh: {
            token: token.refreshToken as string,
          },
        });
        const response = await fetch(`${baseUrl}/auth/refresh-token`, {
          method: "POST",
          body: new URLSearchParams({
            token: token.refreshToken as string,
          }),
        });

        const tokensOrError = await response.json();
        if (!response.ok) throw tokensOrError;

        const newTokens = tokensOrError as {
          accessToken: string;
          refreshToken: string;
        };
        const decodedAccessToken = jwtDecode(newTokens.accessToken as string);
        const decodedRefreshToken = jwtDecode(newTokens.refreshToken as string);

        token.refreshToken = newTokens.refreshToken;
        token.accessToken = newTokens.accessToken;
        token.accessTokenExpires = Number(decodedAccessToken?.exp!);
        token.refreshTokenExpires = Number(decodedRefreshToken?.exp!);

        return token;
      } catch (error: any) {
        console.error(
          "Error refreshing accessToken",
          error.message,
          error.stack
        );
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
      if (typeof token.error === "string") {
        session.error = token.error;
      }
      session.user = {
        ...session.user,
        ...token,
      } as typeof session.user;
      return session;
    },
  },
});

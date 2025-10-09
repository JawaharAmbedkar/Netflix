import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      membership: boolean;
      amount: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    membership: boolean;
    amount: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    membership: boolean;
    amount: number;
  }
}

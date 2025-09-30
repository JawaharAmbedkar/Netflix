import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db";
import { compare } from "bcrypt";
import { UserSchema } from "apps/web/types/user";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        const parsed = UserSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid credentials format");
        }

        const { email, password } = parsed.data;
        const emailOrPhone = email.toLowerCase();

       
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
          },
          include: { membershipRecord: true },
        });

        if (!user || !user.password) {
          throw new Error("User does not exist");
        }

        
        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name ?? null,
          membership: user.membershipRecord?.status ?? false,
          amount: user.membershipRecord?.amount ?? 0,
        } as any;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { membershipRecord: true },
        });

        if (!existingUser) {
          const createdUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              membership: false,
              amount: 1000,
              membershipRecord: {
                create: {
                  amount: 1000,
                  status: false,
                },
              },
            },
          });

          user.id = createdUser.id.toString();
          user.membership = false;
          user.amount = 1000;
        } else {
          user.id = existingUser.id.toString();
          user.membership = existingUser.membershipRecord?.status ?? false;
          user.amount = existingUser.membershipRecord?.amount ?? 0;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.membership = user.membership;
        token.amount = user.amount;
      }

      if (token.id) {
        const userInDb = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          include: { membershipRecord: true },
        });

        if (userInDb) {
          token.membership = userInDb.membershipRecord?.status ?? false;
          token.amount = userInDb.membershipRecord?.amount ?? 0;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.membership = token.membership as boolean;
        session.user.amount = token.amount as number;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);

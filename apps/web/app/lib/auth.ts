import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from '@repo/db';
import { UserSchema } from "../../types/user";
import { compare } from "bcrypt";


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
        if (!parsed.success) throw new Error("Invalid credentials format");

        const { email, password } = parsed.data;
        const emailOrPhone = email.toLowerCase();

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
          include: { membershipRecord: true },
        });

        if (!user || !user.password) throw new Error("User does not exist");

        const isValid = await compare(password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: String(user.id), 
          email: user.email,
          name: user.name,
          membership: user.membership,
          amount: user.amount,
        };
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
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const createdUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              membership: false,
              amount: 1000,
              membershipRecord: { create: { amount: 1000, status: false } },
            },
          });

          user.id = String(createdUser.id); 
        } else {
          user.id = String(existingUser.id); 
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.email = user.email;
        token.name = user.name;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) }, 
          select: { membership: true, amount: true },
        });

        if (dbUser) {
          token.membership = dbUser.membership;
          token.amount = dbUser.amount;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id); 
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        session.user.membership = token.membership as boolean;
        session.user.amount = token.amount as number;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

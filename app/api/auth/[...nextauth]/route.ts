import NextAuth from "next-auth";
import type { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

type AppUser = {
  id?: string;
  role?: string;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        }

        // Check if staff has been approved by admin
        if (user.role === 'staff' && !user.approved) {
          throw new Error("Account pending admin approval");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const appUser = user as AppUser;
        token.role = appUser.role;
        token.id = appUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as DefaultSession["user"] & AppUser;
        sessionUser.role = token.role as string | undefined;
        sessionUser.id = token.id as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt" as const,
    // Session expires after 8 hours of inactivity
    maxAge: 8 * 60 * 60,
  },
  // Explicitly configure the JWT cookie as HttpOnly
  // NextAuth does this by default, but we make it explicit for clarity
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,       // Not accessible via document.cookie — prevents XSS
        sameSite: 'lax' as const,  // Prevents CSRF
        path: '/',
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

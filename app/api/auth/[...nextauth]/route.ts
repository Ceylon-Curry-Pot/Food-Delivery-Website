import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import LoyaltyMember from "@/lib/models/LoyaltyMember";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    // ── Admin / Staff credentials ──────────────────────────────────────
    CredentialsProvider({
      id: "credentials",
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

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          accountType: 'admin' as const,
        };
      }
    }),

    // ── Loyalty member credentials ─────────────────────────────────────
    CredentialsProvider({
      id: "loyalty-credentials",
      name: "Loyalty",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDatabase();

        // Select passwordHash explicitly since it's excluded by default
        const member = await LoyaltyMember.findOne({ email: credentials.email })
          .select('+passwordHash');

        if (!member || !member.passwordHash) {
          // Same error message whether email exists or not — no enumeration leak
          throw new Error("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          member.passwordHash
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        }

        return {
          id:           member._id.toString(),
          name:         member.name,
          email:        member.email,
          accountType:  'loyalty' as const,
          tier:         member.tier,
          points:       member.points,
          memberNumber: member.memberNumber,
          memberSince:  member.memberSince.toISOString(),
          phone:        member.phone,
          birthday:     member.birthday,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.accountType = user.accountType;

        // Admin-specific fields
        if (user.accountType === 'admin') {
          token.role = user.role;
        }

        // Loyalty-specific fields
        if (user.accountType === 'loyalty') {
          token.tier         = user.tier;
          token.points       = user.points;
          token.memberNumber = user.memberNumber;
          token.memberSince  = user.memberSince;
          token.phone        = user.phone;
          token.birthday     = user.birthday;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id          = token.id;
        session.user.accountType = token.accountType;

        // Admin-specific fields
        if (token.accountType === 'admin') {
          session.user.role = token.role;
        }

        // Loyalty-specific fields
        if (token.accountType === 'loyalty') {
          session.user.tier         = token.tier;
          session.user.points       = token.points;
          session.user.memberNumber = token.memberNumber;
          session.user.memberSince  = token.memberSince;
          session.user.phone        = token.phone;
          session.user.birthday     = token.birthday;
        }
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

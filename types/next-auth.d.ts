import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: string;
    approved?: boolean;
    accountType?: 'admin' | 'loyalty';
    tier?: string;
    points?: number;
    memberNumber?: string;
    memberSince?: string;
    phone?: string;
    birthday?: string;
  }

  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    approved?: boolean;
    accountType?: 'admin' | 'loyalty';
    tier?: string;
    points?: number;
    memberNumber?: string;
    memberSince?: string;
    phone?: string;
    birthday?: string;
  }
}

import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getUserPermissions, grantPermission, PERMISSIONS } from '@/lib/permissions';

declare module 'next-auth' {
  interface User {
    role?: Role;
    permissions?: string[];
  }
  
  interface Session {
    user: User & {
      role?: Role;
      permissions?: string[];
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
          });
          session.user.role = dbUser?.role || 'USER';
          
          // Add user permissions to the session
          session.user.permissions = await getUserPermissions(user.id);
        } catch (error) {
          console.error('Error getting user data:', error);
          session.user.role = 'USER';
          session.user.permissions = [];
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!account || !user?.id) return true;

      // If this is a Discord login and the ID matches admin ID, just let them in
      // We'll handle permissions after login
      if (account.provider === 'discord' && 
          account.providerAccountId === process.env.ADMIN_DISCORD_ID) {
        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // If this is the initial sign in
      if (account && user) {
        // Try to set up admin permissions if this is the admin
        if (account.provider === 'discord' && 
            account.providerAccountId === process.env.ADMIN_DISCORD_ID) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: 'ADMIN' },
            });
            
            await grantPermission(user.id, PERMISSIONS.ADMIN);
          } catch (error) {
            console.error('Error setting up admin permissions:', error);
            // Continue anyway - we'll try again on next login
          }
        }
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/error",
    // signOut: "/auth/signout",
  },
});
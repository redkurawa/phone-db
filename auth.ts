import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            try {
                const dbUser = await db.user.findUnique({
                    where: { email: user.email },
                });

                // First user becomes admin
                if (!dbUser) {
                    const userCount = await db.user.count();
                    const isFirstUser = userCount === 0;

                    await db.user.create({
                        data: {
                            email: user.email,
                            name: user.name || "",
                            image: user.image,
                            role: isFirstUser ? "ADMIN" : "VIEWER",
                            isApproved: isFirstUser,
                        },
                    });
                }

                return true;
            } catch (error) {
                console.error("Sign in error:", error);
                return false;
            }
        },
        async jwt({ token, user, trigger }) {
            // On sign in or token update, fetch user data from database
            if (user?.email || trigger === "update") {
                try {
                    const dbUser = await db.user.findUnique({
                        where: { email: user?.email || (token.email as string) },
                    });

                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                        token.isApproved = dbUser.isApproved;
                    }
                } catch (error) {
                    console.error("JWT callback error:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "VIEWER";
                session.user.isApproved = token.isApproved as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos");
                }

                await connectDB();

                const user = await User.findOne({ 
                    email: credentials.email.toLowerCase() 
                }).select("+password");

                if (!user) {
                    throw new Error("Credenciales inválidas");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password || ""
                );

                if (!isPasswordValid) {
                    throw new Error("Credenciales inválidas");
                }

                if (!user.isActive) {
                    throw new Error("Credenciales inválidas");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    feesUpToDate: user.feesUpToDate,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();

                const existingUser = await User.findOne({ 
                    email: user.email?.toLowerCase() 
                });

                if (existingUser) {
                    // Actualizar imagen si cambió
                    if (user.image && existingUser.image !== user.image) {
                        existingUser.image = user.image;
                        await existingUser.save();
                    }

                    if (!existingUser.isActive) {
                        return false;
                    }
                } else {
                    // Crear nuevo usuario
                    await User.create({
                        name: user.name,
                        email: user.email?.toLowerCase(),
                        image: user.image,
                        provider: "google",
                        emailVerified: new Date(),
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                await connectDB();
                const dbUser = await User.findOne({ 
                    email: token.email?.toLowerCase() 
                });
                
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.image = dbUser.image;
                    token.feesUpToDate = dbUser.feesUpToDate;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.image = token.image as string;
                session.user.feesUpToDate = token.feesUpToDate as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

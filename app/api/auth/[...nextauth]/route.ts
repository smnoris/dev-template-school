// NOTA: next-auth v4 no soporta oficialmente Next.js 16.
// Para resolver esto, considerar:
// 1. Downgrade a Next.js 15, o
// 2. Upgrade a Auth.js v5 (npm install next-auth@beta)
// El código actual funciona pero puede tener advertencias de peer dependencies.
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

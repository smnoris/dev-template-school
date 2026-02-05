import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // Validaciones básicas
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email y contraseña son requeridos" },
                { status: 400 }
            );
        }

        // Buscar usuario incluyendo password
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        
        if (!user) {
            return NextResponse.json(
                { message: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password || "");
        
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return NextResponse.json(
                { message: "Usuario desactivado" },
                { status: 403 }
            );
        }

        // No devolver la contraseña en la respuesta
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        };

        return NextResponse.json(
            { message: "Inicio de sesión exitoso", user: userResponse },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json(
            { message: "Error al iniciar sesión", error: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}

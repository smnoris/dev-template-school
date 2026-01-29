import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";

/**
 * Handle user registration requests and create a new user account.
 *
 * @returns A NextResponse containing a success message and a sanitized user object (`_id`, `name`, `email`, `birthDate`, `socialMedia`) with status `201` on successful registration; a JSON error message with status `400` when required fields are missing or the email is already registered; or a JSON error message with status `500` when an unexpected server error occurs.
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, password, birthDate, socialMedia } = await req.json();

        // Validaciones básicas
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email y contraseña son requeridos" },
                { status: 400 }
            );
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: "El email ya está registrado" },
                { status: 400 }
            );
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            socialMedia,
            provider: "credentials",
        });

        // No devolver la contraseña en la respuesta
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            birthDate: newUser.birthDate,
            socialMedia: newUser.socialMedia,
        };

        return NextResponse.json(
            { message: "Usuario registrado exitosamente", user: userResponse },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json(
            { message: "Error al registrar usuario", error: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}
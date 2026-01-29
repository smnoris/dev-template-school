import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import User from '@/database/user.model';

/**
 * Handle POST requests to create a new user with an optional uploaded image and persist it to the database.
 *
 * @returns For a successful creation: a JSON object `{ message: 'User Created Successfully', user: <created user> }` with status `201`.
 * For client errors: a JSON object with a `message` describing the validation error with status `400`.
 * For server errors: a JSON object `{ message: 'User Creation Failed', error: <error message> }` with status `500`.
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let userData;

        try {
            userData = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
        }

        // Validate required email field
        if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Handle optional image upload
        const file = formData.get('image') as File;

        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'Users' }, (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }).end(buffer);
            });

            userData.image = (uploadResult as { secure_url: string }).secure_url;
        }

        const createUser = await User.create(userData);

        return NextResponse.json({ message: 'User Created Successfully', user: createUser }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'User Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}

/**
 * Fetches all User documents from the database sorted by newest first.
 *
 * @returns A JSON response with `{ message, users }` where `users` is an array of User objects on success (HTTP 200), or `{ message, error }` on failure (HTTP 500).
 */
export async function GET() {
    try {
        await connectDB();

        const users = await User.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Users fetched successfully', users }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'User fetching failed', error: e }, { status: 500 })
    }
}
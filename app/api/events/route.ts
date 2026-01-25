import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

/**
 * Handle POST requests to create a new event with an uploaded image and persist it to the database.
 *
 * Attempts to parse form data, upload the provided `image` file to Cloudinary, attach the resulting image URL to the event data, and create an Event document.
 *
 * @returns For a successful creation: a JSON object `{ message: 'Event Created Successfully', event: <created event> }` with status `201`.  
 * For client errors: a JSON object with a `message` describing the validation error (e.g., `'Invalid JSON data format'` or `'Image file is required'`) with status `400`.  
 * For server errors: a JSON object `{ message: 'Event Creation Failed', error: <error message> }` with status `500`.
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;


        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
        }

        const file = formData.get('image') as File;

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 });

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event Created Successfully', event: createEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Uknown' }, { status: 500 })
    }
}

/**
 * Fetches all Event documents from the database sorted by newest first.
 *
 * @returns A JSON response with `{ message, events }` where `events` is an array of Event objects on success (HTTP 200), or `{ message, error }` on failure (HTTP 500).
 */
export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 })
    }
}
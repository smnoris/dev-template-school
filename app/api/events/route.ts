import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

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

        // Validate and parse tags
        const tagsRaw = formData.get('tags');
        if (!tagsRaw || typeof tagsRaw !== 'string' || tagsRaw.trim() === '') {
            return NextResponse.json({ message: 'Tags field is required and must be a non-empty string' }, { status: 400 });
        }
        let tags;
        try {
            tags = JSON.parse(tagsRaw);
            if (!Array.isArray(tags)) {
                return NextResponse.json({ message: 'Tags must be a valid JSON array' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({
                message: 'Failed to parse tags field',
                error: error instanceof Error ? error.message : 'Invalid JSON format'
            }, { status: 400 });
        }

        // Validate and parse agenda
        const agendaRaw = formData.get('agenda');
        if (!agendaRaw || typeof agendaRaw !== 'string' || agendaRaw.trim() === '') {
            return NextResponse.json({ message: 'Agenda field is required and must be a non-empty string' }, { status: 400 });
        }
        let agenda;
        try {
            agenda = JSON.parse(agendaRaw);
            if (!Array.isArray(agenda)) {
                return NextResponse.json({ message: 'Agenda must be a valid JSON array' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({
                message: 'Failed to parse agenda field',
                error: error instanceof Error ? error.message : 'Invalid JSON format'
            }, { status: 400 });
        }

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

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 })
    }
}

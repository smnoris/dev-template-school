import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/** Route context containing dynamic URL parameters */
interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** Standard API response structure */
interface ApiResponse {
  message: string;
  event?: IEvent;
  error?: string;
}

/**
 * Determines whether a slug consists of lowercase alphanumeric segments separated by single hyphens, with no leading or trailing hyphens.
 *
 * @param slug - The slug to validate
 * @returns `true` if `slug` matches the required format, `false` otherwise.
 */
function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Fetches an event by its route `slug` and returns a standard API response containing the event when found.
 *
 * @param context - Route context whose `params` promise yields an object with a `slug` string extracted from the URL.
 * @returns An API response object with a `message` and, on success, an `event` property. Possible HTTP statuses:
 * - 200: event found and returned
 * - 400: missing or invalid `slug` parameter
 * - 404: event not found
 * - 500: server or database error (includes error message when available)
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  try {
    // Connect to the database
    await connectDB();
    //  Extract slug from URL
    const { slug } = await context.params;

    // Validate slug presence
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 }
      );
    } // If the slug parameter is not present or is an empty string, return a 400 error response with a message indicating that the slug parameter is required.


    // Validate slug format
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    };

    // Parse tags and agenda if they're stored as strings in the database
    if (event.tags && typeof event.tags === 'string') {
      event.tags = JSON.parse(event.tags);
    }
    if (event.agenda && typeof event.agenda === 'string') {
      event.agenda = JSON.parse(event.agenda);
    }

    // Return successful response with event data
    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error) {
    //Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching event by slug:", error);
    }

    //Handle specific error types.
    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: "Database connection error", error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Event fetching failed", error: error.message },
        { status: 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { message: "Event fetching failed" },
      { status: 500 }
    );
  }
}

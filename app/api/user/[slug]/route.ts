import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/database/user.model";

/** Route context containing dynamic URL parameters */
interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** Standard API response structure */
interface ApiResponse {
  message: string;
  user?: IUser;
  error?: string;
}

/**
 * Validates if the provided string is a valid email format.
 *
 * @param email - The email to validate
 * @returns `true` if `email` matches the required format, `false` otherwise.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Fetches a user by their email (passed as `slug` in the URL) and returns a standard API response containing the user when found.
 *
 * @param context - Route context whose `params` promise yields an object with a `slug` string (email) extracted from the URL.
 * @returns An API response object with a `message` and, on success, a `user` property. Possible HTTP statuses:
 * - 200: user found and returned
 * - 400: missing or invalid email parameter
 * - 404: user not found
 * - 500: server or database error (includes error message when available)
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  try {
    // Connect to the database
    await connectDB();
    // Extract slug (email) from URL
    const { slug } = await context.params;

    // Validate slug presence
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Decode the email (URLs encode @ as %40)
    const decodedEmail = decodeURIComponent(slug);

    // Validate email format
    if (!isValidEmail(decodedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize email
    const sanitizedEmail = decodedEmail.trim().toLowerCase();

    // Query user by email
    const user = await User.findOne({ email: sanitizedEmail }).lean();

    // Handle user not found
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return successful response with user data
    return NextResponse.json(
      { message: "User fetched successfully", user },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching user by email:", error);
    }

    // Handle specific error types.
    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: "Database connection error", error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "User fetching failed", error: error.message },
        { status: 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { message: "User fetching failed" },
      { status: 500 }
    );
  }
}
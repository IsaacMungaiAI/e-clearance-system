import { NextRequest, NextResponse } from "next/server";
import { getRooms } from "@/app/actions/hostel-officer/get-rooms";

export async function GET(_req: NextRequest) {
    try {
        const data = await getRooms();
        return NextResponse.json(data);
    } catch (err) {
        console.error("API /api/hostel-officer/rooms GET error:", err);
        return NextResponse.json(
            { error: "Failed to load rooms" },
            { status: 500 }
        );
    }
}

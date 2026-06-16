import { db } from "@/app/db";
import { profiles } from "@/app/db/schema";
import { ilike } from "drizzle-orm";

export async function searchStudents(
    search: string
) {
    return db
        .select()
        .from(profiles)
        .where(
            ilike(
                profiles.fullName,
                `%${search}%`
            )
        );
}
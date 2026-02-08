"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function fixHistoryDates() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    let updatedCount = 0;

    // Get all phone numbers with their history
    const phones = await db.phoneNumber.findMany({
        include: {
            history: {
                where: {
                    status: "FREE",
                },
                orderBy: {
                    changeDate: "asc", // Get oldest first
                },
            },
        },
    });

    // Update the first FREE history entry for each phone
    for (const phone of phones) {
        if (phone.history.length > 0) {
            // Update the very first FREE entry to match initialDate
            const firstFreeEntry = phone.history[0];

            await db.numberHistory.update({
                where: { id: firstFreeEntry.id },
                data: { changeDate: phone.initialDate },
            });

            updatedCount++;
        }
    }

    revalidatePath("/dashboard");
    return { success: true, updatedCount };
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function bulkUpdateHistoryDates(
    phoneIds: string[],
    newDate: Date,
    status: "FREE" | "USED"
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    let updatedCount = 0;

    // Get all phone numbers with their history
    const phones = await db.phoneNumber.findMany({
        where: {
            id: { in: phoneIds },
        },
        include: {
            history: {
                where: { status },
                orderBy: { changeDate: "desc" },
            },
        },
    });

    // Update the most recent matching status history entry for each phone
    for (const phone of phones) {
        if (phone.history.length > 0) {
            const latestEntry = phone.history[0];

            await db.numberHistory.update({
                where: { id: latestEntry.id },
                data: { changeDate: new Date(newDate) },
            });

            updatedCount++;
        }
    }

    revalidatePath("/clients");
    return { success: true, updatedCount };
}

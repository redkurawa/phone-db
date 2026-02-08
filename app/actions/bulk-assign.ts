"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function bulkAssignToClient(phoneIds: string[], clientName: string, assignmentDate: Date) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const changeDate = new Date(assignmentDate);

    await db.$transaction(async (tx) => {
        // Update all selected phones
        await tx.phoneNumber.updateMany({
            where: {
                id: { in: phoneIds },
                status: "FREE" // Only assign FREE numbers
            },
            data: {
                status: "USED",
                currentClient: clientName,
            },
        });

        // Create history entries for each
        const phones = await tx.phoneNumber.findMany({
            where: { id: { in: phoneIds } },
        });

        for (const phone of phones) {
            await tx.numberHistory.create({
                data: {
                    phoneNumberId: phone.id,
                    status: "USED",
                    clientName,
                    changeDate,
                },
            });
        }
    });

    revalidatePath("/dashboard");
    return { success: true, count: phoneIds.length };
}

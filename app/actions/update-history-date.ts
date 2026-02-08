"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateHistoryDate(historyId: string, newDate: Date) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.numberHistory.update({
        where: { id: historyId },
        data: { changeDate: newDate },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

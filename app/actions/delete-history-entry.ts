"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteHistoryEntry(historyId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.numberHistory.delete({
        where: { id: historyId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/clients");
    return { success: true };
}

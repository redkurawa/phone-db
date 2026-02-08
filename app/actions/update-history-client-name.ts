"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateHistoryClientName(historyId: string, newClientName: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    console.log("updateHistoryClientName called with historyId:", historyId, "newClientName:", newClientName);

    // Get the old client name from this history entry
    const historyEntry = await db.numberHistory.findUnique({
        where: { id: historyId },
        select: { clientName: true },
    });

    console.log("Found history entry:", historyEntry);

    if (!historyEntry || !historyEntry.clientName) {
        throw new Error("History entry not found or has no client name");
    }

    const oldClientName = historyEntry.clientName;
    const trimmedNewName = newClientName.trim();

    console.log("Will update from:", oldClientName, "to:", trimmedNewName);

    if (!trimmedNewName) {
        throw new Error("New client name cannot be empty");
    }

    // Update ALL history entries with the old client name
    const historyResult = await db.numberHistory.updateMany({
        where: { clientName: oldClientName },
        data: { clientName: trimmedNewName },
    });

    console.log("Updated history entries:", historyResult.count);

    // Update ALL phone numbers with the old client name
    const phoneResult = await db.phoneNumber.updateMany({
        where: { currentClient: oldClientName },
        data: { currentClient: trimmedNewName },
    });

    console.log("Updated phone numbers:", phoneResult.count);

    revalidatePath("/dashboard");
    revalidatePath("/clients");

    return { success: true, historyUpdated: historyResult.count, phonesUpdated: phoneResult.count };
}

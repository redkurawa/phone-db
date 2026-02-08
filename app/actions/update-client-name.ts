"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateClientName(oldClientName: string, newClientName: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    console.log("updateClientName called with oldName:", oldClientName, "newName:", newClientName);

    const trimmedNewName = newClientName.trim();

    if (!trimmedNewName) {
        throw new Error("New client name cannot be empty");
    }

    if (oldClientName === trimmedNewName) {
        throw new Error("New name is the same as old name");
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

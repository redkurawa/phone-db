"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateBlockInitialDate(phoneIds: string[], newDate: Date) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.phoneNumber.updateMany({
        where: { id: { in: phoneIds } },
        data: { initialDate: newDate },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

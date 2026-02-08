"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateInitialDate(phoneId: string, newDate: Date) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.phoneNumber.update({
        where: { id: phoneId },
        data: { initialDate: newDate },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

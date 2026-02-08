"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { preserveLeadingZeros } from "@/lib/utils";

export async function generateStandardBlock(baseNumber: string, initialDate: Date) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const numbers = [];
    // Standard block: baseNumber + 00, then add 0-99
    // Example: 021292630 → 02129263000 to 02129263099
    const baseWithSuffix = baseNumber + "00";
    const targetLength = baseWithSuffix.length;

    for (let i = 0; i < 100; i++) {
        const numValue = BigInt(baseWithSuffix) + BigInt(i);
        const number = numValue.toString().padStart(targetLength, '0');
        numbers.push({
            number,
            status: "FREE" as const,
            initialDate: new Date(initialDate),
        });
    }

    await db.$transaction(async (tx) => {
        for (const num of numbers) {
            const phone = await tx.phoneNumber.create({
                data: num,
            });

            await tx.numberHistory.create({
                data: {
                    phoneNumberId: phone.id,
                    status: "FREE",
                    clientName: null,
                    changeDate: new Date(initialDate),
                },
            });
        }
    });

    revalidatePath("/dashboard");
    return { success: true, count: 100 };
}

export async function generateCustomRange(
    startNumber: string,
    endNumber: string,
    initialDate: Date
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (end - start > 1000 || end < start) {
        throw new Error("Invalid range (max 1000 numbers)");
    }

    const numbers = [];
    for (let i = start; i <= end; i++) {
        const number = preserveLeadingZeros(i, startNumber);
        numbers.push({
            number,
            status: "FREE" as const,
            initialDate: new Date(initialDate),
        });
    }

    await db.$transaction(async (tx) => {
        for (const num of numbers) {
            const phone = await tx.phoneNumber.create({
                data: num,
            });

            await tx.numberHistory.create({
                data: {
                    phoneNumberId: phone.id,
                    status: "FREE",
                    clientName: null,
                    changeDate: new Date(initialDate),
                },
            });
        }
    });

    revalidatePath("/dashboard");
    return { success: true, count: end - start + 1 };
}

export async function togglePhoneStatus(
    id: string,
    newStatus: "FREE" | "USED",
    clientName?: string,
    assignmentDate?: Date
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const changeDate = assignmentDate ? new Date(assignmentDate) : new Date();

    await db.$transaction(async (tx) => {
        await tx.phoneNumber.update({
            where: { id },
            data: {
                status: newStatus,
                currentClient: newStatus === "USED" ? clientName : null,
            },
        });

        await tx.numberHistory.create({
            data: {
                phoneNumberId: id,
                status: newStatus,
                clientName: newStatus === "USED" ? clientName : null,
                changeDate,
            },
        });
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteBlock(prefix: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const phones = await db.phoneNumber.findMany({
        where: {
            number: {
                startsWith: prefix,
            },
        },
    });

    await db.phoneNumber.deleteMany({
        where: {
            id: {
                in: phones.map((p) => p.id),
            },
        },
    });

    revalidatePath("/dashboard");
    return { success: true, count: phones.length };
}

export async function bulkAssignClient(phoneIds: string[], clientName: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.$transaction(async (tx) => {
        for (const id of phoneIds) {
            await tx.phoneNumber.update({
                where: { id },
                data: {
                    status: "USED",
                    currentClient: clientName,
                },
            });

            await tx.numberHistory.create({
                data: {
                    phoneNumberId: id,
                    status: "USED",
                    clientName,
                    changeDate: new Date(),
                },
            });
        }
    });

    revalidatePath("/dashboard");
    return { success: true, count: phoneIds.length };
}

export async function getPhoneNumbers() {
    const session = await auth();
    if (!session?.user || !session.user.isApproved) {
        throw new Error("Unauthorized");
    }

    const phones = await db.phoneNumber.findMany({
        orderBy: { number: "asc" },
        include: {
            history: {
                orderBy: { changeDate: "desc" },
            },
        },
    });

    const stats = {
        total: phones.length,
        free: phones.filter((p) => p.status === "FREE").length,
        used: phones.filter((p) => p.status === "USED").length,
    };

    return { phones, stats };
}

export async function getPhoneHistory(phoneId: string) {
    const session = await auth();
    if (!session?.user || !session.user.isApproved) {
        throw new Error("Unauthorized");
    }

    const history = await db.numberHistory.findMany({
        where: { phoneNumberId: phoneId },
        orderBy: { changeDate: "desc" },
    });

    return history;
}

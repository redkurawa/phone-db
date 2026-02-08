"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getPendingUsers() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: "desc" },
    });

    return users;
}

export async function getAllUsers() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return users;
}

export async function approveUser(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.user.update({
        where: { id: userId },
        data: { isApproved: true },
    });

    revalidatePath("/users");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function rejectUser(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.user.delete({
        where: { id: userId },
    });

    revalidatePath("/users");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await db.user.delete({
        where: { id: userId },
    });

    revalidatePath("/users");
    return { success: true };
}

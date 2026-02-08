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

export async function toggleUserRole(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    // Prevent admin from changing their own role
    if (session.user.id === userId) {
        throw new Error("Cannot change your own role");
    }

    // Get the user to toggle
    const userToToggle = await db.user.findUnique({
        where: { id: userId },
    });

    if (!userToToggle) {
        throw new Error("User not found");
    }

    // If demoting an admin to user, check that there's at least 1 other admin
    if (userToToggle.role === "ADMIN") {
        const adminCount = await db.user.count({
            where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
            throw new Error("Cannot demote the last admin");
        }
    }

    // Toggle the role
    const newRole = userToToggle.role === "ADMIN" ? "VIEWER" : "ADMIN";

    await db.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    revalidatePath("/users");
    return { success: true };
}

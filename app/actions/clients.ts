"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getAllClients() {
    const session = await auth();
    if (!session?.user || !session.user.isApproved) {
        throw new Error("Unauthorized");
    }

    const phones = await db.phoneNumber.findMany({
        where: {
            status: "USED",
            currentClient: {
                not: null,
            },
        },
        select: {
            currentClient: true,
            history: {
                where: { status: "USED" },
                orderBy: { changeDate: "desc" },
                take: 1,
            },
        },
    });

    // Group by client and count
    const clientMap = new Map<string, { count: number, historyId: string }>();
    phones.forEach((phone) => {
        if (phone.currentClient && phone.history.length > 0) {
            const existing = clientMap.get(phone.currentClient);
            if (existing) {
                existing.count++;
            } else {
                clientMap.set(phone.currentClient, {
                    count: 1,
                    historyId: phone.history[0].id,
                });
            }
        }
    });

    const clients = Array.from(clientMap.entries()).map(([name, data]) => ({
        name,
        phoneCount: data.count,
        historyId: data.historyId,
    }));

    return clients.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getClientPhones(clientName: string) {
    const session = await auth();
    if (!session?.user || !session.user.isApproved) {
        throw new Error("Unauthorized");
    }

    const phones = await db.phoneNumber.findMany({
        where: {
            currentClient: clientName,
            status: "USED",
        },
        orderBy: { number: "asc" },
        include: {
            history: {
                orderBy: { changeDate: "desc" },
            },
        },
    });

    return phones;
}

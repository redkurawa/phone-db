import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { DashboardClient } from "@/components/dashboard-client";
import { getPhoneNumbers } from "@/app/actions/phone-numbers";
import { getPendingUsers } from "@/app/actions/users";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    if (!session.user.isApproved) {
        redirect("/pending");
    }

    const { phones, stats } = await getPhoneNumbers();
    const pendingUsers = session.user.role === "ADMIN" ? await getPendingUsers() : [];

    return (
        <div>
            <Header />
            <DashboardClient
                phones={phones}
                stats={stats}
                pendingUsersCount={pendingUsers.length}
                isAdmin={session.user.role === "ADMIN"}
            />
        </div>
    );
}

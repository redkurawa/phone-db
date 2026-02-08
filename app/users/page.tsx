import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { UsersClient } from "@/components/users-client";
import { getAllUsers } from "@/app/actions/users";

export default async function UsersPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await getAllUsers();

    return (
        <div>
            <Header />
            <UsersClient users={users} />
        </div>
    );
}

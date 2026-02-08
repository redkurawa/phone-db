import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ClientsClient } from "@/components/clients-client";
import { getAllClients } from "@/app/actions/clients";

export default async function ClientsPage() {
    const session = await auth();

    if (!session?.user || !session.user.isApproved) {
        redirect("/dashboard");
    }

    const clients = await getAllClients();
    const isAdmin = session.user.role === "ADMIN";

    return (
        <div>
            <Header />
            <ClientsClient clients={clients} isAdmin={isAdmin} />
        </div>
    );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ClientDetailClient } from "@/components/client-detail-client";
import { getClientPhones } from "@/app/actions/clients";

export default async function ClientDetailPage({
    params,
}: {
    params: { name: string };
}) {
    const session = await auth();

    if (!session?.user || !session.user.isApproved) {
        redirect("/dashboard");
    }

    const clientName = decodeURIComponent(params.name);
    const phones = await getClientPhones(clientName);

    return (
        <div>
            <Header />
            <ClientDetailClient
                clientName={clientName}
                phones={phones}
                isAdmin={session.user.role === "ADMIN"}
            />
        </div>
    );
}

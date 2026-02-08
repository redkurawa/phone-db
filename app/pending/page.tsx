import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default async function PendingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    if (session.user.isApproved) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass-morphism animate-scale-in">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Pending Approval</CardTitle>
                    <CardDescription className="text-base">
                        Your account is waiting for admin approval. Please check back later.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-800">
                            <strong>Note:</strong> An administrator will review your request shortly. You'll be able to access the system once approved.
                        </p>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <Button type="submit" variant="outline" className="w-full">
                            Sign Out
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

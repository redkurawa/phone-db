"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Search, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/animated-card";
import { EditClientNameDialog } from "@/components/edit-client-name-dialog";

export function ClientsClient({ clients, isAdmin = false }: { clients: any[], isAdmin?: boolean }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingClient, setEditingClient] = useState<string | null>(null);

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-primary" />
                            <CardTitle>Clients</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client, index) => (
                    <AnimatedCard key={client.name} delay={index * 0.05}>
                        <Link href={`/clients/${encodeURIComponent(client.name)}`}>
                            <CardContent className="p-6 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{client.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {client.phoneCount} number{client.phoneCount !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Edit button clicked for client:", client.name);
                                                setEditingClient(client.name);
                                            }}
                                            className="h-8 px-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Link>
                    </AnimatedCard>
                ))}
            </div>

            {filteredClients.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {searchQuery ? "No clients found" : "No clients yet"}
                    </p>
                </motion.div>
            )}

            {isAdmin && editingClient && (
                <EditClientNameDialog
                    open={!!editingClient}
                    onOpenChange={(open) => !open && setEditingClient(null)}
                    currentClientName={editingClient}
                />
            )}
        </div>
    );
}

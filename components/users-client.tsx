"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveUser, rejectUser, deleteUser } from "@/app/actions/users";

export function UsersClient({ users }: { users: any[] }) {
    const [processing, setProcessing] = useState<string | null>(null);

    const handleApprove = async (userId: string) => {
        setProcessing(userId);
        await approveUser(userId);
        window.location.reload();
    };

    const handleReject = async (userId: string) => {
        if (!confirm("Reject this user?")) return;
        setProcessing(userId);
        await rejectUser(userId);
        window.location.reload();
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Delete this user?")) return;
        setProcessing(userId);
        await deleteUser(userId);
        window.location.reload();
    };

    const pendingUsers = users.filter((u) => !u.isApproved);
    const approvedUsers = users.filter((u) => u.isApproved);

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            <CardTitle>User Management</CardTitle>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Pending Users */}
            {pendingUsers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Pending Approval</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingUsers.map((user) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-amber-50/50"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={processing === user.id}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleReject(user.id)}
                                            disabled={processing === user.id}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Approved Users */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {approvedUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 rounded-lg border"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={processing === user.id}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

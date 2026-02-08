"use client";

import { format } from "date-fns";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { EditHistoryDateDialog } from "@/components/edit-history-date-dialog";
import { deleteHistoryEntry } from "@/app/actions/delete-history-entry";

interface HistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneNumber: string;
    history: any[];
    isAdmin?: boolean;
}

export function HistoryModal({
    open,
    onOpenChange,
    phoneNumber,
    history,
    isAdmin = false,
}: HistoryModalProps) {
    const [editingHistory, setEditingHistory] = useState<any | null>(null);

    const handleDelete = async (historyId: string) => {
        if (!confirm("Are you sure you want to delete this history entry? This action cannot be undone.")) {
            return;
        }
        try {
            await deleteHistoryEntry(historyId);
            window.location.reload();
        } catch (error) {
            alert("Failed to delete history entry");
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>History for {phoneNumber}</DialogTitle>
                </DialogHeader>

                {history.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No history yet</p>
                ) : (
                    <div className="space-y-4 mt-4">
                        {history.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                            >
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={entry.status === "FREE" ? "success" : "default"}>
                                            {entry.status}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {format(new Date(entry.changeDate || entry.createdAt), "MMM d, yyyy")}
                                        </span>
                                        {isAdmin && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingHistory(entry)}
                                                    className="h-6 px-2"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="h-6 px-2 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    {entry.clientName && (
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Client:</span>{" "}
                                            <span className="font-medium">{entry.clientName}</span>
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {isAdmin && editingHistory && (
                    <EditHistoryDateDialog
                        open={!!editingHistory}
                        onOpenChange={(open) => !open && setEditingHistory(null)}
                        historyId={editingHistory.id}
                        historyStatus={editingHistory.status}
                        currentDate={editingHistory.changeDate || editingHistory.createdAt}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

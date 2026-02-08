"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { updateClientName } from "@/app/actions/update-client-name";

interface EditClientNameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentClientName: string;
}

export function EditClientNameDialog({
    open,
    onOpenChange,
    currentClientName,
}: EditClientNameDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [clientName, setClientName] = useState(currentClientName || "");
    const router = useRouter();

    useEffect(() => {
        if (open) {
            console.log("EditClientNameDialog opened for client:", currentClientName);
            setClientName(currentClientName || "");
        }
    }, [open, currentClientName]);

    const handleUpdate = async () => {
        console.log("handleUpdate called! clientName:", clientName);

        if (!clientName.trim()) {
            console.log("Client name is empty");
            alert("Client name cannot be empty");
            return;
        }

        if (clientName.trim() === currentClientName) {
            alert("New name is the same as current name");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Calling updateClientName with oldName:", currentClientName, "newName:", clientName);
            const result = await updateClientName(currentClientName, clientName);
            console.log("Update result:", result);
            onOpenChange(false);
            // Force hard refresh to see changes
            router.refresh();
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Error updating client name:", error);
            alert("Failed to update client name: " + (error instanceof Error ? error.message : String(error)));
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Client Name</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium">Client Name</label>
                        <Input
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Enter client name..."
                            autoFocus
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLoading) {
                                    handleUpdate();
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Current: {currentClientName}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                console.log("Update button clicked!");
                                handleUpdate();
                            }}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="sm" /> : "Update"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

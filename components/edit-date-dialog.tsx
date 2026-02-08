"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { updateInitialDate } from "@/app/actions/update-date";

interface EditDateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneId: string;
    phoneNumber: string;
    currentDate: Date;
}

export function EditDateDialog({
    open,
    onOpenChange,
    phoneId,
    phoneNumber,
    currentDate,
}: EditDateDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newDate, setNewDate] = useState(
        new Date(currentDate).toISOString().split("T")[0]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDate) return;

        setIsLoading(true);
        try {
            await updateInitialDate(phoneId, new Date(newDate));
            onOpenChange(false);
            window.location.reload();
        } catch (error) {
            alert("Failed to update date");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Initial Date - {phoneNumber}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium">Initial Date</label>
                        <Input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Current: {new Date(currentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="sm" /> : "Update Date"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

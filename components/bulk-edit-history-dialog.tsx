"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { bulkUpdateHistoryDates } from "@/app/actions/bulk-update-history-dates";
import { format } from "date-fns";

interface BulkEditHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPhoneIds: string[];
    clientName: string;
}

export function BulkEditHistoryDialog({
    open,
    onOpenChange,
    selectedPhoneIds,
    clientName,
}: BulkEditHistoryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newDate, setNewDate] = useState<Date>(new Date());

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const result = await bulkUpdateHistoryDates(selectedPhoneIds, newDate, "USED");
            alert(`Successfully updated ${result.updatedCount} history entries!`);
            onOpenChange(false);
            window.location.reload();
        } catch (error) {
            alert("Failed to update history dates");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Edit Assignment Dates</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <p className="text-sm font-medium">Client: {clientName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Updating {selectedPhoneIds.length} phone number{selectedPhoneIds.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">New Assignment Date</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Selected: {format(newDate, "MMM d, yyyy")}
                        </p>
                        <div className="flex justify-center border rounded-md">
                            <Calendar
                                mode="single"
                                selected={newDate}
                                onSelect={(date) => date && setNewDate(date)}
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={new Date().getFullYear() + 1}
                                className="rounded-md"
                            />
                        </div>
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
                        <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="sm" /> : "Update All"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

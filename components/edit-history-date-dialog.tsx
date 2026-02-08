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
import { updateHistoryDate } from "@/app/actions/update-history-date";
import { format } from "date-fns";

interface EditHistoryDateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    historyId: string;
    historyStatus: string;
    currentDate: Date;
}

export function EditHistoryDateDialog({
    open,
    onOpenChange,
    historyId,
    historyStatus,
    currentDate,
}: EditHistoryDateDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate));

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await updateHistoryDate(historyId, selectedDate);
            onOpenChange(false);
            window.location.reload();
        } catch (error) {
            alert("Failed to update history date");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit History Date</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium">Status: {historyStatus}</label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current: {format(new Date(currentDate), "MMM d, yyyy")}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            captionLayout="dropdown"
                            fromYear={2000}
                            toYear={new Date().getFullYear() + 1}
                            className="rounded-md border"
                        />
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
                            {isLoading ? <LoadingSpinner size="sm" /> : "Update"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

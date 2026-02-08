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
import { Calendar } from "@/components/ui/calendar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { togglePhoneStatus } from "@/app/actions/phone-numbers";
import { format } from "date-fns";

interface AssignNumberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneId: string;
    phoneNumber: string;
}

export function AssignNumberDialog({
    open,
    onOpenChange,
    phoneId,
    phoneNumber,
}: AssignNumberDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [clientName, setClientName] = useState("");
    const [assignmentDate, setAssignmentDate] = useState<Date>(new Date());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName.trim()) return;

        setIsLoading(true);
        try {
            await togglePhoneStatus(phoneId, "USED", clientName.trim(), assignmentDate);
            onOpenChange(false);
            setClientName("");
            setAssignmentDate(new Date());
            window.location.reload();
        } catch (error) {
            alert("Failed to assign number");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign {phoneNumber} to Client</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium">Client Name</label>
                        <Input
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Enter client name..."
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Assignment Date</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Selected: {format(assignmentDate, "MMM d, yyyy")}
                        </p>
                        <div className="flex justify-center border rounded-md">
                            <Calendar
                                mode="single"
                                selected={assignmentDate}
                                onSelect={(date) => date && setAssignmentDate(date)}
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
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="sm" /> : "Assign"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/loading-spinner";
import { generateStandardBlock, generateCustomRange } from "@/app/actions/phone-numbers";

interface AddNumbersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddNumbersDialog({ open, onOpenChange }: AddNumbersDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [baseNumber, setBaseNumber] = useState("");
    const [startNumber, setStartNumber] = useState("");
    const [endNumber, setEndNumber] = useState("");
    const [initialDate, setInitialDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleStandardBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!baseNumber) return;

        setIsLoading(true);
        try {
            await generateStandardBlock(baseNumber, new Date(initialDate));
            onOpenChange(false);
            window.location.reload();
        } catch (error) {
            alert("Failed to generate numbers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomRange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startNumber || !endNumber) return;

        setIsLoading(true);
        try {
            await generateCustomRange(startNumber, endNumber, new Date(initialDate));
            onOpenChange(false);
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to generate numbers");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Phone Numbers</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="standard" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">Standard Block</TabsTrigger>
                        <TabsTrigger value="custom">Custom Range</TabsTrigger>
                    </TabsList>

                    <TabsContent value="standard">
                        <form onSubmit={handleStandardBlock} className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm font-medium">Base Number</label>
                                <Input
                                    type="text"
                                    placeholder="e.g., 02129263000"
                                    value={baseNumber}
                                    onChange={(e) => setBaseNumber(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Will generate 100 numbers (base + 0 to 99)
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Initial Date</label>
                                <Input
                                    type="date"
                                    value={initialDate}
                                    onChange={(e) => setInitialDate(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner size="sm" /> : "Generate 100 Numbers"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="custom">
                        <form onSubmit={handleCustomRange} className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm font-medium">Start Number</label>
                                <Input
                                    type="text"
                                    placeholder="e.g., 061229933"
                                    value={startNumber}
                                    onChange={(e) => setStartNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">End Number</label>
                                <Input
                                    type="text"
                                    placeholder="e.g., 061229999"
                                    value={endNumber}
                                    onChange={(e) => setEndNumber(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max 1000 numbers. Leading zeros will be preserved.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Initial Date</label>
                                <Input
                                    type="date"
                                    value={initialDate}
                                    onChange={(e) => setInitialDate(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner size="sm" /> : "Generate Numbers"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

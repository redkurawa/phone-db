"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneNumberCard } from "@/components/phone-number-card";
import { EditBlockDateDialog } from "@/components/edit-block-date-dialog";
import { deleteBlock } from "@/app/actions/phone-numbers";

interface PhoneBlockProps {
    block: {
        prefix: string;
        numbers: any[];
    };
    index: number;
    isAdmin: boolean;
    selectedPhoneIds?: string[];
    onToggleSelection?: (phoneId: string) => void;
}

export function PhoneBlock({ block, index, isAdmin, selectedPhoneIds = [], onToggleSelection }: PhoneBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showEditBlockDate, setShowEditBlockDate] = useState(false);
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const freeCount = block.numbers.filter((n) => n.status === "FREE").length;
    const usedCount = block.numbers.filter((n) => n.status === "USED").length;
    const usagePercent = Math.round((usedCount / block.numbers.length) * 100);

    const handleDelete = async () => {
        if (!confirm(`Delete all ${block.numbers.length} numbers in this block?`)) return;

        setIsDeleting(true);
        try {
            await deleteBlock(block.prefix);
            window.location.reload();
        } catch (error) {
            alert("Failed to delete block");
            setIsDeleting(false);
        }
    };

    const handleSelectBlockFree = () => {
        if (!onToggleSelection) return;
        const freePhoneIds = block.numbers
            .filter(p => p.status === "FREE")
            .map(p => p.id);

        // Toggle all: if all are selected, deselect all; otherwise select all
        const allSelected = freePhoneIds.every(id => selectedPhoneIds.includes(id));

        freePhoneIds.forEach(id => {
            const isCurrentlySelected = selectedPhoneIds.includes(id);
            if (allSelected && isCurrentlySelected) {
                onToggleSelection(id); // Deselect
            } else if (!allSelected && !isCurrentlySelected) {
                onToggleSelection(id); // Select
            }
        });
    };

    const blockFreeCount = block.numbers.filter(n => n.status === "FREE").length;
    const blockFreeSelectedCount = block.numbers.filter(n =>
        n.status === "FREE" && selectedPhoneIds.includes(n.id)
    ).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">Block: {block.prefix}XX</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-muted-foreground">
                                    Total: {block.numbers.length}
                                </span>
                                <Badge variant="success">{freeCount} Free</Badge>
                                <Badge variant="default">{usedCount} Used</Badge>
                                {blockFreeSelectedCount > 0 && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">
                                        {blockFreeSelectedCount} Selected
                                    </Badge>
                                )}
                                <div className="flex-1 max-w-xs">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                                            style={{ width: `${usagePercent}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{usagePercent}% used</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Checkbox
                                    id={`show-free-${block.prefix}`}
                                    checked={showFreeOnly}
                                    onCheckedChange={(checked) => setShowFreeOnly(checked as boolean)}
                                />
                                <label
                                    htmlFor={`show-free-${block.prefix}`}
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    FREE
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                {isAdmin && blockFreeCount > 0 && onToggleSelection && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectBlockFree();
                                        }}
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                    >
                                        {blockFreeSelectedCount === blockFreeCount ? "Deselect" : "Select"} Block FREE ({blockFreeCount})
                                    </Button>
                                )}
                                {isAdmin && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowEditBlockDate(true);
                                            }}
                                            title="Edit block date"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete();
                                            }}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            {isDeleting ? "Deleting..." : "Delete Block"}
                                        </Button>
                                    </>
                                )}
                                <Button variant="ghost" size="sm">
                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                        >
                            {block.numbers
                                .filter(phone => showFreeOnly ? phone.status === "FREE" : true)
                                .map((phone, idx) => (
                                    <motion.div
                                        key={phone.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                    >
                                        <PhoneNumberCard
                                            phone={phone}
                                            isAdmin={isAdmin}
                                            isSelected={selectedPhoneIds.includes(phone.id)}
                                            onToggleSelect={onToggleSelection ? () => onToggleSelection(phone.id) : undefined}
                                        />
                                    </motion.div>
                                ))}
                        </motion.div>
                    </CardContent>
                )}
            </Card>

            {/* Bulk Edit Date Dialog */}
            {isAdmin && showEditBlockDate && (
                <EditBlockDateDialog
                    open={showEditBlockDate}
                    onOpenChange={setShowEditBlockDate}
                    phoneIds={block.numbers.map(p => p.id)}
                    blockPrefix={block.prefix}
                    currentDate={block.numbers[0]?.initialDate}
                />
            )}
        </motion.div>
    );
}

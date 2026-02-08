"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryModal } from "@/components/history-modal";
import { EditDateDialog } from "@/components/edit-date-dialog";
import { AssignNumberDialog } from "@/components/assign-number-dialog";
import { togglePhoneStatus } from "@/app/actions/phone-numbers";
import { format } from "date-fns";

interface PhoneNumberCardProps {
    phone: any;
    isAdmin: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export function PhoneNumberCard({ phone, isAdmin, isSelected = false, onToggleSelect }: PhoneNumberCardProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [showEditDate, setShowEditDate] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleStatus = async () => {
        if (!isAdmin) return;

        if (phone.status === "FREE") {
            // Open dialog instead of prompt
            setShowAssignDialog(true);
        } else {
            if (!confirm("Set this number to FREE?")) return;

            setIsToggling(true);
            try {
                await togglePhoneStatus(phone.id, "FREE");
                window.location.reload();
            } catch (error) {
                alert("Failed to toggle status");
                setIsToggling(false);
            }
        }
    };

    return (
        <>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Card className={`p-4 space-y-3 transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                            {isAdmin && phone.status === "FREE" && onToggleSelect && (
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={onToggleSelect}
                                    className="mt-1"
                                />
                            )}
                            <div className="flex-1">
                                <p className="font-mono font-bold text-lg">{phone.number}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>Added: {format(new Date(phone.initialDate), "MMM d, yyyy")}</span>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setShowEditDate(true)}
                                            className="text-primary hover:text-primary/80 ml-1"
                                            title="Edit date"
                                        >
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Badge variant={phone.status === "FREE" ? "success" : "default"}>
                            {phone.status}
                        </Badge>
                    </div>

                    {phone.currentClient && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Client:</span>
                            <p className="font-medium">{phone.currentClient}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHistory(true)}
                            className="flex-1"
                        >
                            <Clock className="w-4 h-4 mr-1" />
                            History
                        </Button>
                        {isAdmin && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleStatus}
                                disabled={isToggling}
                                className="flex-1"
                            >
                                {isToggling ? "..." : phone.status === "FREE" ? "Mark Used" : "Mark Free"}
                            </Button>
                        )}
                    </div>
                </Card>
            </motion.div>

            <HistoryModal
                open={showHistory}
                onOpenChange={setShowHistory}
                phoneNumber={phone.number}
                history={phone.history}
                isAdmin={isAdmin}
            />

            {isAdmin && (
                <>
                    <EditDateDialog
                        open={showEditDate}
                        onOpenChange={setShowEditDate}
                        phoneId={phone.id}
                        phoneNumber={phone.number}
                        currentDate={phone.initialDate}
                    />
                    <AssignNumberDialog
                        open={showAssignDialog}
                        onOpenChange={setShowAssignDialog}
                        phoneId={phone.id}
                        phoneNumber={phone.number}
                    />
                </>
            )}
        </>
    );
}

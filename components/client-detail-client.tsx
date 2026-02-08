"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { HistoryModal } from "@/components/history-modal";
import { BulkEditHistoryDialog } from "@/components/bulk-edit-history-dialog";
import { useState } from "react";
import { format } from "date-fns";

export function ClientDetailClient({
    clientName,
    phones,
    isAdmin = false,
}: {
    clientName: string;
    phones: any[];
    isAdmin?: boolean;
}) {
    const [selectedPhone, setSelectedPhone] = useState<any | null>(null);
    const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>([]);
    const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);

    const handleToggleSelection = (phoneId: string) => {
        setSelectedPhoneIds(prev =>
            prev.includes(phoneId)
                ? prev.filter(id => id !== phoneId)
                : [...prev, phoneId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPhoneIds.length === phones.length) {
            setSelectedPhoneIds([]);
        } else {
            setSelectedPhoneIds(phones.map(p => p.id));
        }
    };

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/clients">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Clients
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>{clientName}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {phones.length} phone number{phones.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                            {isAdmin && selectedPhoneIds.length > 0 && (
                                <Button
                                    onClick={() => setShowBulkEditDialog(true)}
                                    size="sm"
                                >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Bulk Edit Dates ({selectedPhoneIds.length})
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {phones.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">
                                No phone numbers assigned
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {isAdmin && (
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedPhoneIds.length === phones.length && phones.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                        )}
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Initial Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phones.map((phone, index) => (
                                        <motion.tr
                                            key={phone.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b"
                                        >
                                            {isAdmin && (
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedPhoneIds.includes(phone.id)}
                                                        onCheckedChange={() => handleToggleSelection(phone.id)}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="font-mono font-medium">
                                                {phone.number}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={phone.status === "FREE" ? "success" : "default"}
                                                >
                                                    {phone.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(phone.initialDate), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedPhone(phone)}
                                                >
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    History
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {selectedPhone && (
                <HistoryModal
                    open={!!selectedPhone}
                    onOpenChange={() => setSelectedPhone(null)}
                    phoneNumber={selectedPhone.number}
                    history={selectedPhone.history}
                    isAdmin={isAdmin}
                />
            )}

            {isAdmin && (
                <BulkEditHistoryDialog
                    open={showBulkEditDialog}
                    onOpenChange={setShowBulkEditDialog}
                    selectedPhoneIds={selectedPhoneIds}
                    clientName={clientName}
                />
            )}
        </div>
    );
}

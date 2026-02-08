"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle, XCircle, Users, Plus, Search, X } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneBlock } from "@/components/phone-block";
import { AddNumbersDialog } from "@/components/add-numbers-dialog";
import { BulkAssignDialog } from "@/components/bulk-assign-dialog";
import { detectBlockPrefix } from "@/lib/utils";

interface DashboardClientProps {
    phones: any[];
    stats: {
        total: number;
        free: number;
        used: number;
    };
    pendingUsersCount: number;
    isAdmin: boolean;
}

export function DashboardClient({
    phones,
    stats,
    pendingUsersCount,
    isAdmin,
}: DashboardClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>([]);
    const [showBulkAssign, setShowBulkAssign] = useState(false);

    // Group phones by prefix
    const phoneBlocks = useMemo(() => {
        const blocks = new Map<string, any[]>();
        phones.forEach((phone) => {
            const prefix = detectBlockPrefix(phone.number);
            if (!blocks.has(prefix)) {
                blocks.set(prefix, []);
            }
            blocks.get(prefix)!.push(phone);
        });

        return Array.from(blocks.entries())
            .map(([prefix, numbers]) => ({
                prefix,
                numbers: numbers.sort((a, b) => a.number.localeCompare(b.number)),
            }))
            .sort((a, b) => a.prefix.localeCompare(b.prefix));
    }, [phones]);

    // Filter blocks based on search
    const filteredBlocks = useMemo(() => {
        if (!searchQuery) return phoneBlocks;

        const query = searchQuery.toLowerCase();
        const isNumberSearch = /^\d+$/.test(query);

        if (isNumberSearch) {
            return phoneBlocks
                .map((block) => ({
                    ...block,
                    numbers: block.numbers.filter((p) => p.number.includes(query)),
                }))
                .filter((block) => block.numbers.length > 0);
        } else {
            // Client name search
            return phoneBlocks
                .map((block) => ({
                    ...block,
                    numbers: block.numbers.filter((p) =>
                        p.currentClient?.toLowerCase().includes(query)
                    ),
                }))
                .filter((block) => block.numbers.length > 0);
        }
    }, [phoneBlocks, searchQuery]);

    const handleClearSelection = () => {
        setSelectedPhoneIds([]);
    };

    const handleBulkAssignSuccess = () => {
        setSelectedPhoneIds([]);
        window.location.reload();
    };

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Numbers"
                    value={stats.total}
                    icon={Phone}
                    color="from-blue-500 to-indigo-600"
                    delay={0}
                />
                <StatsCard
                    title="Free Numbers"
                    value={stats.free}
                    icon={CheckCircle}
                    color="from-green-500 to-emerald-600"
                    delay={0.1}
                />
                <StatsCard
                    title="Used Numbers"
                    value={stats.used}
                    icon={XCircle}
                    color="from-purple-500 to-pink-600"
                    delay={0.2}
                />
                {isAdmin && (
                    <StatsCard
                        title="Pending Users"
                        value={pendingUsersCount}
                        icon={Users}
                        color="from-amber-500 to-orange-600"
                        delay={0.3}
                    />
                )}
            </div>

            {/* Actions Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
            >
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by number or client name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {isAdmin && (
                    <Button onClick={() => setShowAddDialog(true)} size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Numbers
                    </Button>
                )}
            </motion.div>

            {/* Phone Blocks */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {filteredBlocks.map((block, index) => (
                        <PhoneBlock
                            key={block.prefix}
                            block={block}
                            index={index}
                            isAdmin={isAdmin}
                            selectedPhoneIds={selectedPhoneIds}
                            onToggleSelection={(phoneId) => {
                                setSelectedPhoneIds(prev =>
                                    prev.includes(phoneId)
                                        ? prev.filter(id => id !== phoneId)
                                        : [...prev, phoneId]
                                );
                            }}
                        />
                    ))}
                </AnimatePresence>

                {filteredBlocks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground"
                    >
                        <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">
                            {searchQuery ? "No numbers found matching your search" : "No numbers yet"}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Floating Bulk Action Bar */}
            {isAdmin && selectedPhoneIds.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4">
                        <span className="font-medium">
                            {selectedPhoneIds.length} number{selectedPhoneIds.length !== 1 ? 's' : ''} selected
                        </span>
                        <Button
                            onClick={() => setShowBulkAssign(true)}
                            size="sm"
                            className="bg-white text-blue-600 hover:bg-white/90"
                        >
                            Assign to Client
                        </Button>
                        <Button
                            onClick={handleClearSelection}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Add Numbers Dialog */}
            {isAdmin && (
                <AddNumbersDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
            )}

            {/* Bulk Assign Dialog */}
            {isAdmin && (
                <BulkAssignDialog
                    open={showBulkAssign}
                    onOpenChange={setShowBulkAssign}
                    selectedPhoneIds={selectedPhoneIds}
                    onSuccess={handleBulkAssignSuccess}
                />
            )}
        </div>
    );
}

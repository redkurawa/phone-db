"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    delay?: number;
}

export function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.05, y: -5 }}
        >
            <Card className="overflow-hidden hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}
                    >
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
                        className="text-3xl font-bold"
                    >
                        {value.toLocaleString()}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

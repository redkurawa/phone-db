"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface AnimatedCardProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function AnimatedCard({ children, delay = 0, className }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={className}
        >
            <Card className="h-full transition-shadow hover:shadow-xl">{children}</Card>
        </motion.div>
    );
}

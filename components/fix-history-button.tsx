"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fixHistoryDates } from "@/app/actions/fix-history-dates";
import { LoadingSpinner } from "@/components/loading-spinner";

export function FixHistoryButton() {
    const [isFixing, setIsFixing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; updatedCount: number } | null>(null);

    const handleFix = async () => {
        if (!confirm("This will update all FREE history entries to match their phone number's initialDate. Continue?")) {
            return;
        }

        setIsFixing(true);
        try {
            const res = await fixHistoryDates();
            setResult(res);
            alert(`Successfully updated ${res.updatedCount} history entries!`);
            window.location.reload();
        } catch (error) {
            alert("Failed to fix history dates");
        } finally {
            setIsFixing(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleFix}
                disabled={isFixing}
                variant="outline"
                size="sm"
            >
                {isFixing ? <LoadingSpinner size="sm" /> : "Fix History Dates"}
            </Button>
            {result && (
                <span className="text-sm text-green-600">
                    ✓ Updated {result.updatedCount} entries
                </span>
            )}
        </div>
    );
}

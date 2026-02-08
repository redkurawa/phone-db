import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPhoneNumber(number: string): string {
    return number;
}

export function detectBlockPrefix(number: string): string {
    // For standard blocks (100 numbers), take all but last 2 digits
    // For custom ranges, use the full number
    if (number.length >= 3) {
        return number.slice(0, -2);
    }
    return number;
}

export function preserveLeadingZeros(num: number, originalStr: string): string {
    const numStr = num.toString();
    const zerosNeeded = originalStr.length - numStr.length;
    return "0".repeat(Math.max(0, zerosNeeded)) + numStr;
}
